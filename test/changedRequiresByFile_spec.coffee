changedRequiresByFile = require '../lib/findChangedRequires'
path = require 'path'

examplePath = path.normalize(path.join(__dirname, '../examples/'))
p = (subPath) -> path.normalize(path.join(examplePath, subPath))
job =(from, to) -> {from: [p(from)], to: p(to), base: examplePath}

files = null

describe 'changedRequiresByFile', ->
  describe 'moving a file', ->
    before ->
      files = changedRequiresByFile(job('stark/robb.coffee', 'deceased/'))
      files = files.sort (a,b) -> a.from > b.from

    it 'has the correct fixes', ->
      expect(files.length).to.equal 3

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

    it 'keeps the extension in a referencing file', ->
      expect(files[2].requires.length).to.equal 1
      inbound = files[2].requires[0]
      expect(inbound.path).to.equal './robb.coffee'
      expect(inbound.newPath).to.equal '../deceased/robb.coffee'

  describe 'moving a directory', ->
    before ->
      files = changedRequiresByFile(job('tully/', 'deceased'))
      files = files.sort (a,b) -> a.from > b.from

    it 'fixes the inbound require in a referencing file', ->
      expect(files.length).to.equal 2
      expect(files[0].requires.length).to.equal 1
      inbound = files[0].requires[0]
      expect(inbound.path).to.equal '../tully/catelyn'
      expect(inbound.newPath).to.equal '../deceased/catelyn'

    it 'includes the file that is moving', ->
      expect(files.length).to.equal 2
      expect(files[1].requires.length).to.equal 0

  describe 'moving a directory outside the base', ->
    before ->
      files = changedRequiresByFile(job('tully/', '/../tully'))
      files = files.sort (a,b) -> a.from > b.from

    it 'fixes the inbound require in a referencing file', ->
      expect(files[0].requires.length).to.equal 1
      inbound = files[0].requires[0]
      expect(inbound.path).to.equal '../tully/catelyn'
      expect(inbound.newPath).to.equal '../../tully/catelyn'

    it 'fixes the outbound require', ->
      expect(files[1].requires.length).to.equal 1
      outbound = files[1].requires[0]
      expect(outbound.path).to.equal '../stark/eddard'
      expect(outbound.newPath).to.equal '../examples/stark/eddard'
