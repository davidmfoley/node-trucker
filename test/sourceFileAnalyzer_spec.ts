import { describe, before, it } from 'mocha'
import { expect } from 'chai'
import path from 'path'
import sourceFileAnalyzer, {
  SourceFileAnalyzer,
} from '../src/analyzeFiles/sourceFileAnalyzer'
import { FileRequireInfo } from '../src/types'

const examplePath = path.normalize(path.join(__dirname, '../examples'))

describe('sourceFileAnalyzer', () => {
  let requires: FileRequireInfo[]
  let result: ReturnType<SourceFileAnalyzer>

  describe('analyzing a sourcefile', () => {
    before(() => {
      result = sourceFileAnalyzer({} as any)({
        fullPath: path.join(examplePath, 'stark/eddard.js'),
        filetype: 'js',
      })
      requires = result.requires.sort((a, b) =>
        a.fullPath > b.fullPath ? 1 : -1
      )
    })
    it('has requires', () => {
      expect(requires.length).to.equal(2)
    })
    it('decorates require in a different location with full path', () => {
      const expected = path.normalize(path.join(examplePath, 'tully/catelyn'))
      expect(requires[1].fullPath).to.equal(expected)
    })
    it('decorates require in the same location with full path', () => {
      const expected = path.normalize(path.join(examplePath, 'stark/robb'))
      expect(requires[0].fullPath).to.equal(expected)
    })
  })
})
