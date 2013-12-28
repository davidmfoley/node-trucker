chai = require 'chai'
global.expect = chai.expect

describe 'foo', ->
  it 'bars', ->
    expect(42).to.equal(42)
