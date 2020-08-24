import fs from 'fs';
import jschardet from 'jschardet';

function getEncoding(filePath) {
  var buffer = fs.readFileSync(filePath);
  var detected = jschardet.detect(buffer) || { encoding: 'utf8' };
  return detected.encoding || 'utf8';
}

function readContents(filePath) {
  var buffer = fs.readFileSync(filePath);
  var detected = jschardet.detect(buffer) || { encoding: 'utf8' };
  try {
    return buffer.toString(detected.encoding);
  }
  catch (e) {
    // this is stupid
    return buffer.toString('ascii');
  }
}

export default {
  readContents,
  // pads with a blank element zero since line numbers start at one
  readLines: function(filePath) {
    var contents = readContents(filePath);
    return [''].concat(contents.split("\n"));
  },
  // removes blank element
  writeLines: function(filePath, lines) {
    const encoding = getEncoding(filePath);
    try {
      fs.writeFileSync(filePath, lines.slice(1).join('\n'), { encoding });
    }
    catch (e) {
      fs.writeFileSync(filePath, lines.slice(1).join('\n'), { encoding: 'ascii' });
    }
  }
};
