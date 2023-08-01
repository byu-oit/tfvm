import fs from 'node:fs/promises'
import { versionRegEx } from './constants.js'
import { TfvmFS } from './getDirectoriesObj.js'
import { logger } from './logger.js'

let installedVersions

/**
 * Returns a list of installed tf versions.
 * @returns {Promise<string[]>}
 */
async function getInstalledVersions () {
  // return the list of installed versions if that is already cached
  if (!installedVersions) {
    const tfList = []

    const files = await fs.readdir(TfvmFS.tfVersionsDir)
    if (files && files.length) {
      files.forEach(file => {
        if (versionRegEx.test(file)) {
          tfList.push(file)
        }
      })
      installedVersions = tfList
    } else {
      logger.debug(`Unable to find installed versions of terraform with directoriesObj=${JSON.stringify(TfvmFS.getDirectoriesObj())} and files=${JSON.stringify(files)}`)
      return []
    }
  }
  return installedVersions
}
export default getInstalledVersions
