'use strict';

let path = require('path');
let fileLocationCalculator = require('../lib/findChangedRequires/fileLocationCalculator');
let examplePath = path.normalize(path.join(__dirname, '../examples'));
let starkPath = path.join(examplePath, '/stark');
let tullyPath = path.join(examplePath, '/tully');
let deceasedPath = path.join(examplePath, '/deceased');
let calc = null;

let whenLocationsAre = (froms, to) => {
  if (!Array.isArray(froms)) froms = [froms];
  froms = froms.map((f) => path.join(examplePath, f));
  calc = fileLocationCalculator(froms, path.join(examplePath, to));
}

let expectMove = (from, toPath, toRequire) => {
  let newLoc = calc(path.join(examplePath, from));
  expect(newLoc.isMoved).to.equal(true);
  expect(newLoc.fullPath).to.equal(path.join(examplePath, toPath));
  if (toRequire) {
    expect(newLoc.requirePath).to.equal(path.join(examplePath, toRequire));
  }
}

let expectNoMove = (from) => {
  let newLoc = calc(path.join(examplePath, from));
  expect(newLoc.isMoved).to.equal( false );
}

describe('FileLocationCalculator', ()=> {
  describe('moving a file with explicit "to"', ()=> {
    before( ()=> {
      whenLocationsAre('stark/eddard.js', 'stark/ned.js');
    });

    it('returns new location for the file being moved', ()=> {
      expectMove('stark/eddard.js', 'stark/ned.js');
    });

    it('returns unmoved location for another file', ()=> {
      expectNoMove('/catelyn.js');
    });
  });

  describe('moving a file with a directory as "to"', ()=> {
    it('returns new location for the file being moved', ()=> {
      whenLocationsAre('stark/eddard.js', 'deceased/');
      expectMove('stark/eddard.js', 'deceased/eddard.js');
    });

    it('returns new location for the file being moved', ()=> {
      whenLocationsAre('stark/eddard.js', 'deceased');
      expectMove('stark/eddard.js', 'deceased/eddard.js');
    });
  });

  describe('moving a directory', ()=> {
    it('returns new location for a file being moved', ()=> {
      whenLocationsAre('stark', 'deceased');
      expectMove('stark/eddard.js', 'deceased/eddard.js', 'deceased/eddard');
    });

    it('returns new location for a file being moved, handling trailing slash', ()=> {
      whenLocationsAre('stark/', 'deceased');
      expectMove('stark/eddard.js', 'deceased/eddard.js', 'deceased/eddard');
    });
  });

  describe('moving a directory into another directory', ()=> {
    it('returns new location for a file being moved', ()=> {
      whenLocationsAre('stark', 'deceased/');
      expectMove('stark/eddard.js', 'deceased/eddard.js', 'deceased/eddard');
    });
  });

  describe('moving multiple files', ()=> {
    before( () => {
      whenLocationsAre(['stark/eddard.js', 'stark/robb.coffee'], 'deceased/');
    });

    it('returns new location for eddard', ()=> {
      expectMove('stark/eddard.js', 'deceased/eddard.js', 'deceased/eddard');
    });

    it('returns new location for robb', ()=> {
      expectMove('stark/robb.coffee', 'deceased/robb.coffee', 'deceased/robb');
    });

    it('throws if multiple froms and to is a file', ()=> {
      expect(() => {
        fileLocationCalculator([path.join(starkPath, '/eddard.js'), path.join(starkPath, '/robb.coffee')], path.join(starkPath,'/eddard.js'));
      }).to.throw(Error);
    });
  });
});
