import { eslint } from '../config.js'

import {
	getUse,
	generateCommand,
	writeFileStream,
	writeFile,
} from '../utils/utils.js'

const createEslint = ({ type, specList }) => {
	const eslintCommand = specList['eslint']

	if (eslintCommand !== 'no') {
		const use = getUse(eslint, eslintCommand, type)
		const command = generateCommand(use)
		writeFileStream(
			`/packages/core/src/template/eslint/${eslintCommand.replace('-', '')}.md`,
			'./.eslintrc.js'
		)

		writeFile(
			'/packages/core/src/template/eslint/.eslintignore',
			'./.eslintignore'
		)
		return command
	}

	return null
}

export default createEslint
