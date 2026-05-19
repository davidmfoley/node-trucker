import { describe, it } from 'mocha'
import { expect } from 'chai'

import { FindImports } from './typescript'
import { ImportStatement } from '../getFileImports'

describe('FIndImports', () => {
  describe('with typescript', () => {
    const findImports = FindImports(({ importPath, loc }: ImportStatement) => ({
      relativePath: importPath,
      kind: 'relative',
      text: importPath,
      fullPath: importPath,
      filePath: 'example.ts',
      loc,
    }))

    it('handles basic import', () => {
      const code = `import { Foo } from './example';`

      const foundImports = findImports(code, 'foo.ts')
      expect(foundImports.length).to.eql(1)
      expect(foundImports[0].relativePath).to.equal('./example')
      expect(foundImports[0].loc.line).to.equal(1)
      expect(foundImports[0].loc.start).to.equal(22)
      expect(foundImports[0].loc.length).to.equal(9)
    })

    it('sets location correctly', () => {
      const code = "import * as foo from './foo'"
      const foundImports = findImports(code, 'example.ts')
      const req = foundImports[0]
      expect(req.loc.line).to.equal(1)
      expect(req.loc.start).to.equal(23)
      expect(req.loc.length).to.equal(5)
    })

    it('handles * import', () => {
      const code = `import * as foo from './path/with/separators';`

      const foundImports = findImports(code, 'foo.ts')
      expect(foundImports.length).to.eql(1)
      expect(foundImports[0].relativePath).to.equal('./path/with/separators')
      expect(foundImports[0].loc.line).to.equal(1)
      expect(foundImports[0].loc.start).to.equal(23)
      expect(foundImports[0].loc.length).to.equal(22)
    })

    it('handles import on multiple lines', () => {
      const code = `import {
  Foo,
  Bar
} from './path/with/separators';`

      const foundImports = findImports(code, 'foo.ts')
      expect(foundImports.length).to.eql(1)
      expect(foundImports[0].relativePath).to.equal('./path/with/separators')
      expect(foundImports[0].loc.line).to.equal(4)
      expect(foundImports[0].loc.start).to.equal(9)
      expect(foundImports[0].loc.length).to.equal(22)
    })

    it('handles immediately exported import', () => {
      const code = "export * from './y';"
      const foundImports = findImports(code, 'foo.ts')
      expect(foundImports.length).to.eql(1)
      expect(foundImports[0].relativePath).to.equal('./y')
    })

    it('handles import with alias', () => {
      const code = "import { Foo as Bar } from './y';"
      const foundImports = findImports(code, 'foo.ts')
      expect(foundImports.length).to.eql(1)
      expect(foundImports[0].relativePath).to.equal('./y')
    })

    it('handles import with require', () => {
      const code = "import foo = require('./foo');"
      const foundImports = findImports(code, 'foo.ts')
      expect(foundImports.length).to.eql(1)
      expect(foundImports[0].relativePath).to.equal('./foo')
    })

    it('does not treat an exported string as a file', () => {
      const code = "export const foo = './y';"
      const foundImports = findImports(code, 'foo.ts')
      expect(foundImports.length).to.eql(0)
    })

    it('ignores npm package import', () => {
      const code = "import foo from 'foo';"
      const foundImports = findImports(code, 'foo.ts')
      expect(foundImports.length).to.eql(0)
    })

    it('handles unassigned import', () => {
      const code = "import './y';"
      const foundImports = findImports(code, 'foo.ts')
      expect(foundImports.length).to.eql(1)
      expect(foundImports[0].relativePath).to.equal('./y')
    })
  })

  describe('path aliases', () => {
    it('handles mapped path', () => {
      const findImports = FindImports(
        ({ importPath, loc }: ImportStatement) => ({
          relativePath: importPath.replace(/^\~/, './src'),
          kind: 'alias',
          text: importPath,
          loc,
          filePath: '/example/file/path.ts',
          fullPath: '/example/full/path',
          mapping: { alias: '', destination: '' },
        })
      )
      const code = `import { Foo } from '~/foo/bar';`

      const foundImports = findImports(code, 'foo.ts')

      expect(foundImports.length).to.eql(1)
      expect(foundImports[0].relativePath).to.equal('./src/foo/bar')
      // expect(foundImports[0].text).to.equal('~/foo/bar')
      expect(foundImports[0].loc.line).to.equal(1)
      expect(foundImports[0].loc.start).to.equal(22)
      expect(foundImports[0].loc.length).to.equal(9)
    })
  })
})
