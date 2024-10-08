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
   * Creates terraform directory of it doesn't already exist
   * @returns {Promise<void>}
   */
  static async createTfAppDataDir () {
    if (!fs.existsSync(os.getTerraformDir())) fs.mkdirSync(os.getTerraformDir())
  }

  /**
   * Creates opentofu directory of it doesn't already exist
   * @returns {Promise<void>}
   */
  static async createOtfAppDataDir () {
    if (!fs.existsSync(os.getOpenTofuDir())) fs.mkdirSync(os.getOpenTofuDir())
  }

  /**
   * Deletes the terraform exe so that a new one can be copied in
   * @returns {Promise<boolean>}
   */
  static async deleteCurrentTfExe () {
    // if appdata/roaming/terraform/terraform.exe exists, delete it
    if ((await fsp.readdir(os.getTerraformDir())).includes(os.getTFExecutableName())) {
      await fsp.unlink(os.getTerraformDir() + path.sep + os.getTFExecutableName())
      return true
    } else {
      return false
    }
  }

  /**
   * Deletes the opentofu exe so that a new one can be copied in
   * @returns {Promise<boolean>}
   */
  static async deleteCurrentOtfExe () {
    // if appdata/roaming/opentofu/tofu.exe exists, delete it
    if ((await fsp.readdir(os.getOpenTofuDir())).includes(os.getOtfExecutableName())) {
      await fsp.unlink(os.getOpenTofuDir() + path.sep + os.getOtfExecutableName())
      return true
    } else {
      return false
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
