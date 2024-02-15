import fsp from 'node:fs/promises'
import fs from 'node:fs'
import path from 'path'
import { getOS } from './tfvmOS.js'
const os = getOS()

/**
 * TFVM File System Class
 */
export class TfvmFS {
  /**
   * Creates appdata/roaming/terraform of it doesn't already exist
   * @returns {Promise<void>}
   */
  static async createTfAppDataDir () {
    if (!fs.existsSync(os.getTerraformDir())) fs.mkdirSync(os.getTerraformDir())
  }

  /**
   * Deletes the terraform exe so that a new one can be copied in
   * @returns {Promise<void>}
   */
  static async deleteCurrentTfExe () {
    // if appdata/roaming/terraform/terraform.exe exists, delete it
    if ((await fsp.readdir(os.getTerraformDir())).includes(os.getTFExecutableName())) {
      await fsp.unlink(os.getTerraformDir() + path.sep + os.getTFExecutableName())
    }
  }

  /**
   * removes the file name from a given path
   * @param {string} path
   * @returns {unknown}
   */
  static getFileNameFromPath = (path) => path.split(path.sep).pop()

  /**
   * Delete a directory (and all containing files) from a parent directory
   * @param {string} baseDirectory path of the parent directory
   * @param {string} removeDir path of the directory to remove (relative to the baseDirectory)
   * @returns {Promise<void>}
   */
  static async deleteDirectory (baseDirectory, removeDir) {
    const baseDirFiles = await fsp.readdir(baseDirectory)
    if (baseDirFiles.includes(removeDir)) {
      const fullPath = baseDirectory + path.sep + removeDir
      const files = await fsp.readdir(fullPath)
      for (const file of files) {
        await fsp.unlink(fullPath + path.sep + file)
      }
      await fsp.rmdir(fullPath)
    }
  }
}
