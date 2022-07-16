import path from 'path'
import readIgnores from './readIgnores'
import { TruckerJob, TruckerOptions } from '../types'

export default function (options: TruckerOptions): TruckerJob {
  const scopePresent = options.scope && options.scope.length
  const _ = options._ || []
  const files = _.map(blowOutPath)
  const from = files.slice(0, files.length - 1)
  const to = files.length && files[files.length - 1]
  const base = scopePresent ? path.resolve(options.scope) : process.cwd()
  const ignore = readIgnores(base)

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
