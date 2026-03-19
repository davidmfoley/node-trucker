import path from 'path'
import { describe, it } from 'mocha'
import { expect } from 'chai'

import changedRequiresByFile from '../../src/findChangedImports'

import { FileModification } from '../../src/FileModification'
import { examplesPath } from './examplesPath'

function p(subPath: string) {
  return path.normalize(path.join(examplesPath, subPath))
}

function moveJob(from: string, to: string) {
  return {
    moves: [
      {
        from: [p(from)],
        to: p(to),
      },
    ],
    base: examplesPath,
  } as any
}

const sortByFrom = (a: FileModification, b: FileModification) =>
  a.from > b.from ? 1 : -1

describe('changedRequiresByFile', () => {
  describe('moving a file', () => {
    it('has the correct fixes', () => {
      const files = changedRequiresByFile(moveJob('stark/robb.ts', 'deceased/'))
      expect(files.length).to.equal(3)
    })

    it('fixes the outbound require in the file', () => {
      const files = changedRequiresByFile(
        moveJob('stark/robb.ts', 'deceased/')
      ).sort(sortByFrom)

      expect(files[1].requires.length).to.equal(1)
      const outbound = files[1].requires[0]
      expect(outbound.path).to.equal('./eddard')
      expect(outbound.newPath).to.equal('../stark/eddard')
    })
    it('fixes the inbound require in a referencing file', () => {
      const files = changedRequiresByFile(
        moveJob('stark/robb.ts', 'deceased/')
      ).sort(sortByFrom)

      expect(files[0].requires.length).to.equal(1)
      const inbound = files[0].requires[0]
      expect(inbound.path).to.equal('./robb')
      expect(inbound.newPath).to.equal('../deceased/robb')
    })
    it('keeps the extension in a referencing file', () => {
      const files = changedRequiresByFile(
        moveJob('stark/robb.ts', 'deceased/')
      ).sort(sortByFrom)
      expect(files[2].requires.length).to.equal(1)
      const inbound = files[2].requires[0]
      expect(inbound.path).to.equal('./robb.ts')
      expect(inbound.newPath).to.equal('../deceased/robb.ts')
    })
  })

  describe('moving a directory', () => {
    it('fixes the inbound require in a referencing file', () => {
      const files = changedRequiresByFile(moveJob('tully/', 'deceased')).sort(
        sortByFrom
      )
      expect(files.length).to.equal(2)
      expect(files[0].requires.length).to.equal(1)

      const inbound = files[0].requires[0]
      expect(inbound.path).to.equal('../tully/catelyn')
      expect(inbound.newPath).to.equal('../deceased/catelyn')
    })
    it('includes the file that is moving', () => {
      const files = changedRequiresByFile(moveJob('tully/', 'deceased')).sort(
        sortByFrom
      )
      expect(files.length).to.equal(2)
      expect(files[1].requires.length).to.equal(0)
    })
  })
  describe('moving a directory outside the base', () => {
    it('fixes the inbound require in a referencing file', () => {
      const files = changedRequiresByFile(moveJob('tully/', '/../tully')).sort(
        sortByFrom
      )
      expect(files[0].requires.length).to.equal(1)
      const inbound = files[0].requires[0]
      expect(inbound.path).to.equal('../tully/catelyn')
      expect(inbound.newPath).to.equal('../../tully/catelyn')
    })
    it('fixes the outbound require', () => {
      const files = changedRequiresByFile(moveJob('tully/', '/../tully')).sort(
        sortByFrom
      )
      expect(files[1].requires.length).to.equal(1)
      const outbound = files[1].requires[0]
      expect(outbound.path).to.equal('../stark/eddard')
      expect(outbound.newPath).to.equal('../examples/stark/eddard')
    })
  })
})
