import chalk from 'chalk'
import deleteDirectory from '../util/deleteDirectory.js'
import { versionRegEx } from '../util/constants.js'
import getInstalledVersions from '../util/getInstalledVersions.js'
import getDirectoriesObj from '../util/getDirectoriesObj.js'
import verifySetup from '../util/verifySetup.js'
import getErrorMessage from '../util/errorChecker.js'
import { logger } from '../util/logger.js'

async function uninstall (uninstallVersion) {
  try {
    if (!await verifySetup()) return
    uninstallVersion = 'v' + uninstallVersion
    if (!versionRegEx.test(uninstallVersion)) {
      console.log(
        chalk.red.bold('Invalid version syntax')
      )
    } else {
      const tfvmDir = getDirectoriesObj().tfvmDir
      const installedVersions = await getInstalledVersions()
      if (installedVersions === null || !installedVersions.includes(uninstallVersion)) {
        console.log(
          chalk.white.bold(`terraform ${uninstallVersion} is not installed. Type "tfvm list" to see what is installed.`)
        )
      } else {
        process.stdout.write(
          chalk.white.bold(`Uninstalling terraform ${uninstallVersion}...`)
        )
        await deleteDirectory(tfvmDir, uninstallVersion)
        process.stdout.write(' done')
      }
    }
  } catch (error) {
    logger.fatal(error, `Fatal error when running "uninstall" command where uninstallVersion=${uninstallVersion}: `)
    getErrorMessage(error)
  }
}

export default uninstall
