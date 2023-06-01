import fs from 'node:fs/promises'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { logger } from './logger.js'

let settings

export default async function () {
  if (settings) return settings
  else {
    const __dirname = dirname(fileURLToPath(import.meta.url))
    try {
      settings = JSON.parse(await fs.readFile(resolve(__dirname, './../settings.txt'), { encoding: 'utf8' }))
      logger.trace(settings, 'Settings: ')
      return settings
    } catch (e) {
      // if there is an error parsing the settings file, rewrite over it with a blank settings file.
      logger.warn('Error finding settings file, creating one now...')
      await fs.writeFile(resolve(__dirname, './../settings.txt'), JSON.stringify({}), 'utf8')
      return {}
    }
  }
}
