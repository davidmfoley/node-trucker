import { describe, test } from 'mocha'
import { expect } from 'chai'

import { getPathMapper } from '../src/analyzeFiles/findRequires/typescript/pathMapper'

describe('pathMapper', () => {
  test('unmapped path', () => {
    const mapper = getPathMapper({
      paths: {},
    })
    const result = mapper({
      importPath: '../foo',
      filePath: '/example/base/whatever.ts',
    })
    expect(result.relativePath).to.eq('../foo')
    expect(result.kind).to.eq('relative')
    expect(result.text).to.eq('../foo')
  })

  test('mapped path that is above file path', () => {
    const mapper = getPathMapper({
      paths: {
        '~/foo/*': ['/example/base/src/foo/*'],
      },
    })
    const result = mapper({
      importPath: '~/foo/bar',
      filePath: '/example/base/src/wherever/whatever.ts',
    })

    expect(result.relativePath).to.eq('../foo/bar')
    expect(result.kind).to.eq('alias')
    expect(result.text).to.eq('~/foo/bar')
  })

  test('mapped path that is adjacent', () => {
    const mapper = getPathMapper({
      paths: {
        '~/foo/*': ['/example/base/src/foo/*'],
      },
    })
    const result = mapper({
      importPath: '~/foo/bar',
      filePath: '/example/base/src/whatever.ts',
    })

    expect(result.relativePath).to.eq('./foo/bar')
    expect(result.kind).to.eq('alias')
    expect(result.text).to.eq('~/foo/bar')
  })

  test('map to deeper path', () => {
    const mapper = getPathMapper({
      paths: {
        '~/*': ['/some/place/globals/*'],
      },
    })

    const result = mapper({
      importPath: '~/foo/bar',
      filePath: '/some/place/whatever.ts',
    })

    expect(result.relativePath).to.eq('./globals/foo/bar')
    expect(result.kind).to.eq('alias')
    expect(result.text).to.eq('~/foo/bar')
  })
})
