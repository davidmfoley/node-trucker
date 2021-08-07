import requirePathFilter from '../requirePathFilter'
import { RequireInfo, TruckerJob } from '../../../types'
import { getTsConfig } from './tsConfig'
import { getPathMapper, PathMapper } from './pathMapper'
import { getFileImports } from '../../getFileImports'
import { getImportStatements } from './getImportStatements'

export const FindRequires = (pathMapper: PathMapper) => {
  const filterTsImport = (item: RequireInfo) =>
    requirePathFilter(item.relativePath)

  return getFileImports(getImportStatements, pathMapper, filterTsImport)
}

export default (truckerJob: Pick<TruckerJob, 'tsconfigPath' | 'base'>) => {
  const tsconfig = getTsConfig(truckerJob)
  const mapper = getPathMapper(tsconfig)
  return FindRequires(mapper)
}
