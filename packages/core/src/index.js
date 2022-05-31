import { specList, projectType } from './create.js'
import path from 'path'
import implement from './implement.js'
const __dirname = path.resolve()

implement({ type: projectType, specList })

export function dirName() {
	console.log(__dirname)
	return __dirname
}
