import { getUse, generateCommand } from '../utils/utils.js'

import { lintstaged } from '../config.js'

const createLintStaged = ({ specList }) => {
	const lintstagedCommand = specList['lint-staged']
	// 执行对应的类型
	const use = getUse(lintstaged, lintstagedCommand)
	const command = generateCommand(use)

	return command
}

export default createLintStaged
