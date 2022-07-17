import optimist from 'optimist'
import trucker from '.'

const cli = () => {
  const options = optimist
    .usage(
      `Move CommonJS source files or directories without breaking your imports.\nSupports typescript, javascript and coffeescript files.

Move files:
trucker -m [sources...] destination

Dry run (shows what moves would happen but doesn't do them):
trucker -n [sources...] destination

Print information about imports:
trucker -i [sources...]

Print information about imports in dotviz format:
trucker -i [sources...] -f dot
`
    )
    .boolean('v')
    .alias('v', 'version')
    .boolean('h')
    .alias('h', 'help')
    .describe('h', 'Show help')
    .boolean('i')
    .alias('i', 'info')
    .describe('i', 'Print dependency information for a file or path')
    .string('f')
    .alias('f', 'format')
    .describe(
      'f',
      'Set format for info output ("default" or "dot" for graphviz-compatible dot output)'
    )
    .boolean('u')
    .alias('u', 'unused')
    .describe('u', 'Find files that are not required from any other files')
    .boolean('m')
    .alias('m', 'move')
    .describe(
      'm',
      'Move one or more source files while fixing up any changed require paths'
    )
    .boolean('n')
    .alias('n', 'dry-run')
    .describe(
      'n',
      "Print out changes to be made but don't change anything (try this first!)"
    )
    .string('s')
    .alias('s', 'scope')
    .describe(
      's',
      'Set top "scope" directory for scanning for dependencies (default: pwd)'
    )
    .string('p')
    .alias('p', 'project')
    .describe('p', 'Set tsconfig project location (typescript only)')
    .string('q')
    .alias('q', 'quiet')
    .describe('q', 'Suppress output')
    .string('e')
    .alias('e', 'exclude')
    .describe('e', 'Add file glob pattern to exclude (repeatable)')

  const argv = options.argv,
    fileCount = argv._length,
    requiredFileCount = argv.i ? 1 : 2

  if (argv.v) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const version = require('../package.json').version
    console.log(`Trucker version ${version}`)
    process.exit()
  }

  if (!(argv.h || argv.i || argv.m || argv.n || argv.u)) {
    options.showHelp()
    process.exit()
  }

  if (argv.exclude && typeof argv.exclude === 'string') {
    argv.e = argv.exclude = [argv.exclude]
  }

  if (argv.h || fileCount < requiredFileCount) {
    options.showHelp()
    process.exit()
  }

  const result = trucker(argv)
  process.exit(result)
}

export default cli
