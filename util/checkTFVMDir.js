import fs from 'node:fs/promises';
import getDirectoriesObj from "./getDirectoriesObj.js";

async function checkTFVMDir () {
  const appDataDir = getDirectoriesObj().appDataDir

  const appDataDirFiles = await fs.readdir(appDataDir)
  if (!appDataDirFiles.includes('tfvm')) {
    const tfvmDir = appDataDir.concat('\\tfvm')
    await fs.mkdir(tfvmDir)
  }
}

export default checkTFVMDir
