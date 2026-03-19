import { describe, test } from 'mocha'
import { expect } from 'chai'

import fileLocationCalculator from './fileLocationCalculator'

describe('FileLocationCalculator', () => {
  describe('directory into another directory', () => {
    const calc = fileLocationCalculator(
      [{ from: ['src/bar'], to: 'src/foo/' }],
      { isDirectory: () => true, isFile: () => true } as any
    )

    test('matching directory', () => {
      const result = calc('src/bar/baz.ts')
      expect(result.fullPath).to.eq('src/foo/bar/baz.ts')
    })

    test('other directory', () => {
      const other = calc('src/other/baz.ts')
      expect(other.isMoved).to.eq(false)
    })
  })

  test('rename directory', () => {
    const calc = fileLocationCalculator(
      [{ from: ['src/bar'], to: 'src/foo' }],
      { isDirectory: () => true, isFile: () => true } as any
    )

    const result = calc('src/bar/baz.ts')
    expect(result.fullPath).to.eq('src/foo/baz.ts')
  })
})
