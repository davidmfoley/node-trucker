import { describe, it } from 'mocha'
import { expect } from 'chai'
import FindRequires from '../findRequires'

const exampleName = 'example.js'

const findRequires = FindRequires({} as any)

describe('RequireFinder', () => {
  describe('with es6 imports', () => {
    it('handles a file with no requires', () => {
      expect(findRequires('js', '', exampleName)).to.eql([])
    })

    it('handles a single require', () => {
      const code = "import * as x from './y';"
      const requires = findRequires('js', code, exampleName)
      expect(requires.length).to.eql(1)
      expect(requires[0].relativePath).to.equal('./y')
    })

    it('handles unassigned import', () => {
      const code = "import './y';"
      const requires = findRequires('js', code, exampleName)
      expect(requires.length).to.eql(1)
      expect(requires[0].relativePath).to.equal('./y')
    })

    it('handles immediately exported import', () => {
      const code = "export * from './y';"
      const requires = findRequires('js', code, exampleName)
      expect(requires.length).to.eql(1)
      expect(requires[0].relativePath).to.equal('./y')
    })

    it('ignores a jsx tag on same line as export', () => {
      const code = `import React from 'react'
export default () => <a href="/">Test</a>;`
      const requires = findRequires('js', code, exampleName)
      expect(requires.length).to.eql(0)
    })

    it('handles flow and js imports on multiline', () => {
      const code = `import MyModule, {
        type FlowTypeA,
        type FlowTypeB
      } from './MyModule'
      `
      const requires = findRequires('js', code, exampleName)
      expect(requires.length).to.eql(1)
      expect(requires[0].relativePath).to.equal('./MyModule')
    })

    it('ignores npm modules that are required', () => {
      const code = "import bar from 'bar';\nimport foo from './foo' ;\n"
      const requires = findRequires('js', code, exampleName)
      expect(requires.length).to.eql(1)
      expect(requires[0].relativePath).to.equal('./foo')
    })

    it('sets location correctly', () => {
      const code = "import * as foo from './foo'"
      const requires = findRequires('js', code, exampleName)
      const req = requires[0]
      expect(req.loc.line).to.equal(1)
      expect(req.loc.start).to.equal(23)
      expect(req.loc.length).to.equal(5)
    })

    it('ignores a string that looks like a path in the body', () => {
      const code = `import MyModule, {
        type FlowTypeA,
        type FlowTypeB
      } from './MyModule'

      const example = './MyModule';
      `

      const requires = findRequires('js', code, exampleName)
      expect(requires.length).to.eql(1)
      expect(requires[0].relativePath).to.equal('./MyModule')
    })

    // cheese factor high
    describe('with regex finder', () => {
      it('falls back to regex parsing if babel fails to parse', () => {
        const code = `'use strict';

var theThing = require('./thing');
import theOther from   './other';
this is garbage ())((((/.
`
        const requires = findRequires('js', code, exampleName)
        expect(requires.length).to.eql(2)

        const [thing, other] = requires

        expect(thing.relativePath).to.equal('./thing')
        expect(thing.loc.line).to.equal(3)
        expect(thing.loc.start).to.equal(25)
        expect(thing.loc.length).to.equal(7)

        expect(other.relativePath).to.equal('./other')
        expect(other.loc.line).to.equal(4)
        expect(other.loc.start).to.equal(25)
        expect(other.loc.length).to.equal(7)
      })

      it('handles unassigned imports and requires', () => {
        const code = `use strict;
import   './thing';
require( './other' );
this is garbage ())((((/.
`
        const requires = findRequires('js', code, exampleName)
        expect(requires.length).to.eql(2)

        const [thing, other] = requires

        expect(thing.relativePath).to.equal('./thing')
        expect(thing.loc.line).to.equal(2)
        expect(thing.loc.length).to.equal(7)
        expect(thing.loc.start).to.equal(11)

        expect(other.relativePath).to.equal('./other')
        expect(other.loc.line).to.equal(3)
        expect(other.loc.length).to.equal(7)
        expect(other.loc.start).to.equal(11)
      })

      it('does not include module refs', () => {
        const code = `'use strict';

var theThing = require('./thing');
var module = require('module');
this is garbage ())((((/.
`
        const requires = findRequires('js', code, exampleName)
        expect(requires.length).to.eql(1)
        const req = requires[0]
        expect(req.relativePath).to.equal('./thing')
        expect(req.loc.line).to.equal(3)
        expect(req.loc.start).to.equal(25)
        expect(req.loc.length).to.equal(7)
      })
    })

    it('handles async functions', () => {
      // https://github.com/davidmfoley/node-trucker/issues/10
      const code = `
import Foo from './foo';
export const fetchLookup = query =>
  async dispatch => {
    const fetchUsers = {
      type: DD_FETCH_USERS,
      queue: DD_FETCH_USERS,
      query
    }
  }
    `

      const requires = findRequires('js', code, exampleName)
      expect(requires.length).to.eql(1)
      expect(requires[0].relativePath).to.equal('./foo')
    })

    it('handles flow annotations', () => {
      // https://github.com/davidmfoley/node-trucker/issues/11
      const code = `
// @flow
import moduleA from './module-a'
import moduleB from './module-b'

export default (a: string): Object => moduleB(moduleA(a))
      `
      const requires = findRequires('js', code, exampleName)

      expect(requires.length).to.eql(2)
      expect(requires[0].relativePath).to.equal('./module-a')
      expect(requires[1].relativePath).to.equal('./module-b')
    })
  })

  describe('with javascript', () => {
    it('handles a file with no requires', () => {
      expect(findRequires('js', '', exampleName)).to.eql([])
    })

    it('handles a javascript file with a single require', () => {
      const code = "var foo = require( './foo' );\n"
      const requires = findRequires('js', code, exampleName)
      expect(requires.length).to.eql(1)
      expect(requires[0].relativePath).to.equal('./foo')
    })

    it("handles import in a file that babylon can't fully parse", () => {
      const code = `import * as x from './y';
import z from './z';
let foo;
foo = foo || () => {}; //babylon can't handle this for some reason
      `
      const requires = findRequires('js', code, exampleName)
      expect(requires.length).to.eql(2)
      expect(requires[0].relativePath).to.equal('./y')
      expect(requires[1].relativePath).to.equal('./z')
    })

    it("handles require in a file that babylon can't fully parse", () => {
      const code = `const x = require('./y');
const z = require('./z');
let foo;
foo = foo || () => {}; //babylon can't handle this for some reason
      `
      const requires = findRequires('js', code, exampleName)
      expect(requires.length).to.eql(2)
      expect(requires[0].relativePath).to.equal('./y')
      expect(requires[1].relativePath).to.equal('./z')
    })

    it('handles a shebanged javascript file', () => {
      const code = "#! /usr/bin/env node\nvar foo = require( './foo' );\n"
      const requires = findRequires('js', code, exampleName)
      expect(requires.length).to.eql(1)
      expect(requires[0].relativePath).to.equal('./foo')
      expect(requires[0].loc.line).to.equal(2)
    })

    it('ignores npm modules that are required', () => {
      const code = "var bar = require('bar');\nvar foo = require( './foo' );\n"
      const requires = findRequires('js', code, exampleName)
      expect(requires.length).to.eql(1)
      expect(requires[0].relativePath).to.equal('./foo')
    })

    it('sets location correctly', () => {
      const code = "var foo = require( './foo' );\n"
      const requires = findRequires('js', code, exampleName)
      const req = requires[0]
      expect(req.loc.line).to.equal(1)
      expect(req.loc.start).to.equal(21)
      expect(req.loc.length).to.equal(5)
    })
  })
})
