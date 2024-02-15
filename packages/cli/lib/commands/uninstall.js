import chalk from 'chalk'
import { versionRegEx } from '../util/constants.js'
import getInstalledVersions from '../util/getInstalledVersions.js'
import { TfvmFS } from '../util/TfvmFS.js'
import getErrorMessage from '../util/errorChecker.js'
import { logger } from '../util/logger.js'
import { getOS } from '../util/tfvmOS.js'
const os = getOS()

async function uninstall (uninstallVersion) {
  try {
    uninstallVersion = 'v' + uninstallVersion
    if (!versionRegEx.test(uninstallVersion)) {
      console.log(chalk.red.bold('Invalid version syntax'))
    } else {
      const installedVersions = await getInstalledVersions()
      if (!installedVersions.includes(uninstallVersion)) {
        console.log(chalk.white.bold(`terraform ${uninstallVersion} is not installed. Type "tfvm list" to see what is installed.`))
      } else {
        console.log(chalk.white.bold(`Uninstalling terraform ${uninstallVersion}...`))
        await TfvmFS.deleteDirectory(os.getTfVersionsDir(), uninstallVersion)
        console.log(chalk.cyan.bold(`Successfully uninstalled terraform ${uninstallVersion}`))
      }
    }
  } catch (error) {
    logger.fatal(error, `Fatal error when running "uninstall" command where uninstallVersion=${uninstallVersion}: `)
    getErrorMessage(error)
  }
}

export default uninstall
