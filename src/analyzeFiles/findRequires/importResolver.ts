import path from 'path'
import fs from 'fs'

export interface ImportResolver {
  relative: (filePath: string, importPath: string) => string | undefined
  absolute: (fullFilePath: string) => string | undefined
}

const isValidFile = (path: string) => {
  return fs.existsSync(path) && fs.statSync(path).isFile()
}

const importResolver =
  (isFile: (path: string) => boolean) =>
  (exts: string[]): ImportResolver => {
    const absolute = (fullImportPath: string) => {
      const candidates = [fullImportPath]
        .concat(exts.map((ext) => `${fullImportPath}${ext}`))
        .concat(exts.map((ext) => `${fullImportPath}/index${ext}`))

      for (let candidate of candidates) {
        if (isFile(candidate)) return candidate
      }
    }

    return {
      relative: (filePath: string, importPath: string): string | undefined => {
        const fullImportPath = path.normalize(
          path.join(path.dirname(filePath), importPath)
        )
        return absolute(fullImportPath)
      },
      absolute,
    }
  }

export default importResolver(isValidFile)
