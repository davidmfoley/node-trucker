import path from 'path'

import { describe, it } from 'mocha'
import { expect } from 'chai'
import sourceFile from '../src/sourceFile'

describe('sourceFile', () => {
  it('can identify a UTF-8 file', () => {
    const utfFilepath = path.join(__dirname, '/files/close-quote.js')
    const encoding = sourceFile.getEncoding(utfFilepath)
    expect(encoding).to.eq('utf-8')
  })
})
