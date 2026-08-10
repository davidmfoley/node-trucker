export interface FileAction {
  isMoved: boolean
  basenameChanged: boolean
  dirnameChanged: boolean
  fullPath: string
  importPath: string
}

export type LocationCalculator = (fullPath: string) => FileAction
