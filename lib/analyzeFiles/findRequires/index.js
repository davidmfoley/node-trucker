var parsers = {
  js: require('./javascriptRequireFinder'),
  mjs: require('./javascriptRequireFinder'),
  jsx: require('./javascriptRequireFinder'),
  coffee: require('./coffeescriptRequireFinder')
};

module.exports = function(filetype, contents, filename) {
  return parsers[filetype](contents, filename);
};
