import chalk from 'chalk'
import fs from 'node:fs/promises'

import { versionRegEx } from '../util/constants.js'
import getInstalledVersions from '../util/getInstalledVersions.js'
import { TfvmFS } from '../util/getDirectoriesObj.js'
import download from '../util/download.js'
import unzipFile from '../util/unzipFile.js'
import getErrorMessage from '../util/errorChecker.js'
import getTerraformVersion from '../util/tfVersion.js'
import getLatest from '../util/getLatest.js'
import { logger } from '../util/logger.js'
import getSettings from '../util/getSettings.js'

async function install (versionNum) {
  try {
    const installVersion = 'v' + versionNum
    if (!versionRegEx.test(installVersion) && versionNum !== 'latest') {
      logger.warn(`invalid version attempted to install with version ${installVersion}`)
      console.log(chalk.red.bold('Invalid version syntax.'))
      console.log(chalk.white.bold('Version should be formatted as \'vX.X.X\'\nGet a list of all current ' +
        'terraform versions here: https://releases.hashicorp.com/terraform/'))
    } else if (versionNum === 'latest') {
      const installedVersions = await getInstalledVersions()
      const latest = await getLatest()
      const currentVersion = await getTerraformVersion()
      if (latest) {
        const versionLatest = 'v' + latest
        if (installedVersions.includes(versionLatest) && currentVersion !== versionLatest) {
          console.log(chalk.bold.cyan(`The latest terraform version is ${latest} and is ` +
            `already installed on your computer. Run 'tfvm use ${latest}' to use.`))
        } else if (installedVersions.includes(versionLatest) && currentVersion === versionLatest) {
          const currentVersion = await getTerraformVersion()
          console.log(chalk.bold.cyan(`The latest terraform version is ${currentVersion} and ` +
            'is already installed and in use on your computer.'))
        } else {
          await installFromWeb(latest)
        }
      }
    } else {
      const installedVersions = await getInstalledVersions()
      if (installedVersions.includes(installVersion)) {
        console.log(chalk.white.bold(`Terraform version ${installVersion} is already installed.`))
      } else {
        await installFromWeb(versionNum)
      }
    }
  } catch (error) {
    logger.fatal(error, `Fatal error when running "install" command where versionNum=${versionNum}: `)
    getErrorMessage(error)
  }
}

export default install

export async function installFromWeb (versionNum, printMessage = true) {
  const settingsObj = await getSettings()

  let url
  let zipPath
  let newVersionDir

  if (settingsObj.useOpenTofu) {
    zipPath = TfvmFS.getPath(TfvmFS.otfVersionsDir, `v${versionNum}.zip`)
    newVersionDir = TfvmFS.getPath(TfvmFS.otfVersionsDir, 'v' + versionNum)
    url = `https://github.com/opentofu/opentofu/releases/download/v${versionNum}/tofu_${versionNum}_${TfvmFS.architecture}.zip`
  } else {
    zipPath = TfvmFS.getPath(TfvmFS.tfVersionsDir, `v${versionNum}.zip`)
    newVersionDir = TfvmFS.getPath(TfvmFS.tfVersionsDir, 'v' + versionNum)
    url = `https://releases.hashicorp.com/terraform/${versionNum}/terraform_${versionNum}_${TfvmFS.architecture}.zip`
  }
  await download(url, zipPath, versionNum)
  await fs.mkdir(newVersionDir)
  await unzipFile(zipPath, newVersionDir)
  await fs.unlink(zipPath)
  if (printMessage) {
    console.log(chalk.bold.cyan(`Installation complete. If you want to use this version, type\n\ntfvm use ${versionNum}`))
  }
}
