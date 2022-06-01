import { getUse, generateCommand } from '../utils/utils.js'

import { husky } from '../config.js'

const createHusky = ({ specList }) => {
	const huskyCommand = specList['husky']
	// 执行对应的类型
	const use = getUse(husky, huskyCommand)
	const command = generateCommand(use)

	return command
}

export default createHusky
