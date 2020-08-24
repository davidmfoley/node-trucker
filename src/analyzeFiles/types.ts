export interface RequireLocation {
  line: number;
  start: number;
  length: number;
}
export interface RequireInfo {
  path: string;
  loc: RequireLocation;
}

export type FileRequireInfo = RequireInfo & {
  fullPath: string
  filePath: string
}
