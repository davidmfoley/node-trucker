import javascriptImportFinder from './javascript'
import typescriptImportFinder from './typescript'
import { ImportInfo } from '../types'
import { TruckerJob } from '../../TruckerJob'
import { getTsConfig } from './typescript/tsConfig'

type ImportFinder = (contents: string, filename: string) => ImportInfo[]
type Parsers = { [key: string]: ImportFinder }

export default (job: TruckerJob) => {
  const tsconfig = getTsConfig(job)
  const typescript = typescriptImportFinder(tsconfig)

  const parsers: Parsers = {
    js: javascriptImportFinder,
    mjs: javascriptImportFinder,
    jsx: javascriptImportFinder,
    ts: typescript,
    tsx: typescript,
  }
  return (filetype: string, contents: string, filename: string) => {
    return parsers[filetype](contents, filename)
  }
}
