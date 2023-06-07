import fs from 'node:fs/promises'
import { versionRegEx } from './constants.js'
import getDirectoriesObj from './getDirectoriesObj.js'
import { logger } from './logger.js'

async function getInstalledVersions () {
  const directoriesObj = getDirectoriesObj()
  const tfList = []

  const files = await fs.readdir(directoriesObj.tfvmDir)
  if (files && files.length) {
    files.forEach(file => {
      if (versionRegEx.test(file)) {
        tfList.push(file)
      }
    })
    return tfList
  } else {
    logger.debug(`Unable to find installed versions of terraform with directoriesObj=${JSON.stringify(directoriesObj)} and files=${JSON.stringify(files)}`)
    return null
  }
}
export default getInstalledVersions
