import { generatePreCommand, getPreUse } from '../utils/utils.js'

import { husky } from '../config.js'

const createPreHusky = ({ specList }) => {
	const huskyCommand = specList['husky']
	// 执行对应的类型
	const preUse = getPreUse(husky, huskyCommand)
	const preCommand = generatePreCommand(preUse)

	return preCommand
}

export default createPreHusky
