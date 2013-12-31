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
      expect(newLoc.requirePath).to.equal(path.join(starkPath, '/catelyn'))

  describe 'moving a file with a directory as "to"', ->
    it 'returns new location for the file being moved', ->
      calc = fileLocationCalculator(path.join(starkPath, '/eddard.js'), deceasedPath + '/')
      newLoc = calc(path.join(starkPath, '/eddard.js'))
      expect(newLoc.isMoved).to.equal true
      expect(newLoc.fullPath).to.equal(path.join(deceasedPath, '/eddard.js'))

    it 'returns new location for the file being moved', ->
      calc = fileLocationCalculator(path.join(starkPath, '/eddard.js'), deceasedPath)
      newLoc = calc(path.join(starkPath, '/eddard.js'))
      expect(newLoc.isMoved).to.equal true
      expect(newLoc.fullPath).to.equal(path.join(deceasedPath, '/eddard.js'))

  describe 'moving a directory', ->
    it 'returns new location for a file being moved', ->
      calc = fileLocationCalculator(starkPath, deceasedPath )
      newLoc = calc(path.join(starkPath, '/eddard.js'))
      expect(newLoc.isMoved).to.equal true
      expect(newLoc.fullPath).to.equal(path.join(deceasedPath, '/eddard.js'))
      expect(newLoc.requirePath).to.equal(path.join(deceasedPath, '/eddard'))

    it 'returns new location for a file being moved, handling trailing slash', ->
      calc = fileLocationCalculator(starkPath + '/', deceasedPath )
      newLoc = calc(path.join(starkPath, '/eddard.js'))
      expect(newLoc.isMoved).to.equal true
      expect(newLoc.fullPath).to.equal(path.join(deceasedPath, '/eddard.js'))
      expect(newLoc.requirePath).to.equal(path.join(deceasedPath, '/eddard'))

  describe 'moving a directory into another directory', ->
    it 'returns new location for a file being moved', ->
      calc = fileLocationCalculator(starkPath, deceasedPath + '/' )
      newLoc = calc(path.join(starkPath, '/eddard.js'))
      expect(newLoc.isMoved).to.equal true
      expect(newLoc.fullPath).to.equal(path.join(deceasedPath, '/eddard.js'))
