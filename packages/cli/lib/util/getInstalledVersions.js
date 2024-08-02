import fs from 'node:fs/promises'
import { versionRegEx } from './constants.js'
import { TfvmFS } from './getDirectoriesObj.js'
import { logger } from './logger.js'
import getSettings from './getSettings.js'

let installedVersions

/**
 * Returns a list of installed tf versions.
 * @returns {Promise<string[]>}
 */
async function getInstalledVersions () {
  const settings = await getSettings()
  // return the list of installed versions if that is already cached
  if (!installedVersions) {
    let versionsList = []
    let files
    if (settings.useOpenTofu) {
      files = await fs.readdir(TfvmFS.otfVersionsDir)
    } else {
      files = await fs.readdir(TfvmFS.tfVersionsDir)
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
        logger.debug(`Unable to find installed versions of OpenTofu with directoriesObj=${JSON.stringify(TfvmFS.getDirectoriesObj())} and files=${JSON.stringify(files)}`)
      } else {
        logger.debug(`Unable to find installed versions of Terraform with directoriesObj=${JSON.stringify(TfvmFS.getDirectoriesObj())} and files=${JSON.stringify(files)}`)
      }
      return []
    }
  }
  return installedVersions
}
export default getInstalledVersions
