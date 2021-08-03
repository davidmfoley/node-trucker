import { describe, it } from 'mocha'
import { expect } from 'chai'

import { FindRequires } from '../src/analyzeFiles/findRequires/typescriptRequireFinder'

describe('RequireFinder', () => {
  describe('with typescript', () => {
    const findRequires = FindRequires((path: string) => ({ path }))

    it('handles basic import', () => {
      const code = `import { Foo } from './example';`

      const requires = findRequires(code, 'foo.ts')
      expect(requires.length).to.eql(1)
      expect(requires[0].path).to.equal('./example')
      expect(requires[0].loc.line).to.equal(1)
      expect(requires[0].loc.start).to.equal(22)
      expect(requires[0].loc.length).to.equal(9)
    })

    it('sets location correctly', () => {
      const code = "import * as foo from './foo'"
      const requires = findRequires(code, 'example.ts')
      const req = requires[0]
      expect(req.loc.line).to.equal(1)
      expect(req.loc.start).to.equal(23)
      expect(req.loc.length).to.equal(5)
    })

    it('handles * import', () => {
      const code = `import * as foo from './path/with/separators';`

      const requires = findRequires(code, 'foo.ts')
      expect(requires.length).to.eql(1)
      expect(requires[0].path).to.equal('./path/with/separators')
      expect(requires[0].loc.line).to.equal(1)
      expect(requires[0].loc.start).to.equal(23)
      expect(requires[0].loc.length).to.equal(22)
    })

    it('handles import on multiple lines', () => {
      const code = `import {
  Foo,
  Bar
} from './path/with/separators';`

      const requires = findRequires(code, 'foo.ts')
      expect(requires.length).to.eql(1)
      expect(requires[0].path).to.equal('./path/with/separators')
      expect(requires[0].loc.line).to.equal(4)
      expect(requires[0].loc.start).to.equal(9)
      expect(requires[0].loc.length).to.equal(22)
    })

    it('handles immediately exported import', () => {
      const code = "export * from './y';"
      const requires = findRequires(code, 'foo.ts')
      expect(requires.length).to.eql(1)
      expect(requires[0].path).to.equal('./y')
    })

    it('handles import with alias', () => {
      const code = "import { Foo as Bar } from './y';"
      const requires = findRequires(code, 'foo.ts')
      expect(requires.length).to.eql(1)
      expect(requires[0].path).to.equal('./y')
    })

    it('handles import with require', () => {
      const code = "import foo = require('./foo');"
      const requires = findRequires(code, 'foo.ts')
      expect(requires.length).to.eql(1)
      expect(requires[0].path).to.equal('./foo')
    })

    it('does not treat an exported string as a file', () => {
      const code = "export const foo = './y';"
      const requires = findRequires(code, 'foo.ts')
      expect(requires.length).to.eql(0)
    })

    it('ignores npm package import', () => {
      const code = "import foo from 'foo';"
      const requires = findRequires(code, 'foo.ts')
      expect(requires.length).to.eql(0)
    })

    it('handles unassigned import', () => {
      const code = "import './y';"
      const requires = findRequires(code, 'foo.ts')
      expect(requires.length).to.eql(1)
      expect(requires[0].path).to.equal('./y')
    })
  })

  describe('path aliases', () => {
    it('handles mapped path', () => {
      const findRequires = FindRequires((path: string) => ({
        path: path.replace(/^\~/, './src'),
      }))
      const code = `import { Foo } from '~/foo/bar';`

      const requires = findRequires(code, 'foo.ts')

      expect(requires.length).to.eql(1)
      expect(requires[0].path).to.equal('./src/foo/bar')
      // expect(requires[0].text).to.equal('~/foo/bar')
      expect(requires[0].loc.line).to.equal(1)
      expect(requires[0].loc.start).to.equal(22)
      expect(requires[0].loc.length).to.equal(9)
    })
  })
})
