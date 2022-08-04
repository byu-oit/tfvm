import chalk from 'chalk';
import versionRegEx from "../util/versionRegEx.js";
import getInstalledVersions from "../util/getInstalledVersions.js";
import getDirectoriesObj from "../util/getDirectoriesObj.js";
import download from "../util/installFile.js";
import unzipFile from "../util/unzipFile.js";
import fs from 'node:fs/promises';

async function install (installVersion) {
  const versionNum = installVersion
  installVersion = 'v' + installVersion
  if (!versionRegEx.test(installVersion)) {
    console.log(
      chalk.red.bold('Invalid version syntax')
    )
  } else {
    const installedVersions = await getInstalledVersions();
    const tfvmDir = getDirectoriesObj().tfvmDir
    if (installedVersions && installedVersions.includes(installVersion)) {
      console.log(
        chalk.white.bold(`Version ${installVersion} is already installed.`)
      )
    }
    else {
      const zipPath = tfvmDir.concat('\\').concat(`${installVersion}.zip`)
      const newVersionDir =  tfvmDir.concat('\\').concat(installVersion)
      const url = `https://releases.hashicorp.com/terraform/${versionNum}/terraform_${versionNum}_windows_amd64.zip`
      await download(url, zipPath, versionNum)
      await fs.mkdir(newVersionDir);
      await unzipFile(zipPath, newVersionDir)
      await fs.unlink(zipPath)
      process.stdout.write(
        chalk.bold.cyan(`Installation complete. If you want to use this version, type\n\ntfvm use ${versionNum}`)
      )

    }
  }
}

export default install
