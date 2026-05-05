export interface FileAction {
  isMoved: boolean
  basenameChanged: boolean
  dirnameChanged: boolean
  fullPath: string
  requirePath: string
}

export type LocationCalculator = (fullPath: string) => FileAction
