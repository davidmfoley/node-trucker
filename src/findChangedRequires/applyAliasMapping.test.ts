import { test } from 'mocha'
import { expect } from 'chai'
import { applyAliasMapping } from './applyAliasMapping'

describe('applyAliasMapping', () => {
  test('moved to a path outside the alias destination', () => {
    expect(
      applyAliasMapping(
        { alias: '~/foo', destination: './lib/foo' },
        './lib/bar'
      )
    ).to.eql({
      result: 'no-match',
      path: './lib/bar',
    })
  })

  test('moved within the alias destination', () => {
    expect(
      applyAliasMapping(
        { alias: '~/foo', destination: './lib/foo' },
        './lib/foo/bar'
      )
    ).to.eql({
      result: 'match',
      path: '~/foo/bar',
    })
  })
})
