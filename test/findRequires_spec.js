'use strict';
let expect = require('chai').expect;

let findRequires = require('../lib/analyzeFiles/findRequires');

describe('RequireFinder', () =>  {
  describe('with es6 imports', () =>  {
    it('handles a file with no requires', () =>  {
      expect(findRequires('js', "")).to.eql([]);
    });

    it('handles a single require',  () =>  {
      const code = "import * as x from './y';";
      const requires = findRequires('js', code);
      expect(requires.length).to.eql(1);
      expect(requires[0].path).to.equal('./y');
    });

    it('ignores npm modules that are required', () =>  {
      const code = "import bar from 'bar';\nimport foo from './foo' ;\n";
      const requires = findRequires('js', code);
      expect(requires.length).to.eql(1);
      expect(requires[0].path).to.equal('./foo');
    });

    it('sets location correctly', () =>  {
      const code = "import * as foo from './foo'";
      const requires = findRequires('js', code);
      const req = requires[0];
      expect(req.loc.line).to.equal(1);
      expect(req.loc.start).to.equal(23);
      expect(req.loc.length).to.equal(5);
    });

    it('handles async functions', () =>  {
      // https://github.com/davidmfoley/node-trucker/issues/10
      const code = `
import Foo from './foo';
export const fetchLookup = query =>
  async dispatch => {
    const fetchUsers = {
      type: DD_FETCH_USERS,
      queue: DD_FETCH_USERS,
      query
    }
  }
    `;

      const requires = findRequires('js', code);
      expect(requires.length).to.eql(1);
      expect(requires[0].path).to.equal('./foo');
    });

    it('handles flow annotations', () => {
      // https://github.com/davidmfoley/node-trucker/issues/11
      const code = `
// @flow
import moduleA from './module-a'
import moduleB from './module-b'

export default (a: string): Object => moduleB(moduleA(a))
      `;
      const requires = findRequires('js', code);

      expect(requires.length).to.eql(2);
      expect(requires[0].path).to.equal('./module-a');
      expect(requires[1].path).to.equal('./module-b');
    })



  });

  describe('with javascript', () =>  {
    it('handles a file with no requires', () =>  {
      expect(findRequires('js', "")).to.eql([]);
    });

    it('handles a javascript file with a single require', () =>  {
      const code = "var foo = require( './foo' );\n";
      const requires = findRequires('js', code);
      expect(requires.length).to.eql(1);
      expect(requires[0].path).to.equal('./foo');
    });

    it('handles import in a file that babylon can\'t fully parse',  () =>  {
      const code = `import * as x from './y';
let foo;
foo = foo || () => {}; //babylon can't handle this for some reason
      `;
      const requires = findRequires('js', code);
      expect(requires.length).to.eql(1);
      expect(requires[0].path).to.equal('./y');
    });

    it('handles require in a file that babylon can\'t fully parse',  () =>  {
      const code = `const x = require('./y');
let foo;
foo = foo || () => {}; //babylon can't handle this for some reason
      `;
      const requires = findRequires('js', code);
      expect(requires.length).to.eql(1);
      expect(requires[0].path).to.equal('./y');
    });


    it('handles a shebanged javascript file', () =>  {
      const code = "#! /usr/bin/env node\nvar foo = require( './foo' );\n";
      const requires = findRequires('js', code);
      expect(requires.length).to.eql(1);
      expect(requires[0].path).to.equal('./foo');
      expect(requires[0].loc.line).to.equal(2);
    });

    it('ignores npm modules that are required', () =>  {
      const code = "var bar = require('bar');\nvar foo = require( './foo' );\n";
      const requires = findRequires('js', code);
      expect(requires.length).to.eql(1);
      expect(requires[0].path).to.equal('./foo');
    });

    it('sets location correctly', () =>  {
      const code = "var foo = require( './foo' );\n";
      const requires = findRequires('js', code);
      const req = requires[0];
      expect(req.loc.line).to.equal(1);
      expect(req.loc.start).to.equal(21);
      expect(req.loc.length).to.equal(5);
    });

  });

  describe('with coffeescript', () =>  {

    describe('assigning to a variable', () =>  {

      it('handles a file with no requires', () =>  {
        expect(findRequires('coffee', "")).to.eql([]);
      });

      it('handles a coffee file with a single require', () =>  {
        const code = "foo = require( './foo' )\n";
        const requires = findRequires('coffee', code);
        expect(requires.length).to.eql(1);
        expect(requires[0].path).to.equal('./foo');
      });

      it('ignores npm modules that are required', () =>  {
        const code = "bar = require 'bar'\nfoo = require './foo'\n";
        const requires = findRequires('coffee', code);
        expect(requires.length).to.eql(1);
        expect(requires[0].path).to.equal('./foo');
      });

      it('sets location correctly', () =>  {
        const code = "foo = require( './foo' )\n";
        const requires = findRequires('coffee', code);
        const req = requires[0];
        expect(req.loc.line).to.equal(1);
        expect(req.loc.start).to.equal(17);
        expect(req.loc.length).to.equal(5);
      });
    });

    describe('without assignment', () =>  {
      it('handles requires without left hand assignment', () =>  {
        const code = "require( './foo' )\n";
        const requires = findRequires('coffee', code);
        expect(requires.length).to.eql(1);
        expect(requires[0].path).to.equal('./foo');
      });

      it('sets location correctly', () =>  {
        const code = "\nrequire( './foo' )\n";
        const requires = findRequires('coffee', code);
        const req = requires[0];
        expect(req.loc.line).to.equal(2);
        expect(req.loc.start).to.equal(11);
        expect(req.loc.length).to.equal(5);
      });
    });
  });
});
