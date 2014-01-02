path = require 'path'
fileLocationCalculator = require '../lib/findChangedRequires/fileLocationCalculator'
examplePath = path.normalize(path.join(__dirname, '../examples'))
starkPath = path.join(examplePath, '/stark')
tullyPath = path.join(examplePath, '/tully')
deceasedPath = path.join(examplePath, '/deceased')
calc = null

whenLocationsAre = (froms, to) ->
  froms = [froms] unless Array.isArray(froms)
  froms = (path.join(examplePath, f) for f in froms)
  calc = fileLocationCalculator(froms, path.join(examplePath, to))

expectMove = (from, toPath, toRequire) ->
  newLoc = calc(path.join(examplePath, from))
  expect(newLoc.isMoved).to.equal true
  expect(newLoc.fullPath).to.equal(path.join(examplePath, toPath))
  expect(newLoc.requirePath).to.equal(path.join(examplePath, toRequire)) if toRequire

expectNoMove= (from) ->
  newLoc = calc(path.join(examplePath, from))
  expect(newLoc.isMoved).to.equal false

describe 'FileLocationCalculator', ->
  describe 'moving a file with explicit "to"', ->
    before ->
      whenLocationsAre('stark/eddard.js', 'stark/ned.js')

    it 'returns new location for the file being moved', ->
      expectMove('stark/eddard.js', 'stark/ned.js')

    it 'returns unmoved location for another file', ->
      expectNoMove('/catelyn.js')

  describe 'moving a file with a directory as "to"', ->
    it 'returns new location for the file being moved', ->
      whenLocationsAre('stark/eddard.js', 'deceased/')
      expectMove('stark/eddard.js', 'deceased/eddard.js')

    it 'returns new location for the file being moved', ->
      whenLocationsAre('stark/eddard.js', 'deceased')
      expectMove('stark/eddard.js', 'deceased/eddard.js')

  describe 'moving a directory', ->
    it 'returns new location for a file being moved', ->
      whenLocationsAre('stark', 'deceased')
      expectMove('stark/eddard.js', 'deceased/eddard.js', 'deceased/eddard')

    it 'returns new location for a file being moved, handling trailing slash', ->
      whenLocationsAre('stark/', 'deceased')
      expectMove('stark/eddard.js', 'deceased/eddard.js', 'deceased/eddard')

  describe 'moving a directory into another directory', ->
    it 'returns new location for a file being moved', ->
      whenLocationsAre('stark', 'deceased/')
      expectMove('stark/eddard.js', 'deceased/eddard.js', 'deceased/eddard')

  describe 'moving multiple files', ->
    before ->
      whenLocationsAre(['stark/eddard.js', 'stark/robb.coffee'], 'deceased/')

    it 'returns new location for eddard', ->
      expectMove('stark/eddard.js', 'deceased/eddard.js', 'deceased/eddard')

    it 'returns new location for robb', ->
      expectMove('stark/robb.coffee', 'deceased/robb.coffee', 'deceased/robb')

    it 'throws if multiple froms and to is a file', ->
      expect( -> fileLocationCalculator([path.join(starkPath, '/eddard.js'), path.join(starkPath, '/robb.coffee')], path.join(starkPath,'/eddard.js'))).to.throw(Error)
