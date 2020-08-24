import { SourceFile } from '../types'

export interface RequireLocation {
  line: number
  start: number
  length: number
}
export interface RequireInfo {
  path: string
  loc: RequireLocation
}

export type FileRequireInfo = RequireInfo & {
  fullPath: string
  filePath: string
}

export type SourceFileWithRequires = SourceFile & {
  requires: FileRequireInfo[]
}
