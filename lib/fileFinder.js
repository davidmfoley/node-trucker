var fs = require('fs');
var path = require('path');

module.exports = function(base) {
  var files = [];
  traverse(base, './', files);
  return files;
};

function traverse(base, current, files) {
  var childDirs = [];
  var fullCurrentPath = path.join(base, current);

  fs.readdirSync(fullCurrentPath).forEach(function(f) {
    var file = path.join(fullCurrentPath, f);
    var stat = fs.statSync(file);
    if (stat.isDirectory()) {
      childDirs.push(f);
    } else if (weCareAbout(file)) {
      files.push({
        relativePath: path.join(current, f),
        fullPath: file,
        filetype: getFiletype(file)
      });
    }
  });

  childDirs.forEach(function(f) {
    traverse(base, path.join(current, '/' + f), files);
  });
}
function weCareAbout(name) {
  return (/\.(js|coffee)$/).exec(name);
}
function getFiletype(name) {
  if ((/coffee$/).exec(name)) return 'coffee';
  return 'js';
}
