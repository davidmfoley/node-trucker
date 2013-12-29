RequireFinder = require '../lib/requireFinder'
describe 'RequireFinder', ->
  describe 'with javascript', ->
    it 'handles a file with no requires', ->
      expect(RequireFinder.find('js', "")).to.eql []

    it 'handles a javascript file with a single require', ->
      code = "var foo = require( './foo' );\n"
      requires = RequireFinder.find('js', code)
      expect(requires.length).to.eql 1
      expect(requires[0].path).to.equal './foo'

    it 'ignores npm modules that are required', ->
      code = "var bar = require('bar');\nvar foo = require( './foo' );\n"
      requires = RequireFinder.find('js', code)
      expect(requires.length).to.eql 1
      expect(requires[0].path).to.equal './foo'

  describe 'with coffeescript', ->
    it 'handles a file with no requires', ->
      expect(RequireFinder.find('coffee', "")).to.eql []

    it 'handles a coffee file with a single require', ->
      code = "foo = require( './foo' )\n"
      requires = RequireFinder.find('coffee', code)
      expect(requires.length).to.eql 1
      expect(requires[0].path).to.equal './foo'

    it 'ignores npm modules that are required', ->
      code = "bar = require 'bar'\nfoo = require './foo'\n"
      requires = RequireFinder.find('coffee', code)
      expect(requires.length).to.eql 1
      expect(requires[0].path).to.equal './foo'

