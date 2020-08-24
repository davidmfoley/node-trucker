import javascript from './javascriptRequireFinder';
import typescript from './typescriptRequireFinder';
import coffee from './coffeescriptRequireFinder';

var parsers = {
  js: javascript,
  mjs: javascript,
  jsx: javascript,
  ts: typescript,
  tsx: typescript,
  coffee
};

export default function(filetype, contents, filename) {
  return parsers[filetype](contents, filename);
};
