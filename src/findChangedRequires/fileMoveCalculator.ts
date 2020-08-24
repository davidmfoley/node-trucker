import changedRequiresForSingleFile from './changedRequiresForSingleFile';
import { LocationCalculator } from './types';
import { SourceFileWithRequires } from '../analyzeFiles/types';
import { MoveInfo } from '../types';

export default (
  fileInfos: SourceFileWithRequires[],
  getNewLocation: LocationCalculator
): MoveInfo[] => {
  var files: MoveInfo[] = [];

  fileInfos.forEach(function(f) {
    var newFileLocation = getNewLocation(f.fullPath);
    var changedRequires = changedRequiresForSingleFile(f, getNewLocation);

    if (changedRequires.length || newFileLocation.isMoved) {
      files.push({
        from: f.fullPath,
        to: newFileLocation.fullPath,
        requires: changedRequires
      });
    }
  });

  return files;
};
