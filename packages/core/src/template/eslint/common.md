// @ts-check
const { defineConfig } = require('eslint-define-config')
module.exports = defineConfig({
	root: true,
	env: {
		browser: true,
		node: true,
		es6: true,
	},
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module',
		jsxPragma: 'React',
		ecmaFeatures: {
			jsx: true,
		},
	},
	extends: [],
	rules: {
		'no-use-before-define': 'off',
		'no-unused-vars': [
			'error',
			{
				argsIgnorePattern: '^_',
				varsIgnorePattern: '^_',
			},
		],
		'space-before-function-paren': 'off',
	},
})
// end
