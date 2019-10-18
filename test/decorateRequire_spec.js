'use strict';
let expect = require('chai').expect;
let decorateRequire = require('../lib/analyzeFiles/decorateRequire');

describe('decorateRequire', () => {
  it('uses require.resolve location if found', function() {
    var result = decorateRequire(
      {},
      () => 'src/example.js'
    )({
      fullPath: '/src',
    }, {
      path: './example',
    });

    expect(result.filePath).to.eq('src/example.js');
  });

  it('tries all the extensions in order if require resolve fails', function() {
    let existsArgs = [];
    var result = decorateRequire(
      {
        existsSync: a => { existsArgs.push(a); return false; },
        statSync: () => ({ isFile: () => false })
      },
      () => null
    )({
      fullPath: '/src',
    }, {
      path: './example',
    });

    expect(result).to.be.undefined();

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
    ]);
  });
});
