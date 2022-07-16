import fs from 'fs'
import jschardet from 'jschardet'

const detectBufferEncoding = (buffer: Buffer): BufferEncoding => {
  const detected = jschardet.detect(buffer) || { encoding: 'utf-8' }
  if (!detected.encoding) return 'utf-8'
  if (!Buffer.isEncoding(detected.encoding)) return 'utf-8'
  return detected.encoding.toLowerCase() as BufferEncoding
}

const getEncoding = (filePath: string): BufferEncoding => {
  const buffer = fs.readFileSync(filePath)
  return detectBufferEncoding(buffer)
}

const readContents = (filePath: string): string => {
  const buffer = fs.readFileSync(filePath)
  const detectedEncoding = detectBufferEncoding(buffer)

  try {
    return buffer.toString(detectedEncoding)
  } catch (e) {
    // this is stupid
    return buffer.toString('utf-8')
  }
}

export default {
  getEncoding,
  readContents,
  // pads with a blank element zero since line numbers start at one
  readLines: function (filePath) {
    const contents = readContents(filePath)
    return [''].concat(contents.split('\n'))
  },
  // removes blank element
  writeLines: function (filePath, lines, encoding) {
    try {
      fs.writeFileSync(filePath, lines.slice(1).join('\n'), { encoding })
    } catch (e) {
      fs.writeFileSync(filePath, lines.slice(1).join('\n'), {
        encoding: 'utf-8',
      })
    }
  },
}
