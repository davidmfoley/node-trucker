export interface TruckerJob {
  quiet?: boolean
  ignore?: { base: string; patterns?: string[] }
  base: string
  moves: {
    from: string[]
    to: string
  }[]
  files: string[]
  dryRun: boolean
  info: boolean
  unused: boolean
  format: string
  tsconfigPath?: string
}

export type TruckerMoveJob = TruckerJob
