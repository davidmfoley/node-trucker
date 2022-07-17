import { describe, it } from 'mocha'
import { expect } from 'chai'

import filterExcludedFiles from '../src/findSourceFiles/filterExcludedFiles'
import { SourceFile } from '../src/analyzeFiles'

describe('filterExcludedFiles', function () {
  it('handles double-star', () => {
    const files = testFiles(['foo/bar/baz.js', 'bar.js'])
    const result = filterExcludedFiles({
      ignore: {
        base: '/src',
        patterns: ['foo/**/*.js'],
      },
    })(files)
    expect(result.length).to.eql(1)
    expect(result[0].fullPath).to.eql('/src/bar.js')
  })

  it('handles glob with no slash', () => {
    const files = testFiles(['foo.js', 'baz/foo.js', 'bar.js'])
    const result = filterExcludedFiles({
      ignore: {
        base: '/src',
        patterns: ['foo.js'],
      },
    })(files)
    expect(result.length).to.eql(1)
    expect(result[0].fullPath).to.eql('/src/bar.js')
  })

  it('handles directory match of two levels', () => {
    const files = testFiles(['foo/bar/baz.js', 'bar.js'])
    const result = filterExcludedFiles({
      ignore: { base: '/src', patterns: ['foo/bar'] },
    })(files)
    expect(result.length).to.eql(1)
    expect(result[0].fullPath).to.eql('/src/bar.js')
  })

  it('handles negation', () => {
    const files = testFiles(['foo/bar/baz.js', 'bar.js'])
    const result = filterExcludedFiles({
      ignore: { base: '/src', patterns: ['foo/**/*.js'] },
    })(files)
    expect(result.length).to.eql(1)
    expect(result[0].fullPath).to.eql('/src/bar.js')
  })

  it('handles multiple ignores', () => {
    const ignores = ['foo.js', 'bar.*']
    const files = testFiles(['foo/bar/baz.js', 'bar.js', 'baz/foo.js'])
    const result = filterExcludedFiles({
      ignore: { base: '/src', patterns: ignores },
    })(files)
    expect(result.length).to.eql(1)
    expect(result[0].fullPath).to.eql('/src/foo/bar/baz.js')
  })

  it('handles no ignore', () => {
    const files = testFiles(['foo/bar/baz.js', 'bar.js', 'baz/foo.js'])
    const result = filterExcludedFiles({})(files)
    expect(result.length).to.eql(3)
  })

  it('handles no ignore patterns', () => {
    const files = testFiles(['foo/bar/baz.js', 'bar.js', 'baz/foo.js'])
    const result = filterExcludedFiles({
      ignore: { base: '/src', patterns: [] },
    })(files)
    expect(result.length).to.eql(3)
  })
})

function testFiles(names: string[]): SourceFile[] {
  return names.map((name) => ({
    fullPath: '/src/' + name,
    filetype: 'unknown',
  }))
}
