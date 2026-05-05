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
      expect(result.isMoved).to.eq(true)
      expect(result.fullPath).to.eq('src/foo/bar/baz.ts')
      expect(result.requirePath).to.eq('src/foo/bar/baz')
    })

    test('other directory', () => {
      const other = calc('src/other/baz.ts')
      expect(other.isMoved).to.eq(false)
    })

    test('index file', () => {
      const indexFile = calc('src/bar/index.ts')
      expect(indexFile.isMoved).to.eq(true)
      expect(indexFile.requirePath).to.eq('src/foo/bar')
      expect(indexFile.basenameChanged).to.eq(false)
      expect(indexFile.dirnameChanged).to.eq(true)
    })

    test('non-index file with basename starting with "index"', () => {
      const indexLikeFile = calc('src/bar/index.server.ts')
      expect(indexLikeFile.isMoved).to.eq(true)
      expect(indexLikeFile.basenameChanged).to.eq(false)
      expect(indexLikeFile.dirnameChanged).to.eq(true)
      expect(indexLikeFile.requirePath).to.eq('src/foo/bar/index.server')
    })

    test('file basename with multiple dots', () => {
      const indexFile = calc('src/bar/example.server.ts')
      expect(indexFile.isMoved).to.eq(true)
      expect(indexFile.requirePath).to.eq('src/foo/bar/example.server')
      expect(indexFile.fullPath).to.eq('src/foo/bar/example.server.ts')
    })
  })

  test('move file in same directory', () => {
    const calc = fileLocationCalculator(
      [{ from: ['src/foo/bar.ts'], to: 'src/foo/baz.ts' }],
      { isDirectory: () => false, isFile: () => true } as any
    )
    const movedFile = calc('src/foo/bar.ts')
    expect(movedFile.isMoved).to.eq(true)
    expect(movedFile.requirePath).to.eq('src/foo/baz')
    expect(movedFile.fullPath).to.eq('src/foo/baz.ts')
    expect(movedFile.basenameChanged).to.eq(true)
    expect(movedFile.dirnameChanged).to.eq(false)
  })

  test('move file to different directory and basename', () => {
    const calc = fileLocationCalculator(
      [{ from: ['src/foo/bar.ts'], to: 'src/baz/wow.ts' }],
      { isDirectory: () => false, isFile: () => true } as any
    )
    const movedFile = calc('src/foo/bar.ts')

    expect(movedFile.isMoved).to.eq(true)
    expect(movedFile.requirePath).to.eq('src/baz/wow')
    expect(movedFile.fullPath).to.eq('src/baz/wow.ts')
    expect(movedFile.basenameChanged).to.eq(true)
    expect(movedFile.dirnameChanged).to.eq(true)
  })

  test('rename directory', () => {
    const calc = fileLocationCalculator(
      [{ from: ['src/bar'], to: 'src/foo' }],
      { isDirectory: () => true, isFile: () => true } as any
    )

    const result = calc('src/bar/baz.ts')
    expect(result.fullPath).to.eq('src/foo/baz.ts')
    expect(result.basenameChanged).to.eq(false)
    expect(result.dirnameChanged).to.eq(true)
  })
})
