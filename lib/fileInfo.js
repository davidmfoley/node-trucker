var fs = require('fs');
var path = require('path');

module.exports = {
  isDirectory: function(f) {
    var stat = (fs.existsSync(f) && fs.statSync(f));
    return (stat && stat.isDirectory());
  },
  isFile: function(f) {
    var stat = (fs.existsSync(f) && fs.statSync(f));
    if (stat) return stat.isFile();
    var extname = path.extname(f);
    return ['.js', '.coffee', '.jsx', '.mjs', '.ts', '.tsx'].indexOf(extname) >= 0;
  }
};
