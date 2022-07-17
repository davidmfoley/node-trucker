import { describe, test, beforeEach } from 'mocha'
import { expect } from 'chai'
import { getTsConfig } from './tsConfig'

describe('tsconfig parsing', () => {
  let paths: string[]
  let fileContents: { [name: string]: any }

  const existsSync = (path: string) => {
    paths.push(path)
    return !!fileContents[path]
  }

  const readConfigFile = ((path: string) => {
    const content = fileContents[path]
    if (!content) throw new Error('file not found')
    return content
  }) as any

  beforeEach(() => {
    paths = []
    fileContents = {}
  })

  test('can parse path with explicit tsconfig', () => {
    fileContents['/example/tsconfig.json'] = {
      config: {
        compilerOptions: {
          paths: {
            '~/thing/*': ['./the/thing/*'],
          },
        },
      },
    }

    const config = getTsConfig(
      { base: '/foo/bar/baz', tsconfigPath: '/example/tsconfig.json' },
      existsSync,
      readConfigFile
    )
    expect(config.paths).to.eql({
      '~/thing/*': ['/example/the/thing/*'],
    })
  })

  test('without explicit setting goes up the dir tree', () => {
    getTsConfig({ base: '/foo/bar/baz' }, existsSync)

    expect(paths).to.eql([
      '/foo/bar/baz/tsconfig.json',
      '/foo/bar/tsconfig.json',
      '/foo/tsconfig.json',
      '/tsconfig.json',
    ])
  })
})
