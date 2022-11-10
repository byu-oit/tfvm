import chalk from 'chalk'
import versionRegEx from '../util/versionRegEx.js'
import getInstalledVersions from '../util/getInstalledVersions.js'
import getDirectoriesObj from '../util/getDirectoriesObj.js'
import download from '../util/installFile.js'
import unzipFile from '../util/unzipFile.js'
import fs from 'node:fs/promises'
import verifySetup from '../util/verifySetup.js'
import getOSBits from '../util/getOSBits.js'
import getErrorMessage from '../util/errorChecker.js'
import getTerraformVersion from '../util/tfVersion.js'
import getLatest from '../util/getLatest.js'

async function install (installVersion) {
  try {
    if (!await verifySetup()) return
    const versionNum = installVersion
    installVersion = 'v' + installVersion
    if (!versionRegEx.test(installVersion) && versionNum !== 'latest') {
      console.log(
        chalk.red.bold('Invalid version syntax.')
      )
      console.log(
        chalk.white.bold('Version should be formatted as \'vX.X.X\'\nGet a list of all current terraform versions here: https://releases.hashicorp.com/terraform/')
      )
    } else if (versionNum === 'latest') {
      const installedVersions = await getInstalledVersions()
      const latest = await getLatest()
      const currentVersion = await getTerraformVersion()
      if (latest) {
        const versionLatest = 'v' + latest
        if (installedVersions && installedVersions.includes(versionLatest) && currentVersion !== versionLatest) {
          console.log(
            chalk.bold.cyan(`The latest terraform version is ${latest} and is already installed on your computer. Run 'tfvm use ${latest} to use.`)
          )
        } else if (installedVersions && installedVersions.includes(versionLatest) && currentVersion === versionLatest) {
          const currentVersion = await getTerraformVersion()
          console.log(
            chalk.bold.cyan(`The lastest terraform version is ${currentVersion} and is already installed and in use on your computer.`)
          )
        } else {
          await installFromWeb(versionLatest, latest)
        }
      }
    } else {
      const installedVersions = await getInstalledVersions()
      if (installedVersions && installedVersions.includes(installVersion)) {
        console.log(
          chalk.white.bold(`Terraform version ${installVersion} is already installed.`)
        )
      } else {
        await installFromWeb(installVersion, versionNum)
      }
    }
  } catch (error) {
    getErrorMessage(error)
  }
}

export default install

export async function installFromWeb (installVersion, versionNum, printMessage = true) {
  const tfvmDir = getDirectoriesObj().tfvmDir
  const zipPath = tfvmDir.concat('\\').concat(`${installVersion}.zip`)
  const newVersionDir = tfvmDir.concat('\\').concat(installVersion)
  const bitType = getOSBits() === 'AMD64' ? 'windows_amd64' : 'windows_386'
  const url = `https://releases.hashicorp.com/terraform/${versionNum}/terraform_${versionNum}_${bitType}.zip`
  await download(url, zipPath, versionNum)
  await fs.mkdir(newVersionDir)
  await unzipFile(zipPath, newVersionDir)
  await fs.unlink(zipPath)
  if (printMessage) {
    process.stdout.write(
      chalk.bold.cyan(`Installation complete. If you want to use this version, type\n\ntfvm use ${versionNum}`)
    )
  }
}
