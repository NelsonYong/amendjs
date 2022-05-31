import { getUse, generateCommand, writeFileStream } from '../utils/utils.js'

import { stylelint } from '../utils/constants.js'

const createStylelint = ({ specList }) => {
	const stylelintCommand = specList?.['stylelint']
	const fileName = stylelintCommand === 'yes' ? 'stylelint.config.js' : null
	if (fileName) {
		const use = getUse(stylelint, stylelintCommand)
		const command = generateCommand(use)
		writeFileStream(
			`/packages/core/src/template/stylelint/stylelint.md`,
			'./stylelint.config.js'
		)
		return command
	}
	return null
}

export default createStylelint
