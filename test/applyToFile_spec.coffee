path = require 'path'
applyToFile = require '../lib/handleFileChanges/applyToFile'
contents = written = ""

fs =
  readFileSync: -> contents
  writeFileSync: (_, data) ->
    written = data



describe 'applyToFile', ->
  it 'works with a single require', ->
    contents = "\nvar foo = require('./bar');\n"
    exampleEdits = [{
      loc: {line: 2, column:20, length: 5}
      newPath: './bar/baz42'
    }]
    applyToFile('foo.js', exampleEdits, fs)
    expect(written).to.equal "\nvar foo = require('./bar/baz42');\n"


  it 'works with multiple requires on a line', ->
    contents = "\nvar foo = require('./foo'), bar = require('./bar');\nfunction blah(){}"
    exampleEdits = [{
      loc: {line: 2, column:20, length: 5}
      newPath: '../foo/baz42'
    },{
      loc: {line: 2, column:44, length: 5}
      newPath: '../bar/baz42'
    }]
    applyToFile('foo.js', exampleEdits, fs)
    expect(written).to.equal "\nvar foo = require('../foo/baz42'), bar = require('../bar/baz42');\nfunction blah(){}"
