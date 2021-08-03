import { TsConfig } from './tsConfig'

export type PathMapper = (path: string) => { path: string }

export const getPathMapper = ({ paths }: TsConfig): PathMapper => {
  return (path: string) => {
    const pathKeys = Object.keys(paths)

    for (const alias of pathKeys) {
    }

    return { path }
  }
}
