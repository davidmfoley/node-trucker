changedRequiresByFile = require '../lib/changedRequiresByFile'
path = require 'path'

examplePath = path.normalize(path.join(__dirname, '../examples/'))
p = (subPath) -> path.normalize(path.join(examplePath, subPath))

files = null

describe 'changedRequiresByFile', ->
  describe 'moving a file', ->
    before ->
      files = changedRequiresByFile(p('stark/robb.coffee'), p('deceased/'), examplePath)
      files = files.sort (a,b) -> a.from > b.from

    it 'has the correct fixes', ->
      expect(files.length).to.equal 2

    it 'fixes the outbound require in the file', ->
      expect(files[1].requires.length).to.equal 1
      outbound = files[1].requires[0]
      expect(outbound.path).to.equal './eddard'
      expect(outbound.newPath).to.equal '../stark/eddard'

    it 'fixes the inbound require in a referencing file', ->
      expect(files[0].requires.length).to.equal 1
      inbound = files[0].requires[0]
      expect(inbound.path).to.equal './robb'
      expect(inbound.newPath).to.equal '../deceased/robb'

  describe 'moving a directory', ->
    before ->
      files = changedRequiresByFile(p('tully/'), p('deceased'), examplePath)
      files = files.sort (a,b) -> a.from > b.from

    it 'fixes the inbound require in a referencing file', ->
      expect(files.length).to.equal 1
      expect(files[0].requires.length).to.equal 1
      inbound = files[0].requires[0]
      expect(inbound.path).to.equal '../tully/catelyn'
      expect(inbound.newPath).to.equal '../deceased/catelyn'
