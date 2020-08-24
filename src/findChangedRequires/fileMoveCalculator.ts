import changedRequiresForSingleFile from './changedRequiresForSingleFile';
import { MoveInfo } from './types';

export default function(fileInfos, getNewLocation) {
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
