'use strict';
let expect = require('chai').expect;

let findRequires = require('../lib/analyzeFiles/findRequires');

describe('RequireFinder', () =>  {
  describe('with typescript', () =>  {

    it('handles basic import', () => {
      const code = `import { Foo } from './example';`;

      const requires = findRequires('ts', code, 'foo.ts');
      expect(requires.length).to.eql(1);
      expect(requires[0].path).to.equal('./example');
      expect(requires[0].loc.line).to.equal(1);
      expect(requires[0].loc.start).to.equal(22);
      expect(requires[0].loc.length).to.equal(9);
    });

    it('sets location correctly', () =>  {
      const code = "import * as foo from './foo'";
      const requires = findRequires('ts', code, 'example.ts');
      const req = requires[0];
      expect(req.loc.line).to.equal(1);
      expect(req.loc.start).to.equal(23);
      expect(req.loc.length).to.equal(5);
    });

    it('handles * import', () => {
      const code = `import * as foo from './path/with/separators';`;

      const requires = findRequires('ts', code, 'foo.ts');
      expect(requires.length).to.eql(1);
      expect(requires[0].path).to.equal('./path/with/separators');
      expect(requires[0].loc.line).to.equal(1);
      expect(requires[0].loc.start).to.equal(23);
      expect(requires[0].loc.length).to.equal(22);
    });
    it('handles import on multiple lines', () => {
      const code = `import {
  Foo,
  Bar
} from './path/with/separators';`;

      const requires = findRequires('ts', code, 'foo.ts');
      expect(requires.length).to.eql(1);
      expect(requires[0].path).to.equal('./path/with/separators');
      expect(requires[0].loc.line).to.equal(4);
      expect(requires[0].loc.start).to.equal(9);
      expect(requires[0].loc.length).to.equal(22);
    });
  });
});
