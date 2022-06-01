import inquirer from 'inquirer'
import { questions } from './config.js'

// const questions = [
// 	{
// 		type: 'list',
// 		name: 'eslint',
// 		message: '导入eslint?',
// 		choices: ['common', 'ts-common', 'no'],
// 	},
// 	{
// 		type: 'list',
// 		name: 'prettier',
// 		message: '导入prettier?',
// 		choices: ['yes', , 'no'],
// 	},
// 	{
// 		type: 'list',
// 		name: 'stylelint',
// 		message: '导入stylelint?',
// 		choices: ['yes', 'no'],
// 	},
// 	{
// 		type: 'list',
// 		name: 'commitlint',
// 		message: '导入commitlint?',
// 		choices: ['yes', 'no'],
// 	},
// 	{
// 		type: 'list',
// 		name: 'husky',
// 		message: '导入husky?',
// 		choices: ['yes', 'no'],
// 	},
// 	{
// 		type: 'list',
// 		name: 'lint-staged',
// 		message: '有husky需导入lint-staged',
// 		choices: ['yes', 'no'],
// 	},
// ]

const { projectType } = await inquirer.prompt([
	{
		type: 'list',
		name: 'projectType',
		message: 'Your project type?',
		choices: ['react', 'vue', 'svelte', 'other-framework', 'non-framework'],
	},
])

const specList = await inquirer.prompt(questions)

export { specList, projectType }
