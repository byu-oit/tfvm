import fs from 'node:fs/promises'
import versionRegEx from './versionRegEx.js'
import getDirectoriesObj from '../util/getDirectoriesObj.js'

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
  }
  else {
    return null
  }
}
export default getInstalledVersions
