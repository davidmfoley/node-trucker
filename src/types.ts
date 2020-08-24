export interface TruckerJob {
  quiet?: boolean
  ignore?: { base: string,  patterns?: string [] },
  base: string
}

export type TruckerMoveJob = TruckerJob & {
  from: string[],
  to: string
}

export interface SourceFile {
  fullPath: string,
  filetype: string
}
