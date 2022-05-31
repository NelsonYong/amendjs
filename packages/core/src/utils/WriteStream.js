import EventEmitter from 'events'
import fs from 'fs'

export default class WriteStream extends EventEmitter {
	constructor(path, options) {
		super()
		this.path = path
		this.flags = options.flags || 'w'
		this.encoding = options.encoding || 'utf8'
		this.mode = options.mode || 0o666
		this.autoClose = options.autoClose || true
		this.start = options.start || 0
		this.highWaterMark = options.highWaterMark || 16 * 1024

		this.len = 0 // 待写入文件的数据长度
		this.needDrain = false // 需要触发drain
		this.cache = []
		// this.cache = new Queue;
		this.writing = false // 是不是正在写入
		this.offset = this.start // 偏移量

		this.open()
	}
	open() {
		fs.open(this.path, this.flags, this.mode, (err, fd) => {
			this.fd = fd
			this.emit('open', fd)
		})
	}
	write(chunk, encoding = this.encoding, cb = () => {}) {
		// 将数据转化为buffer
		chunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)

		this.len += chunk.length

		// 是否达到预期
		let returnValue = this.len < this.highWaterMark
		this.needDrain = !returnValue

		// AOP增加写入成功后清空缓存的逻辑
		let userCb = cb
		cb = () => {
			userCb()
			this.clearBuffer()
		}

		// 判断是不是正在写入，如果为false，表示是第一次写，后面的都先放到cache缓存区
		if (!this.writing) {
			// 直接写入
			this.writing = true
			this._write(chunk, encoding, cb)
		} else {
			// 保存到缓存区
			// this.cache.offer({
			this.cache.push({
				chunk,
				encoding,
				cb,
			})
		}

		return returnValue
	}
	_write(chunk, encoding, cb) {
		if (typeof this.fd !== 'number') {
			return this.once('open', () => this._write(chunk, encoding, cb))
		}
		fs.write(this.fd, chunk, 0, chunk.length, this.offset, (err, written) => {
			this.offset += written // 维护偏移量
			this.len -= written // 减少缓存的个数
			cb() // 写入成功回调
		})
	}
	// 清空缓存区
	clearBuffer() {
		let data = this.cache.shift()
		// let data = this.cache.poll();
		// 继续写入
		if (data) {
			this._write(data.chunk, data.encoding, data.cb)
			// 缓存区都清空后
		} else {
			this.writing = false
			if (this.needDrain) {
				this.needDrain = false
				this.emit('drain')
			}
		}
	}
}
