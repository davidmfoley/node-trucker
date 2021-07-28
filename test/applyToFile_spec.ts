'use strict'

import { describe, it } from 'mocha'
import { expect } from 'chai'
import applyToFile from '../src/handleFileChanges/applyToFile'

describe('applyToFile', function () {
  let contents: string
  let written: string
  let writtenEncoding: string

  let fs = {
    getEncoding: (f: string) => 'utf-8' as BufferEncoding,
    readContents: () => '',
    readLines: function () {
      return [''].concat(contents.split('\n'))
    },
    writeLines: function (_, data, encoding) {
      written = data.slice(1).join('\n')
      writtenEncoding = encoding
    },
  }

  it('writes the same encoding', () => {
    contents = "\nvar foo = require('./bar');\n"
    let exampleEdits = [
      {
        loc: {
          line: 2,
          start: 20,
          length: 5,
        },
        newPath: './bar/baz42',
      },
    ]
    applyToFile('foo.js', exampleEdits, fs)
    expect(writtenEncoding).to.equal('utf-8')
  })

  it('works with a single require', function () {
    var exampleEdits
    contents = "\nvar foo = require('./bar');\n"
    exampleEdits = [
      {
        loc: {
          line: 2,
          start: 20,
          length: 5,
        },
        newPath: './bar/baz42',
      },
    ]
    applyToFile('foo.js', exampleEdits, fs)
    expect(written).to.equal("\nvar foo = require('./bar/baz42');\n")
  })

  it('works with multiple requires on a line', function () {
    var exampleEdits
    contents =
      "\nvar foo = require('./foo'), bar = require('./bar');\nfunction blah(){}"
    exampleEdits = [
      {
        loc: {
          line: 2,
          start: 20,
          length: 5,
        },
        newPath: '../foo/baz42',
      },
      {
        loc: {
          line: 2,
          start: 44,
          length: 5,
        },
        newPath: '../bar/baz42',
      },
    ]
    applyToFile('foo.js', exampleEdits, fs)
    expect(written).to.equal(
      "\nvar foo = require('../foo/baz42'), bar = require('../bar/baz42');\nfunction blah(){}"
    )
  })
})
