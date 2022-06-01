import createEslint from './plugins/createEslint.js'
import createCommlint from './plugins/createCommlint.js'
import createStylelint from './plugins/createStylelint.js'
import createHusky from './plugins/createHusky.js'
import createPreHusky from './plugins/createPreHusky.js'
import createLintStaged from './plugins/createLintStaged.js'
import createPrettier from './plugins/createPrettier.js'

import {
	executiveCommand,
	writeFile,
	updatePackageJson,
	executivePreCommand,
} from './utils/utils.js'

import fs from 'fs'
import path from 'path'

const __dirname = path.resolve()

const env = {
	'pnpm-lock': 'pnpm',
	'yarn.lock': 'yarn',
	'package.lock': 'npm',
}

function walkSync(currentDirPath, callback) {
	fs.readdirSync(currentDirPath, { withFileTypes: true }).forEach(function (
		dirent
	) {
		if (!new RegExp('node_modules', 'g').test(currentDirPath)) {
			const filePath = path.join(currentDirPath, dirent.name)
			if (dirent.isFile()) {
				callback(filePath, dirent)
			} else if (dirent.isDirectory()) {
				walkSync(filePath, callback)
			}
		}
	})
}

export default function implement({ type, specList }) {
	let isGit = false
	const commandList = [
		createEslint({ type, specList }),
		createCommlint({ type, specList }),
		createStylelint({ type, specList }),
		createHusky({ type, specList }),
		createLintStaged({ type, specList }),
		createPrettier({ type, specList }),
	]
	const commandPreList = [createPreHusky({ type, specList })]

	const ruleKeys = Object.keys(specList)?.filter(
		(key) => specList[key] !== 'no'
	)
	// 修改package.json
	updatePackageJson(ruleKeys)

	walkSync(__dirname, function (filePath) {
		const current = ['pnpm-lock', 'yarn.lock', 'package.lock'].find((item) =>
			new RegExp(item).test(filePath)
		)
		if (!isGit) isGit = new RegExp(/\.git\//, 'g').test(filePath)

		if (current) {
			executiveCommand(
				commandList.filter((c) => Boolean(c)).join('&&'),
				env[current],
				() => {
					// husky的生成
					if (isGit) {
						executivePreCommand(
							commandPreList.filter((c) => Boolean(c)).join('&&'),
							env[current],
							() => {
								;[
									'commit-msg',
									'common.sh',
									'lintstagedrc.js',
									'pre-commit',
								].forEach((item) => {
									writeFile(
										`/packages/core/src/template/husky/${item}`,
										`./.husky/${item}`
									)
								})
							}
						)
					}
				}
			)
		}
	})
}
