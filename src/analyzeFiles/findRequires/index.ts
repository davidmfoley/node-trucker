import javascript from './javascriptRequireFinder'
import typescript from './typescriptRequireFinder'
import coffee from './coffeescriptRequireFinder'
import { RequireInfo } from '../../types'

type RequireFinder = (contents: string, filename: string) => RequireInfo[]
type Parsers = { [key: string]: RequireFinder }

var parsers: Parsers = {
  js: javascript,
  mjs: javascript,
  jsx: javascript,
  ts: typescript,
  tsx: typescript,
  coffee,
}

export default function (filetype, contents, filename) {
  return parsers[filetype](contents, filename)
}
