import ts from 'typescript'
import { ImportStatement } from '../../getFileImports'
type TypescriptToken = any

const isStringLiteral = (child: ts.Node): child is ts.StringLiteral =>
  child.kind === ts.SyntaxKind.StringLiteral

const isImportOrExport = (statement: ts.Statement) =>
  statement.kind === ts.SyntaxKind.ImportDeclaration ||
  statement.kind === ts.SyntaxKind.ExportDeclaration

const isImportEquals = (
  statement: ts.Statement
): statement is ts.ImportEqualsDeclaration =>
  statement.kind === ts.SyntaxKind.ImportEqualsDeclaration

export const getImportStatements = (
  contents: string,
  filePath: string
): ImportStatement[] => {
  // Parse a file
  let sourceFile = ts.createSourceFile(
    filePath,
    contents,
    ts.ScriptTarget.ES2015,
    /*setParentNodes */ true
  )

  const pushImportEquals = (
    imports: ImportStatement[],
    statement: ts.ImportEqualsDeclaration
  ) => {
    ts.forEachChild(statement, (child) => {
      if (child.kind === ts.SyntaxKind.ExternalModuleReference) {
        pushImport(imports, child)
      }
    })
  }

  const findImports = (imports: ImportStatement[], node: ts.SourceFile) => {
    var statements = node.statements.slice()
    while (statements.length) {
      const statement = statements.shift()
      if (isImportOrExport(statement)) {
        pushImport(imports, statement)
      } else if (isImportEquals(statement)) {
        pushImportEquals(imports, statement)
      }
    }

    return imports
  }

  const buildLoc = (node: ts.StringLiteral) => {
    const lineAndChar = sourceFile.getLineAndCharacterOfPosition(
      node.getStart()
    )
    return {
      line: lineAndChar.line + 1,
      start: lineAndChar.character + 2,
      length: node.text.length,
    }
  }

  const pushImport = (
    imports: ImportStatement[],
    statement: TypescriptToken
  ) => {
    ts.forEachChild(statement, (child) => {
      if (isStringLiteral(child)) {
        const loc = buildLoc(child)
        imports.push({ loc, importPath: child.text, filePath: filePath })
      }
    })
  }

  const imports: ImportStatement[] = []
  findImports(imports, sourceFile)
  return imports
}
