var javascript = require('./javascriptRequireFinder');
var typescript = require('./typescriptRequireFinder');

var parsers = {
  js: javascript,
  mjs: javascript,
  jsx: javascript,
  ts: typescript,
  tsx: typescript,
  coffee: require('./coffeescriptRequireFinder')
};

module.exports = function(filetype, contents, filename) {
  return parsers[filetype](contents, filename);
};
