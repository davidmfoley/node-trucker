import { describe, it } from 'mocha'
import { expect } from 'chai'

import path from 'path'
import readIgnores from '../src/buildJob/readIgnores'

describe('readIgnores', function () {
  it('works here', function () {
    // read the trucker .gitignore
    const ignore = readIgnores(__dirname)
    expect(ignore.patterns.slice(0, 4)).to.eql([
      'node_modules',
      'tmp',
      'coverage',
      'lib',
    ])

    expect(ignore.base).to.equal(path.normalize(__dirname + '/..'))
  })
})
