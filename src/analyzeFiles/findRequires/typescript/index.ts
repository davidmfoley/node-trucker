import ts from 'typescript'
import requirePathFilter from '../requirePathFilter'
import { RequireInfo, TruckerJob } from '../../../types'
import { getTsConfig } from './tsConfig'
import { getPathMapper, PathMapper } from './pathMapper'
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

export const FindRequires = (pathMapper: PathMapper) => {
  const findRequires = (contents: string, filename: string): RequireInfo[] => {
    // Parse a file
    let sourceFile = ts.createSourceFile(
      filename,
      contents,
      ts.ScriptTarget.ES2015,
      /*setParentNodes */ true
    )

    const pushImportEquals = (
      requires: RequireInfo[],
      statement: ts.ImportEqualsDeclaration
    ) => {
      ts.forEachChild(statement, (child) => {
        if (child.kind === ts.SyntaxKind.ExternalModuleReference) {
          pushRequire(requires, child)
        }
      })
    }

    const findRequires = (requires: RequireInfo[], node: ts.SourceFile) => {
      var statements = node.statements.slice()
      while (statements.length) {
        const statement = statements.shift()
        if (isImportOrExport(statement)) {
          pushRequire(requires, statement)
        } else if (isImportEquals(statement)) {
          pushImportEquals(requires, statement)
        }
      }

      return requires
    }

    const tsNodeLoc = (node: ts.StringLiteral) => {
      const lineAndChar = sourceFile.getLineAndCharacterOfPosition(
        node.getStart()
      )
      return {
        line: lineAndChar.line + 1,
        start: lineAndChar.character + 2,
        length: node.text.length,
      }
    }

    const pushRequire = (
      requires: RequireInfo[],
      statement: TypescriptToken
    ) => {
      ts.forEachChild(statement, (child) => {
        if (isStringLiteral(child)) {
          const loc = tsNodeLoc(child)
          const mapped = pathMapper({
            filePath: filename,
            importPath: child.text,
          })

          if (requirePathFilter(mapped.relativePath)) {
            requires.push({
              ...mapped,
              loc,
            })
          }
        }
      })
    }

    const requires: RequireInfo[] = []
    findRequires(requires, sourceFile)
    return requires
  }

  return findRequires
}

export default (truckerJob: Pick<TruckerJob, 'tsconfigPath' | 'base'>) => {
  const tsconfig = getTsConfig(truckerJob)
  const mapper = getPathMapper(tsconfig)
  return FindRequires(mapper)
}
