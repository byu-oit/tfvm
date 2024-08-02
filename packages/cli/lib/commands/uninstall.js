import chalk from 'chalk'

import { versionRegEx } from '../util/constants.js'
import getInstalledVersions from '../util/getInstalledVersions.js'
import { TfvmFS } from '../util/getDirectoriesObj.js'
import getErrorMessage from '../util/errorChecker.js'
import { logger } from '../util/logger.js'
import getSettings from '../util/getSettings.js'

async function uninstall (uninstallVersion) {
  try {
    uninstallVersion = 'v' + uninstallVersion
    if (!versionRegEx.test(uninstallVersion)) {
      console.log(chalk.red.bold('Invalid version syntax'))
    } else {
      const settings = await getSettings()
      const installedVersions = await getInstalledVersions()
      if (!installedVersions.includes(uninstallVersion)) {
        console.log(chalk.white.bold(`${settings.useOpenTofu ? 'opentofu' : 'terraform'} ${uninstallVersion} is not installed. Type "tfvm list" to see what is installed.`))
      } else {
        console.log(chalk.white.bold(`Uninstalling ${settings.useOpenTofu ? 'opentofu' : 'terraform'} ${uninstallVersion}...`))
        if (settings.useOpenTofu) {
          await TfvmFS.deleteDirectory(TfvmFS.otfVersionsDir, uninstallVersion)
        } else {
          await TfvmFS.deleteDirectory(TfvmFS.tfVersionsDir, uninstallVersion)
        }
        console.log(chalk.cyan.bold(`Successfully uninstalled ${settings.useOpenTofu ? 'opentofu' : 'terraform'} ${uninstallVersion}`))
      }
    }
  } catch (error) {
    logger.fatal(error, `Fatal error when running "uninstall" command where uninstallVersion=${uninstallVersion}: `)
    getErrorMessage(error)
  }
}

export default uninstall
