var parsers = {
  js: require('./javascriptRequireFinder'),
  coffee: require('./coffeescriptRequireFinder')
};

module.exports = {
  find: function(filetype, contents) {
    return parsers[filetype](contents);
  }
};
