_ = require 'lodash'
path = require 'path'
fileFinder = require '../lib/fileFinder'
examplePath = path.normalize(path.join(__dirname, '../examples'))
starkPath = path.join(examplePath, '/stark')
tullyPath = path.join(examplePath, '/tully')
result = null

describe 'fileFinder', ->
  describe 'in a single directory', ->
    before ->
      result = _.sortBy(fileFinder(starkPath), 'fullPath')

    it 'can find eddard',  ->
      eddard = result[0]
      expect(eddard.fullPath).to.equal(path.normalize(starkPath + '/eddard.js'))
      expect(eddard.filetype).to.equal('js')
      expect(eddard.relativePath).to.equal('eddard.js')

    it 'can find robb', ->
      robb = result[1]
      expect(robb.fullPath).to.equal(path.normalize(starkPath + '/robb.coffee'))
      expect(robb.filetype).to.equal('coffee')
      expect(robb.relativePath).to.equal('robb.coffee')

  describe 'recursively', ->
    before ->
      result = _.sortBy(fileFinder(examplePath), 'fullPath')

    it 'can find eddard',  ->
      eddard = result[0]
      expect(eddard.fullPath).to.equal(path.normalize(starkPath + '/eddard.js'))
      expect(eddard.filetype).to.equal('js')
      expect(eddard.relativePath).to.equal('stark/eddard.js')

    it 'can find catelyn',  ->
      catelyn = result[2]
      expect(catelyn.fullPath).to.equal(path.normalize(tullyPath + '/catelyn.js'))
      expect(catelyn.filetype).to.equal('js')
      expect(catelyn.relativePath).to.equal('tully/catelyn.js')

