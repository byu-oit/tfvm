import chalk from 'chalk'
import fs from 'node:fs/promises'
import { versionRegEx } from '../util/constants.js'
import getInstalledVersions from '../util/getInstalledVersions.js'
import download from '../util/download.js'
import unzipFile from '../util/unzipFile.js'
import getErrorMessage from '../util/errorChecker.js'
import getTerraformVersion from '../util/tfVersion.js'
import getLatest from '../util/getLatest.js'
import { logger } from '../util/logger.js'
import getSettings from '../util/getSettings.js'
import { getOS, Mac } from '../util/tfvmOS.js'
import { compare } from 'compare-versions'
const os = getOS()

const LAST_TF_VERSION_WITHOUT_ARM = '1.0.1'

async function install (versionNum) {
  try {
    const settings = await getSettings()
    const installVersion = 'v' + versionNum
    if (!versionRegEx.test(installVersion) && versionNum !== 'latest') {
      logger.warn(`invalid version attempted to install with version ${installVersion}`)
      console.log(chalk.red.bold('Invalid version syntax.'))
      if (settings.useOpenTofu) {
        console.log(chalk.white.bold('Version should be formatted as \'vX.X.X\'\nGet a list of all current ' +
        'opentofu versions here: https://github.com/opentofu/opentofu/releases'))
      } else {
        console.log(chalk.white.bold('Version should be formatted as \'vX.X.X\'\nGet a list of all current ' +
        'terraform versions here: https://releases.hashicorp.com/terraform/'))
      }
    } else if (versionNum === 'latest') {
      const installedVersions = await getInstalledVersions()
      const latest = await getLatest()
      const currentVersion = await getTerraformVersion()
      if (latest) {
        const versionLatest = 'v' + latest
        if (installedVersions.includes(versionLatest) && currentVersion !== versionLatest) {
          console.log(chalk.bold.cyan(`The latest ${settings.useOpenTofu ? 'opentofu' : 'terraform'} version is ${latest} and is ` +
            `already installed on your computer. Run 'tfvm use ${latest}' to use.`))
        } else if (installedVersions.includes(versionLatest) && currentVersion === versionLatest) {
          const currentVersion = await getTerraformVersion()
          console.log(chalk.bold.cyan(`The latest ${settings.useOpenTofu ? 'opentofu' : 'terraform'} version is ${currentVersion} and ` +
            'is already installed and in use on your computer.'))
        } else {
          await installFromWeb(latest)
        }
      }
    } else {
      const installedVersions = await getInstalledVersions()
      if (installedVersions.includes(installVersion)) {
        console.log(chalk.white.bold(`${settings.useOpenTofu ? 'OpenTofu' : 'Terraform'} version ${installVersion} is already installed.`))
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
  let arch = os.getArchitecture()

  if (settingsObj.useOpenTofu) {
    zipPath = os.getPath(os.getOtfVersionsDir(), `v${versionNum}.zip`)
    newVersionDir = os.getPath(os.getOtfVersionsDir(), 'v' + versionNum)
    url = `https://github.com/opentofu/opentofu/releases/download/v${versionNum}/tofu_${versionNum}_${arch}.zip`
  } else {
    zipPath = os.getPath(os.getTfVersionsDir(), `v${versionNum}.zip`)
    newVersionDir = os.getPath(os.getTfVersionsDir(), 'v' + versionNum)
    url = `https://releases.hashicorp.com/terraform/${versionNum}/terraform_${versionNum}_${os.getOSName()}_${arch}.zip`
  }

  // Only newer terraform versions include a release for ARM (Apple Silicon) hardware, but their chips *can*
  // run the amd64 ones, it just isn't ideal. If the user requests to download a terraform version that doesn't
  // have an arm release (and they are on an Arm Mac), then just download the amd64 one instead.
  if (os instanceof Mac && arch === 'arm64' && compare(versionNum, LAST_TF_VERSION_WITHOUT_ARM, '<=')) {
    arch = 'amd64'
    console.log(chalk.bold.yellow(`Warning: There is no available ARM release of Terraform for version ${versionNum}.
    Installing the amd64 version instead (should run without issue via Rosetta)...`))
  }
  await download(url, zipPath, versionNum)
  await fs.mkdir(newVersionDir)
  await unzipFile(zipPath, newVersionDir)
  await fs.unlink(zipPath)
  await os.prepareExecutable(versionNum)
  if (printMessage) {
    console.log(chalk.bold.cyan(`Installation complete. If you want to use this version, type\n\ntfvm use ${versionNum}`))
  }
}
