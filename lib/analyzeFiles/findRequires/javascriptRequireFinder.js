var babylon = require('babylon');
var requirePathFilter = require('./requirePathFilter');

module.exports = function(contents, filename) {
  contents = handleShebang(contents);

  // kitchen-sink approach, since we just want to find requires/imports/etc.
  var bbl = babylon.parse(contents, {sourceType: 'module', plugins: [
    'asyncFunctions',
    'asyncGenerators',
    'classContructorCall',
    'classProperties',
    'doExpressions',
    'functionBind',
    'jsx',
    'objectRestSpread',
    'trailingFunctionCommas',
  ]});

  //var result = babel.transform(contents, {stage:0, filename: filename});

  //var ast = result.ast;

  var requires = [];
  scan(bbl.tokens, requires);
  return requires;
};

function scan(tokens, requires, index) {
  for(var i = 0; i < tokens.length; i++) {
    var token = tokens[i];
    if (token.type.keyword === 'import' || (token.type.label === 'name' && token.value === 'require')) {
      while ( tokens[i] && tokens[i].type && tokens[i].type.label !== 'string' && i < tokens.length) { i++; }

      addIfMatch(requires, tokens[i]);
    }
  }
}

function addIfMatch(requires, pathToken) {
  if (! (pathToken && pathToken.value)) return;
  if (!requirePathFilter(pathToken.value)) return;
  var loc = pathToken.loc;

  var req = {
    path: pathToken.value,
    loc: {
      line: loc.start.line,
      start: loc.start.column + 2,
      length: pathToken.value.length
    }
  };
  requires.push(req);
}


function handleShebang(contents) {
  if (contents[0] === '#' && contents[1] === '!')
    return "//" + contents;

  return contents;
}
