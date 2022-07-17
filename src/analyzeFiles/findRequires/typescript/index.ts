import requirePathFilter from '../requirePathFilter'
import { TruckerJob } from '../../../types'
import { RequireInfo } from '../../types'
import { getTsConfig } from './tsConfig'
import { getPathMapper, PathMapper } from './pathMapper'
import { getFileImports } from '../../getFileImports'
import { getImportStatements } from './getImportStatements'
import importResolver from '../importResolver'

export const FindRequires = (pathMapper: PathMapper) => {
  const filterTsImport = (item: RequireInfo) =>
    requirePathFilter(item.relativePath)

  return getFileImports(getImportStatements, pathMapper, filterTsImport)
}

export default (truckerJob: Pick<TruckerJob, 'tsconfigPath' | 'base'>) => {
  const tsconfig = getTsConfig(truckerJob)
  const mapper = getPathMapper(
    tsconfig,
    importResolver(['.ts', '.tsx', '.js', '.jsx', '.mjs'])
  )
  return FindRequires(mapper)
}
