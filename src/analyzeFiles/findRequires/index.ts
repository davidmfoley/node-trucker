import javascript from './javascript'
import typescriptRequireFinder from './typescript'
import coffee from './coffeescript'
import { RequireInfo } from '../types'
import { TruckerJob } from '../../TruckerJob'

type RequireFinder = (contents: string, filename: string) => RequireInfo[]
type Parsers = { [key: string]: RequireFinder }

export default (job: TruckerJob) => {
  const typescript = typescriptRequireFinder(job)
  const parsers: Parsers = {
    js: javascript,
    mjs: javascript,
    jsx: javascript,
    ts: typescript,
    tsx: typescript,
    coffee,
  }
  return (filetype: string, contents: string, filename: string) => {
    return parsers[filetype](contents, filename)
  }
}
