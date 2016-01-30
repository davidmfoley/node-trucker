var fs = require('fs');
module.exports = {
  // pads with a blank element zero since line numbers start at one
  readLines: function(filePath) {
    var contents = fs.readFileSync(filePath, {encoding: 'utf-8'});
    return [''].concat(contents.split("\n"));
  },
  // removes blank element
  writeLines: function(filePath, lines) {
    fs.writeFileSync(filePath, lines.slice(1).join('\n'), {encoding: 'utf-8'});
  }
};
