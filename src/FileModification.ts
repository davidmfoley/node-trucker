import { ChangedImport } from './findChangedImports'

export interface FileModification {
  from: string
  to: string
  requires: ChangedImport[]
}
