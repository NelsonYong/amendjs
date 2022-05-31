import EventEmitter from 'events'
import fs from 'fs'

export default class ReadStream extends EventEmitter {
	constructor(path, options) {
		super()
		this.path = path
		this.flags = options.flags || 'r'
		this.encoding = options.encoding || null
		this.autoClose = options.autoClose || true
		this.start = options.start || 0
		this.end = options.end
		this.highWaterMark = options.highWaterMark || 64 * 1024
		this.flowing = false

		// open之后要开始read，open是异步的
		this.open()

		// EventEmitter底层实现，绑定了监听事件，就会触发newListener
		this.on('newListener', function (type) {
			// type => open data end close error
			if (type === 'data') {
				this.flowing = true
				this.read()
			}
			this.offset = this.start
		})
	}
	// 监听可读流的触发事件，实现读一点，写一点
	pipe(ws) {
		this.on('data', (data) => {
			let flag = ws.write(data)
			if (!flag) {
				this.pause()
			}
		})
		ws.on('drain', () => {
			this.resume()
		})
	}
	open() {
		fs.open(this.path, this.flags, (err, fd) => {
			if (err) return this.destroy(err)
			this.fd = fd // 文件标识绑定到实例上，read要用它
			this.emit('open', fd)
		})
	}
	read() {
		// 为了拿到fd，多做了一次检测。
		// open是移步的，read是同步执行，直接拿的话是拿不到的。
		if (typeof this.fd !== 'number') {
			return this.once('open', () => this.read())
		}
		// console.log(this.fd);
		// 如果配置了end，则按照end截取
		let howMatchToRead = this.end
			? Math.min(this.end - this.offset + 1, this.highWaterMark)
			: this.highWaterMark
		const buffer = Buffer.alloc(howMatchToRead)

		fs.read(
			this.fd,
			buffer,
			0,
			howMatchToRead,
			this.offset,
			(err, bytesRead) => {
				if (bytesRead) {
					this.offset += bytesRead
					this.emit('data', buffer)
					if (this.flowing) this.read()
				} else {
					this.emit('end')
					this.destroy()
				}
			}
		)
	}
	resume() {
		if (!this.flowing) {
			this.flowing = true
			this.read()
		}
	}
	pause() {
		this.flowing = false
	}
	destroy(err) {
		if (err) this.emit('error', err)
		if (this.autoClose) {
			fs.close(this.fd, () => this.emit('close'))
		}
	}
}
