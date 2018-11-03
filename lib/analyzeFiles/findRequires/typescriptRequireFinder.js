var ts = require('typescript');
var requirePathFilter = require('./requirePathFilter');

module.exports = function(contents, filename) {
  // Parse a file
  let sourceFile = ts.createSourceFile(
    filename,
    contents,
    ts.ScriptTarget.ES2015,
    /*setParentNodes */ true
  );

  var requires = [];
  findRequires(requires, sourceFile);
  return requires;

  function findRequires(requires, node) {
    var statements = node.statements.slice();
    while (statements.length) {
      var statement = statements.shift();
      if (statement.kind === ts.SyntaxKind.ImportDeclaration) {
        ts.forEachChild(statement, function (child) {
          var lineAndChar = sourceFile.getLineAndCharacterOfPosition(
            child.getStart()
          );
          if (child.kind === ts.SyntaxKind.StringLiteral) {
            requires.push({
              path: child.text,
              loc: {
                line: lineAndChar.line + 1,
                start: lineAndChar.character + 2,
                length: child.text.length
              }
            });
          }
        });
      }
    }

    return requires;
  }
};
