import fsp from 'node:fs/promises'
import fs from 'node:fs'

const settingsFileName = 'settings.json'
const logFolderName = 'logs'
const tfVersionsFolderName = 'versions'
const tfvmAppDataFolderName = 'tfvm'
const otfvmAppDataFolderName = 'otfvm'
const dirSeparator = '\\'

/**
 * TFVM File System Class
 */
export class TfvmFS {
  static appDataDir = process.env.APPDATA || (process.platform === 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + '/.local/share')
  static tfvmDir = this.appDataDir.concat(dirSeparator + tfvmAppDataFolderName) // where tfvms own files are in AppData
  static otfvmDir = this.appDataDir.concat(dirSeparator + otfvmAppDataFolderName) // where open tofu version manager (still tfvm) are in AppData
  static tfVersionsDir = this.tfvmDir.concat(dirSeparator + tfVersionsFolderName) // where all the versions of terraform are stored
  static logsDir = this.tfvmDir.concat(dirSeparator + logFolderName) // where tfvm logs are stored (in appdata)=
  static terraformDir = this.appDataDir.concat(dirSeparator + 'terraform') // where the path is looking for terraform.exe to be found
  static openTofuDir = this.appDataDir.concat(dirSeparator + 'OpenTofu') // where the path is looking for OpenTofu to be found
  static settingsDir = this.tfvmDir.concat(dirSeparator + settingsFileName) // where the tfvm settings file can be located
  static architecture = process.env.PROCESSOR_ARCHITECTURE === 'AMD64' ? 'windows_amd64' : 'windows_386'
  static bitWidth = process.env.PROCESSOR_ARCHITECTURE === 'AMD64' ? '64' : '32'
  
  static getDirectoriesObj () {
    return {
      appDataDir: this.appDataDir,
      tfvmDir: this.tfvmDir,
      logsDir: this.logsDir,
      tfVersionsDir: this.tfVersionsDir,
      terraformDir: this.terraformDir,
      settingsDir: this.settingsDir,
      otfvmDir: this.otfvmDir
    }
  }

  /**
   * Creates appdata/roaming/terraform of it doesn't already exist
   * @returns {Promise<void>}
   */
  static async createTfAppDataDir () {
    if (!fs.existsSync(this.terraformDir)) fs.mkdirSync(TfvmFS.terraformDir)
    if (!fs.existsSync(this.openTofuDir)) fs.mkdirSync(TfvmFS.openTofuDir)
  }

  /**
   * Deletes the terraform exe so that a new one can be copied in
   * @returns {Promise<void>}
   */
  static async deleteCurrentTfExe () {
    // if appdata/roaming/terraform/terraform.exe exists, delete it
    if ((await fsp.readdir(this.terraformDir)).includes('terraform.exe')) {
      await fsp.unlink(this.terraformDir + dirSeparator + 'terraform.exe')
    }
    if ((await fsp.readdir(this.openTofuDir)).includes('tofu.exe')) {
      await fsp.unlink(this.openTofuDir + dirSeparator + 'tofu.exe')
    }
  }

  /**
   * Creates a 'path' by joining the arguments together with the system-specific dirSeparator
   * @param {...string} items
   * @returns {string}
   */
  static getPath = (...items) => items.join(dirSeparator)

  /**
   * removes the file name from a given path
   * @param {string} path
   * @returns {unknown}
   */
  static getFileNameFromPath = (path) => path.split(dirSeparator).pop()

  /**
   * Delete a directory (and all containing files) from a parent directory
   * @param {string} baseDirectory path of the parent directory
   * @param {string} removeDir path of the directory to remove (relative to the baseDirectory)
   * @returns {Promise<void>}
   */
  static async deleteDirectory (baseDirectory, removeDir) {
    const baseDirFiles = await fsp.readdir(baseDirectory)
    if (baseDirFiles.includes(removeDir)) {
      const fullPath = baseDirectory + dirSeparator + removeDir
      const files = await fsp.readdir(fullPath)
      for (const file of files) {
        await fsp.unlink(fullPath + dirSeparator + file)
      }
      await fsp.rmdir(fullPath)
    }
  }
}
