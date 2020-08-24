export interface ChangedRequire {
  filePath: string
  newPath: string,
  loc: Location,
  path: string
}

export interface MoveInfo {
  from: string;
  to: string;
  requires: ChangedRequire[]
}

export interface FileAction {
  isMoved: boolean;
  fullPath: string;
  requirePath: string;
}

export type LocationCalculator = (fullPath: string) => FileAction
