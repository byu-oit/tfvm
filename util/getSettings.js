import fs from 'node:fs/promises'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { logger } from './logger.js'

let settings

export default async function () {
  const __dirname = dirname(fileURLToPath(import.meta.url))
  try {
    return JSON.parse(await fs.readFile(resolve(__dirname, './../settings.txt'), { encoding: 'utf8' }))
  } catch (e) {
    // if there is an error parsing the settings file, rewrite over it with a blank settings file.
    await fs.writeFile(resolve(__dirname, './../settings.txt'), JSON.stringify({}), 'utf8')
    return {}
  }
}
