import path from 'path'

export const applyAliasMapping = (
  mapping: { alias: string; destination: string },
  absolutePath: string
) => {
  const relativePathFromAliasToTarget = path.relative(
    mapping.destination.replace('*', ''),
    absolutePath
  )
  if (relativePathFromAliasToTarget.startsWith('..')) {
    return {
      result: 'no-match',
      path: absolutePath,
    }
  }
  return {
    result: 'match',
    path: path.join(
      mapping.alias.replace('*', ''),
      relativePathFromAliasToTarget
    ),
  }
}
