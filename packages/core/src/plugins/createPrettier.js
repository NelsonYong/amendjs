import {
	getUse,
	generateCommand,
	writeFileStream,
	writeFile,
} from '../utils/utils.js'

import { prettier } from '../utils/constants.js'

const createPrettier = ({ specList }) => {
	const prettierCommand = specList?.['prettier']
	if (prettierCommand === 'yes') {
		const use = getUse(prettier, prettierCommand)
		const command = generateCommand(use)
		writeFile(
			`/packages/core/src/template/prettier/prettierrc.md`,
			'./.prettierrc.js'
		)
		writeFile(
			'/packages/core/src/template/prettier/.prettierignore',
			'./.prettierignore'
		)
		return command
	}
	return null
}

export default createPrettier
