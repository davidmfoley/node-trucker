'use strict';
let expect = require('chai').expect;

let findRequires = require('../lib/analyzeFiles/findRequires');

describe('RequireFinder', function() {
  describe('with es6 imports', function() {
    it('handles a file with no requires', function() {
      expect(findRequires('js', "")).to.eql([]);
    });
    it('handles a single require', function() {
      var code, requires;
      code = "import * as x from './y';";
      requires = findRequires('js', code);
      expect(requires.length).to.eql(1);
      expect(requires[0].path).to.equal('./y');
    });
    it('ignores npm modules that are required', function() {
      var code, requires;
      code = "import bar from 'bar';\nimport foo from './foo' ;\n";
      requires = findRequires('js', code);
      expect(requires.length).to.eql(1);
      expect(requires[0].path).to.equal('./foo');
    });
    it('sets location correctly', function() {
      var code, req, requires;
      code = "import * as foo from './foo'";
      requires = findRequires('js', code);
      req = requires[0];
      expect(req.loc.line).to.equal(1);
      expect(req.loc.start).to.equal(23);
      expect(req.loc.length).to.equal(5);
    });
  });
  describe('with javascript', function() {
    it('handles a file with no requires', function() {
      expect(findRequires('js', "")).to.eql([]);
    });
    it('handles a javascript file with a single require', function() {
      var code, requires;
      code = "var foo = require( './foo' );\n";
      requires = findRequires('js', code);
      expect(requires.length).to.eql(1);
      expect(requires[0].path).to.equal('./foo');
    });
    it('handles a shebanged javascript file', function() {
      var code, requires;
      code = "#! /usr/bin/env node\nvar foo = require( './foo' );\n";
      requires = findRequires('js', code);
      expect(requires.length).to.eql(1);
      expect(requires[0].path).to.equal('./foo');
      expect(requires[0].loc.line).to.equal(2);
    });
    it('ignores npm modules that are required', function() {
      var code, requires;
      code = "var bar = require('bar');\nvar foo = require( './foo' );\n";
      requires = findRequires('js', code);
      expect(requires.length).to.eql(1);
      expect(requires[0].path).to.equal('./foo');
    });
    it('sets location correctly', function() {
      var code, req, requires;
      code = "var foo = require( './foo' );\n";
      requires = findRequires('js', code);
      req = requires[0];
      expect(req.loc.line).to.equal(1);
      expect(req.loc.start).to.equal(21);
      expect(req.loc.length).to.equal(5);
    });
  });
  describe('with coffeescript', function() {
    describe('assigning to a variable', function() {
      it('handles a file with no requires', function() {
        expect(findRequires('coffee', "")).to.eql([]);
      });
      it('handles a coffee file with a single require', function() {
        var code, requires;
        code = "foo = require( './foo' )\n";
        requires = findRequires('coffee', code);
        expect(requires.length).to.eql(1);
        expect(requires[0].path).to.equal('./foo');
      });
      it('ignores npm modules that are required', function() {
        var code, requires;
        code = "bar = require 'bar'\nfoo = require './foo'\n";
        requires = findRequires('coffee', code);
        expect(requires.length).to.eql(1);
        expect(requires[0].path).to.equal('./foo');
      });
      it('sets location correctly', function() {
        var code, req, requires;
        code = "foo = require( './foo' )\n";
        requires = findRequires('coffee', code);
        req = requires[0];
        expect(req.loc.line).to.equal(1);
        expect(req.loc.start).to.equal(17);
        expect(req.loc.length).to.equal(5);
      });
    });
    describe('without assignment', function() {
      it('handles requires without left hand assignment', function() {
        var code, requires;
        code = "require( './foo' )\n";
        requires = findRequires('coffee', code);
        expect(requires.length).to.eql(1);
        expect(requires[0].path).to.equal('./foo');
      });
      it('sets location correctly', function() {
        var code, req, requires;
        code = "\nrequire( './foo' )\n";
        requires = findRequires('coffee', code);
        req = requires[0];
        expect(req.loc.line).to.equal(2);
        expect(req.loc.start).to.equal(11);
        expect(req.loc.length).to.equal(5);
      });
    });
  });
});
