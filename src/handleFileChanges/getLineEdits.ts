import { ChangedImport } from '../findChangedImports'

export default function getLineEdits(requires: ChangedImport[]) {
  const byLine = {} as Record<number, ChangedImport[]>
  requires.forEach(function (r) {
    const line = r.loc.line
    byLine[line] = byLine[line] || []
    byLine[line].push(r)
    byLine[line] = byLine[line].sort((a, b) => a.loc.start - b.loc.start)
  })
  return byLine
}
