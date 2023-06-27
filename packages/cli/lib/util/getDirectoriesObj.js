import fs from 'node:fs'
import { settingsFileName } from './constants.js'

let directoriesObj

function getDirectoriesObj () {
  if (!directoriesObj) {
    const appDataDir = process.env.APPDATA || (process.platform === 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + '/.local/share')
    const tfvmDir = appDataDir.concat('\\tfvm')
    const tfVersionsDir = tfvmDir.concat('\\versions')
    const logsDir = tfvmDir.concat('\\logs')
    if (!fs.existsSync(tfvmDir)) fs.mkdirSync(tfvmDir)
    if (!fs.existsSync(tfVersionsDir)) fs.mkdirSync(tfVersionsDir)
    if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir)
    const terraformDir = appDataDir.concat('\\terraform')
    const settingsDir = tfvmDir.concat(`\\${settingsFileName}`)

    directoriesObj = {
      appDataDir,
      tfvmDir,
      logsDir,
      tfVersionsDir,
      terraformDir,
      settingsDir
    }
  }
  return directoriesObj
}

export default getDirectoriesObj
