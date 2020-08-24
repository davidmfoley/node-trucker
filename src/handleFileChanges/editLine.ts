export default function editLine(contents, edits) {
  if (!edits || edits.length === 0) {
    return contents
  }
  var output = ''
  var position = 0

  edits.forEach(function (edit) {
    var index = edit.loc.start - 1
    output += contents.substring(position, index)
    output += edit.newPath
    position = index + edit.loc.length
  })
  output += contents.substring(position)

  return output
}
