import chalk from 'chalk'
import deleteExecutable from '../util/deleteExecutable.js'
import fs from 'node:fs/promises'
import enquirer from 'enquirer'
import { versionRegEx } from '../util/constants.js'
import getInstalledVersions from '../util/getInstalledVersions.js'
import { TfvmFS } from '../util/TfvmFS.js'
import getErrorMessage from '../util/errorChecker.js'
import { installFromWeb } from './install.js'
import getSettings from '../util/getSettings.js'
import requiresOldAWSAuth from '../util/requiresOldAWSAuth.js'
import { logger } from '../util/logger.js'
import { getOS } from '../util/tfvmOS.js'
import * as semver from 'semver'
import { LOWEST_OTF_VERSION } from "../util/constants.js"

const os = getOS()
let openTofuCheck = false

async function use (version) {
  try {
    await useVersion(version)
  } catch (error) {
    logger.fatal(error, `Fatal error when running "use" command where version=${version}: `)
    getErrorMessage(error)
  }
}

export default use

/**
 * Switch to (and install if necessary) the desired version in X.X.X format
 * (Reused by the 'detect' command)
 * @param version
 */
export async function useVersion (version) {
  const versionWithV = 'v' + version
  if (!versionRegEx.test(versionWithV)) {
    console.log(chalk.red.bold('Invalid version syntax'))
  } else {
    const installedVersions = await getInstalledVersions(version)
    const settings = await getSettings()
    openTofuCheck = settings.useOpenTofu && semver.gte(version, LOWEST_OTF_VERSION)
    // delete tofu executable if using a version lower than 1.6.0
    if (settings.useOpenTofu && semver.lt(version, LOWEST_OTF_VERSION)) {
      await deleteExecutable(false)
    } else if (openTofuCheck) {
      await deleteExecutable(true)
    }
    if (!installedVersions.includes(versionWithV)) {
      const successfullyInstalled = await installNewVersion(version)
      if (!successfullyInstalled) return
    }
    await switchVersionTo(version)
  }
}

/**
 * Install a given terraform version
 * @param {string} version a version string in X.X.X format
 * @returns {Promise<boolean>} true if the user opted to install the version, false if they did not
 */
export async function installNewVersion (version) {
  const settings = await getSettings()
  const openTofuCheck = settings.useOpenTofu && semver.gte(version, LOWEST_OTF_VERSION)
  console.log(chalk.white.bold(`${openTofuCheck ? 'OpenTofu' : 'Terraform'} v${version} is not installed. Would you like to install it?`))
  const installToggle = new enquirer.Toggle({
    disabled: 'Yes',
    enabled: 'No'
  })
  if (await installToggle.run()) {
    console.log(chalk.white.bold(`No action taken. Use 'tfvm install ${version}' to install ${settings.useOpenTofu ? 'opentofu' : 'terraform'} v${version}`))
    return false
  } else {
    await installFromWeb(version, false)
    return true
  }
}

/**
 * Switches to a version of terraform
 * @param {string} version The tf version to switch to in X.X.X format
 * @returns {Promise<void>}
 */
export async function switchVersionTo (version) {
  const settings = await getSettings()
  if (version[0] === 'v') version = version.substring(1)

  if (openTofuCheck) {
    await TfvmFS.createOtfAppDataDir()
    await TfvmFS.deleteCurrentOtfExe()
    await fs.copyFile(
      os.getPath(os.getOtfVersionsDir(), 'v' + version, os.getOtfExecutableName()), // source file
      os.getPath(os.getOpenTofuDir(), os.getOtfExecutableName()) // destination file
    )
  } else {
    await TfvmFS.createTfAppDataDir()
    await TfvmFS.deleteCurrentTfExe()
    await fs.copyFile(
      os.getPath(os.getTfVersionsDir(), 'v' + version, os.getTFExecutableName()), // source file
      os.getPath(os.getTerraformDir(), os.getTFExecutableName()) // destination file
    )
  }

  console.log(chalk.cyan.bold(`Now using ${openTofuCheck ? 'opentofu' : 'terraform'} v${version} (${os.getBitWidth()}-bit)`))

  if (requiresOldAWSAuth(version) && !settings.disableAWSWarnings) {
    console.log(chalk.yellow.bold('Warning: This tf version is not compatible with the newest ' +
      'AWS CLI authentication methods (e.g. aws sso login). Use short-term credentials instead.'))
    if (!settings.disableSettingPrompts) {
      console.log(chalk.yellow.bold('To disable this error run \'tfvm config disableAWSWarnings=true\''))
    }
  }
}
