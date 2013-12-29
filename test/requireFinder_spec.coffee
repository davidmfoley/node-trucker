requireFinder = require '../lib/requireFinder'
describe 'RequireFinder', ->
  describe 'with javascript', ->
    it 'handles a file with no requires', ->
      expect(requireFinder('js', "")).to.eql []

    it 'handles a javascript file with a single require', ->
      code = "var foo = require( './foo' );\n"
      requires = requireFinder('js', code)
      expect(requires.length).to.eql 1
      expect(requires[0].path).to.equal './foo'

    it 'ignores npm modules that are required', ->
      code = "var bar = require('bar');\nvar foo = require( './foo' );\n"
      requires = requireFinder('js', code)
      expect(requires.length).to.eql 1
      expect(requires[0].path).to.equal './foo'

    it 'sets location correctly', ->
      code = "var foo = require( './foo' );\n"
      requires = requireFinder('js', code)
      req = requires[0]
      # 1-based, seems natural
      expect(req.loc.line).to.equal 1
      expect(req.loc.start).to.equal 21
      expect(req.loc.length).to.equal 5

  describe 'with coffeescript', ->
    describe 'assigning to a variable', ->
      it 'handles a file with no requires', ->
        expect(requireFinder('coffee', "")).to.eql []

      it 'handles a coffee file with a single require', ->
        code = "foo = require( './foo' )\n"
        requires = requireFinder('coffee', code)
        expect(requires.length).to.eql 1
        expect(requires[0].path).to.equal './foo'

      it 'ignores npm modules that are required', ->
        code = "bar = require 'bar'\nfoo = require './foo'\n"
        requires = requireFinder('coffee', code)
        expect(requires.length).to.eql 1
        expect(requires[0].path).to.equal './foo'

      it 'sets location correctly', ->
        code = "foo = require( './foo' )\n"
        requires = requireFinder('coffee', code)
        req = requires[0]
        # 1-based, seems natural
        expect(req.loc.line).to.equal 1
        expect(req.loc.start).to.equal 17
        expect(req.loc.length).to.equal 5

    describe 'without assignment', ->
      it 'handles requires without left hand assignment', ->
        code = "require( './foo' )\n"
        requires = requireFinder('coffee', code)
        expect(requires.length).to.eql 1
        expect(requires[0].path).to.equal './foo'

      it 'sets location correctly', ->
        code = "\nrequire( './foo' )\n"
        requires = requireFinder('coffee', code)
        req = requires[0]
        # 1-based, seems natural
        expect(req.loc.line).to.equal 2
        expect(req.loc.start).to.equal 11
        expect(req.loc.length).to.equal 5
