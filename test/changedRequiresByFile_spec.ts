import { describe, before, it } from 'mocha'
import { expect } from 'chai'

import changedRequiresByFile from '../src/findChangedRequires'

import path from 'path'
import { FileModification } from '../src/FileModification'

const examplePath = path.normalize(path.join(__dirname, '../examples/'))

function p(subPath: string) {
  return path.normalize(path.join(examplePath, subPath))
}

function job(from: string, to: string) {
  return {
    moves: [
      {
        from: [p(from)],
        to: p(to),
      },
    ],
    base: examplePath,
  } as any
}

const sortByFrom = (a: FileModification, b: FileModification) =>
  a.from > b.from ? 1 : -1

describe('changedRequiresByFile', function () {
  let files: FileModification[]

  describe('moving a file', function () {
    before(function () {
      files = changedRequiresByFile(job('stark/robb.coffee', 'deceased/'))
      files = files.sort(sortByFrom)
    })
    it('has the correct fixes', function () {
      expect(files.length).to.equal(3)
    })
    it('fixes the outbound require in the file', function () {
      expect(files[1].requires.length).to.equal(1)
      const outbound = files[1].requires[0]
      expect(outbound.path).to.equal('./eddard')
      expect(outbound.newPath).to.equal('../stark/eddard')
    })
    it('fixes the inbound require in a referencing file', function () {
      expect(files[0].requires.length).to.equal(1)
      const inbound = files[0].requires[0]
      expect(inbound.path).to.equal('./robb')
      expect(inbound.newPath).to.equal('../deceased/robb')
    })
    it('keeps the extension in a referencing file', function () {
      expect(files[2].requires.length).to.equal(1)
      const inbound = files[2].requires[0]
      expect(inbound.path).to.equal('./robb.coffee')
      expect(inbound.newPath).to.equal('../deceased/robb.coffee')
    })
  })

  describe('moving a directory', function () {
    before(function () {
      files = changedRequiresByFile(job('tully/', 'deceased'))
      files = files.sort(sortByFrom)
    })
    it('fixes the inbound require in a referencing file', function () {
      expect(files.length).to.equal(2)
      expect(files[0].requires.length).to.equal(1)

      const inbound = files[0].requires[0]
      expect(inbound.path).to.equal('../tully/catelyn')
      expect(inbound.newPath).to.equal('../deceased/catelyn')
    })
    it('includes the file that is moving', function () {
      expect(files.length).to.equal(2)
      expect(files[1].requires.length).to.equal(0)
    })
  })
  describe('moving a directory outside the base', function () {
    before(function () {
      files = changedRequiresByFile(job('tully/', '/../tully'))
      files = files.sort(sortByFrom)
    })
    it('fixes the inbound require in a referencing file', function () {
      expect(files[0].requires.length).to.equal(1)
      const inbound = files[0].requires[0]
      expect(inbound.path).to.equal('../tully/catelyn')
      expect(inbound.newPath).to.equal('../../tully/catelyn')
    })
    it('fixes the outbound require', function () {
      expect(files[1].requires.length).to.equal(1)
      const outbound = files[1].requires[0]
      expect(outbound.path).to.equal('../stark/eddard')
      expect(outbound.newPath).to.equal('../examples/stark/eddard')
    })
  })
})
