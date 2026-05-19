import importPathFilter from '../importPathFilter'
import { ImportInfo } from '../../types'
import { TsConfig } from './tsConfig'
import { getPathMapper, PathMapper } from './pathMapper'
import { getFileImports } from '../../getFileImports'
import { getImportStatements } from './getImportStatements'
import importResolver from '../importResolver'

export const FindImports = (pathMapper: PathMapper) => {
  const filterTsImport = (item: ImportInfo) =>
    importPathFilter(item.relativePath)

  return getFileImports(getImportStatements, pathMapper, filterTsImport)
}

export default (tsconfig: TsConfig) => {
  const mapper = getPathMapper(
    tsconfig,
    importResolver(['.ts', '.tsx', '.js', '.jsx', '.mjs'])
  )
  return FindImports(mapper)
}
