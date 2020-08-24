import ts from 'typescript';
import requirePathFilter from './requirePathFilter';

export default function(contents, filename) {
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
      if (
        statement.kind === ts.SyntaxKind.ImportDeclaration || statement.kind === ts.SyntaxKind.ExportDeclaration
      ) {
        pushRequire(requires, statement);
      }
      else if (statement.kind === ts.SyntaxKind.ImportEqualsDeclaration) {
        ts.forEachChild(statement, function (child) {
          if (child.kind === ts.SyntaxKind.ExternalModuleReference) {
            pushRequire(requires, child);
          }
        });
      }
    }

    return requires;
  }

  function pushRequire(requires, statement) {
    ts.forEachChild(statement, function (child: any) {
      var lineAndChar = sourceFile.getLineAndCharacterOfPosition(
        child.getStart()
      );
      if (child.kind === ts.SyntaxKind.StringLiteral && requirePathFilter(child.text)) {
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
};
