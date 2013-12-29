var parsers = {
  js: require('./javascriptRequireFinder'),
  coffee: require('./coffeescriptRequireFinder')
};

module.exports = function(filetype, contents) {
  return parsers[filetype](contents);
};
