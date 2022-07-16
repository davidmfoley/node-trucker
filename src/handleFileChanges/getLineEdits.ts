export default function getLineEdits(requires) {
  const byLine = {}
  requires.forEach(function (r) {
    const line = r.loc.line
    byLine[line] = byLine[line] || []
    byLine[line].push(r)
    byLine[line] = byLine[line].sort(function (a, b) {
      return a.loc.start > b.loc.start
    })
  })
  return byLine
}
