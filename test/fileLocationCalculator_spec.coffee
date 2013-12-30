path = require 'path'
fileLocationCalculator = require '../lib/fileLocationCalculator'
examplePath = path.normalize(path.join(__dirname, '../examples'))
starkPath = path.join(examplePath, '/stark')
tullyPath = path.join(examplePath, '/tully')
deceasedPath = path.join(examplePath, '/deceased')
calc = null

describe 'FileLocationCalculator', ->
  describe 'moving a file with explicit "to"', ->
    before ->
      calc = fileLocationCalculator(path.join(starkPath, '/eddard.js'), path.join(starkPath,'/ned.js'))

    it 'returns new location for the file being moved', ->
      newLoc = calc(path.join(starkPath, '/eddard.js'))
      expect(newLoc.isMoved).to.equal true
      expect(newLoc.fullPath).to.equal(path.join(starkPath, '/ned.js'))

    it 'returns unmoved location for another file', ->
      newLoc = calc(path.join(starkPath, '/catelyn.js'))
      expect(newLoc.isMoved).to.equal false
      expect(newLoc.fullPath).to.equal(path.join(starkPath, '/catelyn.js'))

  describe 'moving a file with a directory as "to"', ->
    before ->
      calc = fileLocationCalculator(path.join(starkPath, '/eddard.js'), deceasedPath + '/')

    it 'returns new location for the file being moved', ->
      newLoc = calc(path.join(starkPath, '/eddard.js'))
      expect(newLoc.isMoved).to.equal true
      expect(newLoc.fullPath).to.equal(path.join(deceasedPath, '/eddard.js'))

  describe 'moving a directory', ->
    before ->
      calc = fileLocationCalculator(starkPath, deceasedPath )

    it 'returns new location for a file being moved', ->
      newLoc = calc(path.join(starkPath, '/eddard.js'))
      expect(newLoc.isMoved).to.equal true
      expect(newLoc.fullPath).to.equal(path.join(deceasedPath, '/eddard.js'))

  describe 'moving a directory into another directory', ->
    before ->
      calc = fileLocationCalculator(starkPath, deceasedPath + '/' )

    it 'returns new location for a file being moved', ->
      newLoc = calc(path.join(starkPath, '/eddard.js'))
      expect(newLoc.isMoved).to.equal true
      expect(newLoc.fullPath).to.equal(path.join(deceasedPath, '/stark/eddard.js'))
