RequireFinder = require '../lib/requireFinder'
describe 'RequireFinder', ->
  it 'handles a file with no requires', ->
    expect(RequireFinder.find('js', "")).to.eql []

