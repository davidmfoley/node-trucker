var optimist = require('optimist');
var trucker = require('./index');

var options = optimist
  .usage('$0 [source file or directory] [destination] [flags]')
  .boolean('h')
  .alias('h', 'help')
  .describe('h', 'Show help')
  .boolean('n')
  .alias('n', 'dry-run')
  .describe('n', 'Print out changes to be made but don\'t change anything')
  .string('r')
  .alias('r', 'root')
  .describe('r', 'Set root directory (default pwd)');

var argv = options.argv;

if (argv.h || argv._.length != 2) {
  options.showHelp();
  process.exit();
}

trucker(argv);
