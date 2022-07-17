import { ChangedRequire } from './findChangedRequires'

export interface FileModification {
  from: string
  to: string
  requires: ChangedRequire[]
}
