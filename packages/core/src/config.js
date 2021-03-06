const eslint = {
	name: 'eslint',
	values: [
		{
			value: 'common',
			use: ['eslint', 'eslint-define-config'],
		},
		{
			value: 'ts-common',
			use: (type) => [
				'eslint',
				'eslint-config-prettier',
				'@typescript-eslint/eslint-plugin',
				'@typescript-eslint/parser',
				'eslint-define-config',
				'eslint-plugin-jest',
				'eslint-plugin-prettier',
				'prettier',
				type !== undefined &&
				type !== null &&
				type !== 'other-framework' &&
				type !== 'non-framework'
					? `eslint-plugin-${type}`
					: null,
			],
		},
		{
			value: 'no',
			use: [],
		},
	],
}

const commitlint = {
	name: 'commitlint',
	values: [
		{
			value: 'yes',
			use: ['@commitlint/cli', '@commitlint/config-conventional'],
		},
		{
			value: 'no',
			use: [],
		},
	],
}

const stylelint = {
	name: 'stylelint',
	values: [
		{
			value: 'yes',
			use: [
				'stylelint-config-prettier',
				'stylelint-config-rational-order',
				'stylelint',
				'stylelint-config-standard',
				'stylelint-scss',
			],
		},
		{
			value: 'no',
			use: [],
		},
	],
}

const husky = {
	name: 'husky',
	values: [
		{
			value: 'yes',
			use: ['husky'],
			preUse: ['husky install'],
		},
		{
			value: 'no',
			use: [],
		},
	],
}

const lintstaged = {
	name: 'lint-staged',
	values: [
		{
			value: 'yes',
			use: ['lint-staged'],
		},
		{
			value: 'no',
			use: [],
		},
	],
}

const prettier = {
	name: 'prettier',
	values: [
		{
			value: 'yes',
			use: ['prettier'],
		},
		{
			value: 'no',
			use: [],
		},
	],
}

export { eslint, commitlint, stylelint, husky, lintstaged, prettier }

export const questions = [
	eslint,
	commitlint,
	stylelint,
	husky,
	lintstaged,
	prettier,
].map((item) => ({
	type: 'list',
	name: item.name,
	message: `导入${item.name}?`,
	choices:
		item.values.length !== 0 ? item.values.map((item) => item.value) : [],
}))
