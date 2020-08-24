import sourceFile from '../handleFileChanges/sourceFile';
import findRequires from './findRequires';
import DecorateRequire from './decorateRequire';
import { FileRequireInfo, RequireInfo } from './types';

const decorateRequire = DecorateRequire();

interface SourceFile {
  fullPath: string,
  filetype: string
}

type SourceFileWithRequires = SourceFile & {
  requires: FileRequireInfo[]
}

export default (fileInfo: SourceFile): SourceFileWithRequires => {
  var contents = sourceFile.readContents(fileInfo.fullPath);

  let requires: RequireInfo[] = []

  try {
    requires = findRequires(fileInfo.filetype, contents, fileInfo.fullPath);
  }
  catch(err) {
    printAnalyzeError(fileInfo, err);
  }

  return {
    fullPath: fileInfo.fullPath,
    filetype: fileInfo.filetype,
    requires: requires.map(decorate).filter(function(r) { return !!r; })
  };

  function decorate(require) {
    return decorateRequire(fileInfo, require);
  }
};

function printAnalyzeError(fileInfo: SourceFile, err: Error) {
  console.warn('');
  console.warn('error processing ' + fileInfo.fullPath);
  console.warn(err);
  var stack = err.stack || '';
  console.warn(stack.split('\n')[1]);
}

