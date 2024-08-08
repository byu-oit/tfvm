import fs from 'node:fs/promises'
import { versionRegEx } from './constants.js'
import { logger } from './logger.js'
import getSettings from './getSettings.js'
import { getOS } from './tfvmOS.js'
import * as semver from 'semver'
const os = getOS()

let installedVersions

/**
 * Returns a list of installed tf versions.
 * @returns {Promise<string[]>}
 */
async function getInstalledVersions (version = '') {
  const settings = await getSettings()
  // return the list of installed versions if that is already cached
  if (!installedVersions) {
    const versionsList = []
    let files

    let semverCheck = true
    if (version !== '') {
      semverCheck = semver.gte(version, '1.6.0')
    }
    if (settings.useOpenTofu && semverCheck) {
      files = await fs.readdir(os.getOtfVersionsDir())
      const terraformFiles = await fs.readdir(os.getTfVersionsDir())
      terraformFiles.forEach(file => {
        if (semver.lt(file, '1.6.0')) {
          files.push(file)
        }
      })
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
