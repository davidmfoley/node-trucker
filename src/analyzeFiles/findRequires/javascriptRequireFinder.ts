import * as babelParser from '@babel/parser';
import requirePathFilter from './requirePathFilter';
import { RequireInfo } from './types';

type BabelToken = any

export default (contents: string, filename: string): RequireInfo[] => {
  contents = handleShebang(contents);
  try {
    return babelFinder(contents);
  }
  catch (err) {
    //fall back to stupid/fragile regex parsing
    return regexFinder(contents);
  }
};

function regexFinder(contents: string) : RequireInfo[]{
  var lines = contents.split('\n');
  var requires = [];
  var importRegex = /((import|export) (.+? from)?|require\s*\()\s*['"`]/g;
  lines.map(function(line, i) {
    var result = importRegex.exec(line);
    while (result) {
      if (!result) return;
      var location = result.index + result[0].length;
      var requirePath = line.substring(location).split(/['"`]/)[0];
      if (requirePathFilter(requirePath)) {
        requires.push({
          path: requirePath,
          loc: {
            line: i + 1,
            start: location + 1,
            length: requirePath.length
          }
        });
      }
      result = importRegex.exec(line);
    }
  });
  return requires;
}

function babelFinder(contents: string): RequireInfo[] {

  // kitchen-sink approach, since we just want to find requires/imports/etc.
  var bbl = babelParser.parse(contents, {
    sourceType: 'unambiguous',
    ranges: true,
    tokens: true,
    plugins: [
      'asyncGenerators',
    'bigInt',
    'classPrivateMethods',
    'classPrivateProperties',
    'classProperties',
    'decimal',
    'decorators-legacy',
    'doExpressions',
    'dynamicImport',
    'estree',
    'exportDefaultFrom',
    'exportNamespaceFrom',
    'flow',
    'flowComments',
    'functionBind',
    'functionSent',
    'importMeta',
    'jsx',
    'logicalAssignment',
    'nullishCoalescingOperator',
    'numericSeparator',
    'objectRestSpread',
    'optionalCatchBinding',
    'optionalChaining',
    'partialApplication',
    'placeholders',
    'privateIn',
    'throwExpressions',
    'topLevelAwait',
    ] as any
  });

  //var result = babel.transform(contents, {stage:0, filename: filename});

  //var ast = result.ast;

  var requires: RequireInfo[] = [];
  scan(bbl.tokens || [], requires);
  return requires;
}

function isFrom(token: BabelToken) {
  return token.type.label === 'name' && token.value === 'from';
}

function isString(token: BabelToken) {
  return token.type.label === 'string';
}

function scan(tokens: BabelToken[], requires: RequireInfo[]) {
  for(var i = 0; i < tokens.length; i++) {
    var token = tokens[i];
    var type = token.type;
    if (type.keyword === 'import' || type.keyword === 'export') {
      i++;

      if (!isString(tokens[i])) {
        while (tokens[i] && !isFrom(tokens[i])) { i++; }
        i++;
      }

      addIfMatch(requires, tokens[i]);
    }
    else if (type.label === 'name' && token.value === 'require') {
      while ( tokens[i] && !isString(tokens[i]) ) { i++; }
      addIfMatch(requires, tokens[i]);
    }
  }
}

function addIfMatch(requires: RequireInfo[], pathToken: BabelToken) {
  if (! (pathToken && pathToken.value)) return;
  if (!requirePathFilter(pathToken.value)) return;
  var loc = pathToken.loc;

  var req = {
    path: pathToken.value,
    loc: {
      line: loc.start.line,
      start: loc.start.column + 2,
      length: pathToken.value.length
    }
  };
  requires.push(req);
}


function handleShebang(contents: string): string {
  if (contents[0] === '#' && contents[1] === '!')
    return "//" + contents;

  return contents;
}
