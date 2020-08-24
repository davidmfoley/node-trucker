import excludedPathFilter from './excludedPathFilter';
import { SourceFile } from './types';

export default (ignoreBase: string, ignorePatterns: string[], files: SourceFile[]) => {
  var filter = excludedPathFilter(ignoreBase, ignorePatterns);
  return files.filter(function(fileInfo) {
    return filter(fileInfo.fullPath);
  });
};
