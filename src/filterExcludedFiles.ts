import excludedPathFilter from './excludedPathFilter';

export default function filterExcludedFiles(ignoreBase, ignorePatterns, files) {
  var filter = excludedPathFilter(ignoreBase, ignorePatterns);
  return files.filter(function(fileInfo) {
    return filter(fileInfo.fullPath);
  });
};
