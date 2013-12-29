RequireFinder = require '../lib/requireFinder'
describe 'RequireFinder', ->
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
