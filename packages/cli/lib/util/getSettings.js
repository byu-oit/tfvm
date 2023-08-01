import fs from 'node:fs/promises'
import { logger } from './logger.js'
import { TfvmFS } from './getDirectoriesObj.js'

let settings

// This should be updated to create new settings
export const defaultSettings = {
  disableErrors: false,
  disableAWSWarnings: false,
  disableSettingPrompts: false
}

/**
 * Returns an object, parsed from settings.json
 * @returns {Promise<Record<string, boolean>>}
 */
export default async function () {
  if (!settings) {
    // store settings in AppData so that they are maintained when switching node versions
    const settingsFilePath = TfvmFS.settingsDir
    try {
      settings = JSON.parse(await fs.readFile(settingsFilePath, { encoding: 'utf8' }))
      logger.trace(settings, 'Settings: ')
      return settings
    } catch (e) {
      // if there is an error parsing the settings file, rewrite over it with a blank settings file.
      logger.warn('Error finding settings file, creating one now...')
      await fs.writeFile(settingsFilePath, JSON.stringify(defaultSettings), 'utf8')
      return defaultSettings
    }
  }
  return settings
}
