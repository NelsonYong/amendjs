import { specList, projectType } from './create.js'
import { exec } from 'child_process'
import path from 'path'
import implement from './implement.js'

implement({ type: projectType, specList })
