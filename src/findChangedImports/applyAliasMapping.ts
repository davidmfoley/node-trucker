import path from 'path'

export const applyAliasMapping = (
  mapping: { alias: string; destination: string },
  relativePath: string
) => {
  const relativePathFromAliasToTarget = path.relative(
    mapping.destination,
    relativePath
  )
  if (relativePathFromAliasToTarget.startsWith('..')) {
    return {
      result: 'no-match',
      path: relativePath,
    }
  }
  return {
    result: 'match',
    path: path.join(mapping.alias, relativePathFromAliasToTarget),
  }
}
