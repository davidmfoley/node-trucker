import path from 'path'
import { FileModification } from '../FileModification'
export default function (changes: FileModification[]) {
  const fileMoves = changes.filter(isMove)
  const byDest = {}

  fileMoves.forEach(function (m) {
    byDest[m.to] = byDest[m.to] || []
    byDest[m.to].push(m.from)
  })

  const conflicts = Object.keys(byDest).filter(function (dest) {
    return byDest[dest].length > 1
  })

  return conflicts.map(function (dest) {
    return message(dest, byDest[dest])
  })

  function message(destination, sources) {
    return (
      'multiple files would be moved to ' +
      relativePath(destination) +
      ': ' +
      sources.map(relativePath).join(', ')
    )
  }

  function relativePath(f) {
    return path.relative(process.cwd(), f)
  }
}

function isMove(change: FileModification) {
  return change.from !== change.to
}
