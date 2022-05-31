import { getUse, generateCommand, writeFileStream } from '../utils/utils.js'

import { commitlint } from '../utils/constants.js'

const createCommlint = ({ specList }) => {
	const commitlintCommand = specList?.['commitlint']

	const fileName = commitlintCommand === 'yes' ? 'commitlint.config.js' : null
	if (fileName) {
		const use = getUse(commitlint, commitlintCommand)
		const command = generateCommand(use)
		writeFileStream(
			`/packages/core/src/template/commitlint/commitlint.md`,
			'./commitlint.config.js'
		)
		return command
	}
	return null
}

export default createCommlint
