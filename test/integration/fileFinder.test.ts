import { describe, before, it } from 'mocha'
import { expect } from 'chai'

import path from 'path'
import fileFinder from '../../src/findSourceFiles/findFiles'
import { examplesPath } from './examplesPath'

const starkPath = path.join(examplesPath, '/stark')
const tullyPath = path.join(examplesPath, '/tully')

function byFullPath(a, b) {
  return a.fullPath > b.fullPath ? 1 : -1
}

describe('fileFinder', function () {
  let result
  describe('in a single directory', function () {
    before(function () {
      result = fileFinder(starkPath).sort(byFullPath)
    })
    it('can find eddard', function () {
      const eddard = result[0]
      expect(eddard.fullPath).to.equal(path.normalize(starkPath + '/eddard.js'))
      expect(eddard.filetype).to.equal('js')
      expect(eddard.relativePath).to.equal('eddard.js')
    })
    it('can find robb', function () {
      const robb = result[1]
      expect(robb.fullPath).to.equal(path.normalize(starkPath + '/robb.coffee'))
      expect(robb.filetype).to.equal('coffee')
      expect(robb.relativePath).to.equal('robb.coffee')
    })
  })
  describe('recursively', function () {
    before(function () {
      result = fileFinder(examplesPath).sort(byFullPath)
    })
    it('can find eddard', function () {
      const eddard = result[0]
      expect(eddard.fullPath).to.equal(path.normalize(starkPath + '/eddard.js'))
      expect(eddard.filetype).to.equal('js')
      expect(eddard.relativePath).to.equal('stark/eddard.js')
    })
    it('can find sansa', function () {
      const sansa = result[2]
      expect(sansa.fullPath).to.equal(
        path.normalize(starkPath + '/sansa.coffee')
      )
      expect(sansa.filetype).to.equal('coffee')
      expect(sansa.relativePath).to.equal('stark/sansa.coffee')
    })
    it('can find catelyn', function () {
      const catelyn = result[3]
      expect(catelyn.fullPath).to.equal(
        path.normalize(tullyPath + '/catelyn.js')
      )
      expect(catelyn.filetype).to.equal('js')
      expect(catelyn.relativePath).to.equal('tully/catelyn.js')
    })
  })
})
