import nodeFs from 'fs'
import path from 'path'
import ts from 'typescript'
import { TruckerJob } from '../../../TruckerJob'

export type TsConfigPaths = { [key: string]: string[] }

export interface TsConfig {
  // absolute paths!
  paths: TsConfigPaths
}

type TsConfigJob = Pick<TruckerJob, 'tsconfigPath' | 'base'>

const getCandidatePaths = (dir: string) => {
  const candidates = [] as string[]
  if (!dir) return candidates
  while (typeof dir === 'string') {
    candidates.push(path.join(dir, 'tsconfig.json'))
    const nextDir = path.join(dir, '..')
    if (dir === nextDir) return candidates
    dir = nextDir
  }
}

type ReadConfigFile = typeof ts['readConfigFile']

const parsePaths = (
  tsconfigPath: string,
  configPaths: undefined | Record<string, unknown>
): TsConfigPaths => {
  const paths = {} as TsConfigPaths
  const dirname = path.dirname(tsconfigPath)
  Object.entries(configPaths || {}).forEach(([alias, res]) => {
    if (Array.isArray(res)) {
      paths[alias] = res.map((r) => path.resolve(dirname, r))
    }
  })

  return paths
}

const buildConfig = (
  tsconfigPath: string,
  readConfigFile: ReadConfigFile
): TsConfig => {
  const { error, config } = readConfigFile(tsconfigPath, ts.sys.readFile)
  if (error)
    throw new Error(`Error reading ${tsconfigPath}: ${error.messageText}`)

  return {
    paths: parsePaths(tsconfigPath, config.compilerOptions?.paths),
  }
}

export const getTsConfig = (
  { tsconfigPath, base }: TsConfigJob,
  existsSync = nodeFs.existsSync,
  readConfigFile = ts.readConfigFile
): TsConfig => {
  if (!tsconfigPath) {
    const possiblePaths = getCandidatePaths(base)

    tsconfigPath = possiblePaths.find(existsSync)
  } else {
    tsconfigPath = path.resolve(base, tsconfigPath)
  }

  if (!tsconfigPath) {
    return {
      paths: {},
    }
  }

  return buildConfig(tsconfigPath, readConfigFile)
}
