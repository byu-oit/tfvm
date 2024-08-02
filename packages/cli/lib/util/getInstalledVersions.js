import fs from 'node:fs/promises'
import { versionRegEx } from './constants.js'
import { logger } from './logger.js'
import getSettings from './getSettings.js'
import { getOS } from './tfvmOS.js'
const os = getOS()

let installedVersions

/**
 * Returns a list of installed tf versions.
 * @returns {Promise<string[]>}
 */
async function getInstalledVersions () {
  const settings = await getSettings()
  // return the list of installed versions if that is already cached
  if (!installedVersions) {
    const versionsList = []
    let files
    if (settings.useOpenTofu) {
      files = await fs.readdir(os.getOtfVersionsDir())
    } else {
      files = await fs.readdir(os.getTfVersionsDir())
    }

    if (files && files.length) {
      files.forEach(file => {
        if (versionRegEx.test(file)) {
          versionsList.push(file)
        }
      })
      installedVersions = versionsList
    } else {
      if (settings.useOpenTofu) {
        logger.debug(`Unable to find installed versions of OpenTofu with directoriesObj=${JSON.stringify(os.getDirectories())} and files=${JSON.stringify(files)}`)
      } else {
        logger.debug(`Unable to find installed versions of Terraform with directoriesObj=${JSON.stringify(os.getDirectories())} and files=${JSON.stringify(files)}`)
      }
      return []
    }
  }
  return installedVersions
}
export default getInstalledVersions
