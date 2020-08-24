import { describe, before, it } from 'mocha'
import { expect } from 'chai'
import checkForErrors from '../src/handleFileChanges/checkForErrors'

let errors

describe('checkForErrors', function () {
  describe('with no changes', function () {
    before(function () {
      errors = checkForErrors([])
    })
    it('has no errors', function () {
      expect(errors.length).to.equal(0)
    })
  })
  describe('with no duplication', function () {
    before(function () {
      errors = checkForErrors([
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
    })
    it('has no errors', function () {
      expect(errors.length).to.equal(0)
    })
  })
  describe('with duplicate destinations', function () {
    before(function () {
      errors = checkForErrors([
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
    })
    it('has an error', function () {
      expect(errors.length).to.equal(1)
      expect(errors[0]).to.equal(
        'multiple files would be moved to barg/blah.js: blah/blah.js, foo/blah.js'
      )
    })
  })
})
