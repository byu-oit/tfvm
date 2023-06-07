import fs from 'node:fs/promises'
import { logger } from './logger.js'
import { settingsFileName } from './constants.js'
import getDirectoriesObj from './getDirectoriesObj.js'

let settings

export default async function () {
  if (settings) return settings
  else {
    // store settings in AppData so that they are maintained when switching node versions
    const settingsFilePath = `${getDirectoriesObj().tfvmDir}\\${settingsFileName}`
    try {
      settings = JSON.parse(await fs.readFile(settingsFilePath, { encoding: 'utf8' }))
      logger.trace(settings, 'Settings: ')
      return settings
    } catch (e) {
      // if there is an error parsing the settings file, rewrite over it with a blank settings file.
      logger.warn('Error finding settings file, creating one now...')
      await fs.writeFile(settingsFilePath, JSON.stringify({}), 'utf8')
      return {}
    }
  }
}
