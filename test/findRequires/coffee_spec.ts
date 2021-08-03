import { describe, it } from 'mocha'
import { expect } from 'chai'
import FindRequires from '../../src/analyzeFiles/findRequires'

const exampleName = 'example.js'

const findRequires = FindRequires({} as any)

describe('RequireFinder', () => {
  describe('with coffeescript', () => {
    describe('assigning to a variable', () => {
      it('handles a file with no requires', () => {
        expect(findRequires('coffee', '', exampleName)).to.eql([])
      })

      it('handles a coffee file with a single require', () => {
        const code = "foo = require( './foo' )\n"
        const requires = findRequires('coffee', code, exampleName)
        expect(requires.length).to.eql(1)
        expect(requires[0].path).to.equal('./foo')
      })

      it('ignores npm modules that are required', () => {
        const code = "bar = require 'bar'\nfoo = require './foo'\n"
        const requires = findRequires('coffee', code, exampleName)
        expect(requires.length).to.eql(1)
        expect(requires[0].path).to.equal('./foo')
      })

      it('sets location correctly', () => {
        const code = "foo = require( './foo' )\n"
        const requires = findRequires('coffee', code, exampleName)
        const req = requires[0]
        expect(req.loc.line).to.equal(1)
        expect(req.loc.start).to.equal(17)
        expect(req.loc.length).to.equal(5)
      })
    })

    describe('without assignment', () => {
      it('handles requires without left hand assignment', () => {
        const code = "require( './foo' )\n"
        const requires = findRequires('coffee', code, exampleName)
        expect(requires.length).to.eql(1)
        expect(requires[0].path).to.equal('./foo')
      })

      it('sets location correctly', () => {
        const code = "\nrequire( './foo' )\n"
        const requires = findRequires('coffee', code, exampleName)
        const req = requires[0]
        expect(req.loc.line).to.equal(2)
        expect(req.loc.start).to.equal(11)
        expect(req.loc.length).to.equal(5)
      })
    })
  })
})
