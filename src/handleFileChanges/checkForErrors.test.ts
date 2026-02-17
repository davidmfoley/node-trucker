import { describe, test } from 'mocha'
import { expect } from 'chai'
import checkForErrors from './checkForErrors'

describe('checkForErrors', () => {
  test('with no changes', () => {
    const errors = checkForErrors([])
    expect(errors.length).to.equal(0)
  })

  test('with no duplication', () => {
    const errors = checkForErrors([
      {
        from: 'blah/blah.js',
        to: 'barg/blah/blah.js',
        requires: [],
      },
      {
        from: 'foo/blah.js',
        to: 'barg/foo/blah.js',
        requires: [],
      },
    ])
    expect(errors.length).to.equal(0)
  })

  test('with duplicate destinations', () => {
    const errors = checkForErrors([
      {
        from: 'blah/blah.js',
        to: 'barg/blah.js',
        requires: [],
      },
      {
        from: 'foo/blah.js',
        to: 'barg/blah.js',
        requires: [],
      },
    ])

    expect(errors.length).to.equal(1)
    expect(errors[0]).to.equal(
      'multiple files would be moved to barg/blah.js: blah/blah.js, foo/blah.js'
    )
  })
})
