import { describe, it } from 'mocha'
import { expect } from 'chai'
import decorateImport from './decorateImport'

describe('decorateRequire', () => {
  it('uses require.resolve location if found', function () {
    const result = decorateImport({} as any, () => 'src/example.js')(
      {
        filetype: '',
        fullPath: '/src',
      },
      {
        relativePath: './example',
      } as any
    )

    expect(result.filePath).to.eq('src/example.js')
  })

  it('finds a file with matching name', function () {
    const filePath = '/src/example.js'

    const result = decorateImport(
      {
        existsSync: (p) => p === filePath,
        statSync: (p) => ({ isFile: () => p === filePath }),
      } as any,
      () => null
    )(
      {
        fullPath: '/src/index.js',
      } as any,
      {
        relativePath: './example',
      } as any
    )

    expect(result.filePath).to.eq('/src/example.js')
  })

  it('finds an index file with matching name', function () {
    const filePath = '/src/example/index.tsx'

    const result = decorateImport(
      {
        existsSync: (p) => p === filePath,
        statSync: (p) => ({ isFile: () => p === filePath }),
      } as any,
      () => null
    )(
      {
        fullPath: '/src/index.js',
      } as any,
      {
        relativePath: './example',
      } as any
    )

    expect(result.filePath).to.eq('/src/example/index.tsx')
  })

  it('tries all the extensions in order if require resolve fails', function () {
    const existsArgs = []
    const result = decorateImport(
      {
        existsSync: (a) => {
          existsArgs.push(a)
          return false
        },
        statSync: () => ({ isFile: () => false }),
      } as any,
      () => null
    )(
      {
        fullPath: '/src',
      } as any,
      {
        relativePath: './example',
      } as any
    )

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    expect(result).to.be.undefined

    expect(existsArgs).to.eql([
      '/example',
      '/example.js',
      '/example.jsx',
      '/example.mjs',
      '/example.ts',
      '/example.tsx',
      '/example.coffee',
      '/example/index.js',
      '/example/index.jsx',
      '/example/index.mjs',
      '/example/index.ts',
      '/example/index.tsx',
      '/example/index.coffee',
    ])
  })
})
