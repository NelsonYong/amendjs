import fs from 'fs'
import { exec } from 'child_process'
import path from 'path'
import ReadStream from './ReadStream.js'
import WriteStream from './WriteStream.js'

const __dirname = path.resolve()

export function getUse(list, lintCommand, ...args) {
	const executant = list.values.find((item) => item.value === lintCommand)
	const use =
		typeof executant.use === 'function' ? executant.use(...args) : executant.use
	return use
}

export function getPreUse(list, lintCommand, ...args) {
	const executant = list.values.find((item) => item.value === lintCommand)
	const preUse =
		typeof executant.preUse === 'function'
			? executant.use(...args)
			: executant.preUse
	return preUse
}

export function generateCommand(use) {
	let command = ''
	use?.forEach((i, index) => {
		if (index === 0) command += `npm i ${i} -D `
		else command += `&& npm i ${i} -D`
	})
	return command
}

export function generatePreCommand(preUse) {
	let command = ''
	preUse?.forEach((i, index) => {
		if (index === 0 || index < preUse.length - 1) command += ` npm  ${i} `
		else command += ` && npm  ${i}  `
	})
	return command
}

export function executiveCommand(command, startCommand, callback) {
	const processCommand = command.replace(/npm/g, startCommand)
	exec(processCommand, (err, stdout, stderr) => {
		if (err) {
			console.log(err)
			return
		}
		if (stdout) console.log(`stdout: ${stdout}`)
		if (stderr) console.log(`stderr: ${stderr}`)
		if (typeof callback === 'function') callback()
	})
}

export async function writeFile(input, output) {
	fs.readFile(
		path.join(__dirname, input),
		{ encoding: 'utf-8' },
		(err, data) => {
			if (err) {
				console.log(err)
				return
			}
			fs.writeFile(path.join(__dirname, output), data, { flag: 'w' }, (err) => {
				if (err) console.log(err)
			})
		}
	)
}

export async function writeFileStream(input, output) {
	const rs = new ReadStream(path.join(__dirname, input), {
		highWaterMark: 2, // 读取默认64k
	})
	const ws = new WriteStream(path.join(__dirname, output), {
		highWaterMark: 1, // 写入默认16k
	})
	rs.pipe(ws)
}

const commands = {
	'lint:eslint':
		'eslint --cache --max-warnings 0  "{src,mock}/**/*.{vue,ts,tsx}" --fix',
	'lint:prettier':
		'prettier --write  "src/**/*.{js,json,tsx,css,less,scss,vue,html,md}"',
	'lint:stylelint':
		'stylelint --cache --fix "**/*.{vue,less,postcss,css,scss}" postcss-html --cache --cache-location node_modules/.cache/stylelint/',
	'lint:lint-staged': 'lint-staged -c ./.husky/lintstagedrc.js',
}

export function updatePackageJson(rule) {
	fs.readFile(
		path.join(__dirname, 'package.json'),
		{ encoding: 'utf-8' },
		(err, data) => {
			if (err) {
				console.log(err)
				return
			}
			const cbDataPackage = JSON.parse(data)

			// 先删除已经存在的命令
			Object.keys(commands).forEach((key) => {
				if (cbDataPackage.scripts[key]) delete cbDataPackage.scripts[key]
			})
			rule?.forEach((r) => {
				if (commands[`lint:${r}`])
					cbDataPackage.scripts[`lint:${r}`] = commands[`lint:${r}`]
			})

			if (cbDataPackage.devDependencies['lint-staged']) {
				cbDataPackage.scripts[`lint-staged`] = commands[`lint-staged`]
			}
			fs.writeFile(
				path.join(__dirname, 'package.json'),
				JSON.stringify(cbDataPackage),
				{ flag: 'w' },
				(err) => {
					if (err) console.log(err)
				}
			)
		}
	)
}
