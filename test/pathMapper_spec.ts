import { describe, test } from 'mocha'
import { expect } from 'chai'
import { getPathMapper } from '../src/analyzeFiles/findRequires/typescript/pathMapper'

describe('pathMapper', () => {
  test('no mappings', () => {
    const result = getPathMapper({ paths: {} })('../foo')
    expect(result.path).to.eq('../foo')
  })
})
