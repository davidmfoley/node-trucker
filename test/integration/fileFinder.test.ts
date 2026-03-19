import { describe, before, it } from 'mocha'
import { expect } from 'chai'

import path from 'path'
import fileFinder from '../../src/findSourceFiles/findFiles'
import { examplesPath } from './examplesPath'
import { SourceFile } from '../../src/analyzeFiles'

const starkPath = path.join(examplesPath, '/stark')
const tullyPath = path.join(examplesPath, '/tully')

function byFullPath(a, b) {
  return a.fullPath > b.fullPath ? 1 : -1
}

describe('fileFinder', () => {
  let result: SourceFile[]

  describe('in a single directory', () => {
    before(() => {
      result = fileFinder(starkPath).sort(byFullPath)
    })
    it('can find js file', () => {
      const eddard = result[0]
      expect(eddard.fullPath).to.equal(path.normalize(starkPath + '/eddard.js'))
      expect(eddard.filetype).to.equal('js')
      expect(eddard.relativePath).to.equal('eddard.js')
    })
    it('can find typescript', () => {
      const robb = result[1]
      expect(robb.fullPath).to.equal(path.normalize(starkPath + '/robb.ts'))
      expect(robb.filetype).to.equal('ts')
      expect(robb.relativePath).to.equal('robb.ts')
    })
    it('can find mjs', () => {
      const robb = result[2]
      expect(robb.fullPath).to.equal(path.normalize(starkPath + '/sansa.mjs'))
      expect(robb.filetype).to.equal('js')
      expect(robb.relativePath).to.equal('sansa.mjs')
    })
  })
  describe('recursively', () => {
    before(() => {
      result = fileFinder(examplesPath).sort(byFullPath)
    })
    it('can find eddard', () => {
      const eddard = result[0]
      expect(eddard.fullPath).to.equal(path.normalize(starkPath + '/eddard.js'))
      expect(eddard.filetype).to.equal('js')
      expect(eddard.relativePath).to.equal('stark/eddard.js')
    })
    it('can find sansa', () => {
      const sansa = result[2]
      expect(sansa.fullPath).to.equal(path.normalize(starkPath + '/sansa.mjs'))
      expect(sansa.filetype).to.equal('js')
      expect(sansa.relativePath).to.equal('stark/sansa.mjs')
    })
    it('can find catelyn', () => {
      const catelyn = result[3]
      expect(catelyn.fullPath).to.equal(
        path.normalize(tullyPath + '/catelyn.js')
      )
      expect(catelyn.filetype).to.equal('js')
      expect(catelyn.relativePath).to.equal('tully/catelyn.js')
    })
  })
})
