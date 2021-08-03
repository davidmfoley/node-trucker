export type TsConfigPaths = { [key: string]: string[] }

export interface TsConfig {
  paths: TsConfigPaths
}

export const getTsConfig = (tsconfigPath: string | undefined) =>
  ({
    paths: {},
  } as TsConfig)
