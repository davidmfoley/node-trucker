path = require 'path'
sourceFileAnalyzer = require '../lib/analyzeFiles/sourceFileAnalyzer'
examplePath = path.normalize(path.join(__dirname, '../examples'))
result = requires = null

describe 'sourceFileAnalyzer', ->
  describe 'analyzing a sourcefile', ->
    before ->
      result = sourceFileAnalyzer
        fullPath: path.join(examplePath, 'stark/eddard.js'),
        relativePath: 'stark/eddard.js',
        filetype: 'js'

      requires = result.requires.sort (a,b) -> a.fullPath > b.fullPath

    it 'has requires', ->
      expect(requires.length).to.equal 2

    it 'decorates require in a different location with full path', ->
      expected = path.normalize(path.join(examplePath, 'tully/catelyn'))
      expect(requires[1].fullPath).to.equal(expected)

    it 'decorates require in the same location with full path', ->
      expected = path.normalize(path.join(examplePath, 'stark/robb'))
      expect(requires[0].fullPath).to.equal(expected)

  describe 'analyzing a sourcefile with a shebang', ->
    before ->
      result = sourceFileAnalyzer
        fullPath: path.join(examplePath, 'shebang.coffee'),
        relativePath: 'shebang.coffee',
        filetype: 'coffee'

      requires = result.requires.sort (a,b) -> a.fullPath > b.fullPath
    
   it 'has requires', ->
     expect(requires.length).to.equal 1

