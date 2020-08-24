
export interface FileAction {
  isMoved: boolean;
  fullPath: string;
  requirePath: string;
}

export type LocationCalculator = (fullPath: string) => FileAction
