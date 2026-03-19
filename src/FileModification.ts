import { ChangedRequire } from './findChangedImports'

export interface FileModification {
  from: string
  to: string
  requires: ChangedRequire[]
}
