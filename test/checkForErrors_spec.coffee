checkForErrors = require '../lib/handleFileChanges/checkForErrors'
errors = null
describe 'checkForErrors', ->
  describe 'with no changes', ->
    before ->
      errors = checkForErrors []

    it 'has no errors', ->
      expect(errors.length).to.equal(0)

  describe 'with no duplication', ->
    before ->
      errors = checkForErrors [
        {from: 'blah/blah.js', to: 'barg/blah/blah.js', requires: []}
        {from: 'foo/blah.js', to: 'barg/foo/blah.js', requires: []}
      ]

    it 'has no errors', ->
      expect(errors.length).to.equal(0)

  describe 'with duplicate destinations', ->
    before ->
      errors = checkForErrors [
        {from: 'blah/blah.js', to: 'barg/blah.js', requires: []}
        {from: 'foo/blah.js', to: 'barg/blah.js', requires: []}
      ]

    it 'has an error', ->
      expect(errors.length).to.equal(1)
      expect(errors[0]).to.equal('multiple files would be moved to barg/blah.js: blah/blah.js, foo/blah.js')
