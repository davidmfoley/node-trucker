path = require 'path'
_ = require 'lodash'
sourceFileAnalyzer = require '../lib/sourceFileAnalyzer'
examplePath = path.normalize(path.join(__dirname, '../examples'))
result = null

describe 'sourceFileAnalyzer', ->
  describe 'analyzing a sourcefile', ->
    before ->
      result = sourceFileAnalyzer
        fullPath: path.join(examplePath, 'stark/eddard.js'),
        relativePath: 'stark/eddard.js',
        filetype: 'js'

    it 'has requires', ->
      requires = _.sortBy(result.requires, 'path')
      expect(requires.length).to.equal 2

