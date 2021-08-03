import ts from 'typescript'
import requirePathFilter from '../requirePathFilter'
import { RequireInfo, TruckerJob } from '../../../types'
import { getTsConfig } from './tsConfig'
import { getPathMapper, PathMapper } from './pathMapper'
type TypescriptToken = any

export const FindRequires = (pathMapper: PathMapper) => {
  const findRequires = (contents: string, filename: string): RequireInfo[] => {
    // Parse a file
    let sourceFile = ts.createSourceFile(
      filename,
      contents,
      ts.ScriptTarget.ES2015,
      /*setParentNodes */ true
    )

    const findRequires = (requires: RequireInfo[], node: ts.SourceFile) => {
      var statements = node.statements.slice()
      while (statements.length) {
        var statement = statements.shift()
        if (
          statement.kind === ts.SyntaxKind.ImportDeclaration ||
          statement.kind === ts.SyntaxKind.ExportDeclaration
        ) {
          pushRequire(requires, statement)
        } else if (statement.kind === ts.SyntaxKind.ImportEqualsDeclaration) {
          ts.forEachChild(statement, function (child) {
            if (child.kind === ts.SyntaxKind.ExternalModuleReference) {
              pushRequire(requires, child)
            }
          })
        }
      }

      return requires
    }

    const pushRequire = (
      requires: RequireInfo[],
      statement: TypescriptToken
    ) => {
      ts.forEachChild(statement, function (child: any) {
        var lineAndChar = sourceFile.getLineAndCharacterOfPosition(
          child.getStart()
        )
        if (child.kind === ts.SyntaxKind.StringLiteral) {
          const actualPath = pathMapper(child.text).path

          if (requirePathFilter(actualPath)) {
            requires.push({
              path: actualPath,
              loc: {
                line: lineAndChar.line + 1,
                start: lineAndChar.character + 2,
                length: child.text.length,
              },
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

export default (truckerJob: Pick<TruckerJob, 'tsconfigPath'>) => {
  const tsconfig = getTsConfig(truckerJob.tsconfigPath)
  const mapper = getPathMapper(tsconfig)
  return FindRequires(mapper)
}
