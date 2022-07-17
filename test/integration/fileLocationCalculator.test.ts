import { describe, before, it } from 'mocha'
import { expect } from 'chai'

import path from 'path'
import fileLocationCalculator from '../../src/findChangedRequires/fileLocationCalculator'
import { LocationCalculator } from '../../src/findChangedRequires/types'
import { examplesPath } from './examplesPath'

describe('FileLocationCalculator', () => {
  describe('integration tests', () => {
    const starkPath = path.join(examplesPath, '/stark')
    let calc: LocationCalculator

    const testPath = (p: string) => path.join(examplesPath, p)

    const whenLocationsAre = (froms: string | string[], to: string) => {
      const asArray = !Array.isArray(froms) ? [froms] : froms
      const from = asArray.map((f) => path.join(examplesPath, f))
      calc = fileLocationCalculator([{ from, to: path.join(examplesPath, to) }])
    }

    const expectMove = (from: string, toPath: string, toRequire?: string) => {
      const newLoc = calc(path.join(examplesPath, from))
      expect(newLoc.isMoved).to.equal(true)
      expect(newLoc.fullPath).to.equal(path.join(examplesPath, toPath))
      if (toRequire) {
        expect(newLoc.requirePath).to.equal(path.join(examplesPath, toRequire))
      }
    }

    const expectNoMove = (from) => {
      const newLoc = calc(path.join(examplesPath, from))
      expect(newLoc.isMoved).to.equal(false)
    }
    describe('moving a file with explicit "to"', () => {
      before(() => {
        whenLocationsAre('stark/eddard.js', 'stark/ned.js')
      })

      it('returns new location for the file being moved', () => {
        expectMove('stark/eddard.js', 'stark/ned.js')
      })

      it('returns unmoved location for another file', () => {
        expectNoMove('/catelyn.js')
      })
    })

    describe('moving multiple files with explicit "to"', () => {
      before(() => {
        calc = fileLocationCalculator([
          {
            from: [testPath('stark/eddard.js')],
            to: testPath('deceased/ned.js'),
          },
          {
            from: [testPath('stark/catelyn.js')],
            to: testPath('deceased/catelyn.js'),
          },
        ])
      })

      it('returns new location for the first move file being moved', () => {
        expectMove('stark/eddard.js', 'deceased/ned.js')
      })

      it('returns new location for the second move file being moved', () => {
        expectMove('stark/catelyn.js', 'deceased/catelyn.js')
      })

      it('returns unmoved location for another file', () => {
        expectNoMove('/someOther.js')
      })
    })

    describe('moving a file with a directory as "to"', () => {
      it('returns new location for the file being moved', () => {
        whenLocationsAre('stark/eddard.js', 'deceased/')
        expectMove('stark/eddard.js', 'deceased/eddard.js')
      })

      it('returns new location for the file being moved', () => {
        whenLocationsAre('stark/eddard.js', 'deceased')
        expectMove('stark/eddard.js', 'deceased/eddard.js')
      })
    })

    describe('moving a directory', () => {
      it('returns new location for a file being moved', () => {
        whenLocationsAre('stark', 'deceased')
        expectMove('stark/eddard.js', 'deceased/eddard.js', 'deceased/eddard')
      })

      it('returns new location for a file being moved, handling trailing slash', () => {
        whenLocationsAre('stark/', 'deceased')
        expectMove('stark/eddard.js', 'deceased/eddard.js', 'deceased/eddard')
      })
    })

    describe('moving a directory into another directory', () => {
      it('returns new location for a file being moved', () => {
        whenLocationsAre('stark', 'deceased/')
        expectMove(
          'stark/eddard.js',
          'deceased/stark/eddard.js',
          'deceased/stark/eddard'
        )
      })
    })

    describe('moving multiple files', () => {
      before(() => {
        whenLocationsAre(['stark/eddard.js', 'stark/robb.coffee'], 'deceased/')
      })

      it('returns new location for eddard', () => {
        expectMove('stark/eddard.js', 'deceased/eddard.js', 'deceased/eddard')
      })

      it('returns new location for robb', () => {
        expectMove('stark/robb.coffee', 'deceased/robb.coffee', 'deceased/robb')
      })

      it('throws if multiple froms and to is a file', () => {
        expect(() => {
          fileLocationCalculator([
            {
              from: [
                path.join(starkPath, '/eddard.js'),
                path.join(starkPath, '/robb.coffee'),
              ],
              to: path.join(starkPath, '/eddard.js'),
            },
          ])
        }).to.throw(Error)
      })
    })
  })
})
