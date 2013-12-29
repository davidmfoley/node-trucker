var parsers = {
  js: require('./javascriptRequireFinder')
};

module.exports = {
  find: function(filetype, contents) {
    return parsers[filetype](contents);
  }
};
