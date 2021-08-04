import path from 'path'
import readIgnores from './readIgnores'
import { TruckerJob, TruckerOptions } from '../types'

export default function (options: TruckerOptions): TruckerJob {
  var scopePresent = options.scope && options.scope.length
  var _ = options._ || []
  var files = _.map(blowOutPath)
  var from = files.slice(0, files.length - 1)
  var to = files.length && files[files.length - 1]
  var base = scopePresent ? path.resolve(options.scope) : process.cwd()
  var ignore = readIgnores(base)

  if (options.exclude) {
    ignore.patterns = ignore.patterns.concat(options.exclude)
  }

  return {
    base: base,
    ignore: ignore,
    files,
    moves: [
      {
        from: from,
        to: to,
      },
    ],
    dryRun: !!options['dry-run'],
    quiet: !!options.quiet,
    info: !!options.info,
    format: options.format || 'default',
    unused: !!options.unused,
    tsconfigPath: options.project,
  }
}

function blowOutPath(subPath: string): string {
  return path.normalize(path.join(process.cwd(), subPath))
}
