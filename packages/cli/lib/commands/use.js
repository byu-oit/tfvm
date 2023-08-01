import chalk from 'chalk'
import fs from 'node:fs/promises'
import enquirer from 'enquirer'

import { versionRegEx } from '../util/constants.js'
import getInstalledVersions from '../util/getInstalledVersions.js'
import { TfvmFS } from '../util/getDirectoriesObj.js'
import getErrorMessage from '../util/errorChecker.js'
import { installFromWeb } from './install.js'
import getSettings from '../util/getSettings.js'
import requiresOldAWSAuth from '../util/requiresOldAWSAuth.js'
import { logger } from '../util/logger.js'

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
    const installedVersions = await getInstalledVersions()
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
  console.log(chalk.white.bold(`Terraform v${version} is not installed. Would you like to install it?`))
  const installToggle = new enquirer.Toggle({
    disabled: 'Yes',
    enabled: 'No'
  })
  if (await installToggle.run()) {
    console.log(chalk.white.bold(`No action taken. Use 'tfvm install ${version}' to install terraform v${version}`))
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
  if (version[0] === 'v') version = version.substring(1)

  await TfvmFS.createTfAppDataDir()
  await TfvmFS.deleteCurrentTfExe()

  await fs.copyFile(
    TfvmFS.getPath(TfvmFS.tfVersionsDir, 'v' + version, 'terraform.exe'), // source file
    TfvmFS.getPath(TfvmFS.terraformDir, 'terraform.exe') // destination file
  )
  console.log(chalk.cyan.bold(`Now using terraform v${version} (${TfvmFS.bitWidth}-bit)`))
  const settings = await getSettings()
  if (requiresOldAWSAuth(version) && !settings.disableAWSWarnings) {
    console.log(chalk.yellow.bold('Warning: This tf version is not compatible with the newest ' +
      'AWS CLI authentication methods (e.g. aws sso login). Use short-term credentials instead.'))
    if (!settings.disableSettingPrompts) {
      console.log(chalk.yellow.bold('To disable this error run \'tfvm config disableAWSWarnings=true\''))
    }
  }
}
