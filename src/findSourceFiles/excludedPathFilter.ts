import path from 'path'
import ignore from 'ignore'

type PathFilter = (path: string) => boolean

export default (job: {
  ignore?: {
    base?: string
    patterns?: string[]
  }
}): PathFilter => {
  if (!(job.ignore?.base && job.ignore?.patterns?.length)) return () => true

  const filter = ignore().add(job.ignore.patterns).createFilter()

  return (filepath: string) => {
    var relativeToBase = path.relative(job.ignore.base, filepath)

    // don't exclude files above ignore file
    if (relativeToBase.indexOf('..') === 0) return true

    return filter(relativeToBase)
  }
}
