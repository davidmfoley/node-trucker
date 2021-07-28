import javascript from './javascriptRequireFinder'
import typescriptRequireFinder from './typescriptRequireFinder'
import coffee from './coffeescriptRequireFinder'
import { RequireInfo, TruckerJob } from '../../types'

type RequireFinder = (contents: string, filename: string) => RequireInfo[]
type Parsers = { [key: string]: RequireFinder }

export default (job: TruckerJob) =>
  (filetype: string, contents: string, filename: string) => {
    const typescript = typescriptRequireFinder(job)
    const parsers: Parsers = {
      js: javascript,
      mjs: javascript,
      jsx: javascript,
      ts: typescript,
      tsx: typescript,
      coffee,
    }

    return parsers[filetype](contents, filename)
  }
