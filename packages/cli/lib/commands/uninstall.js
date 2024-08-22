import chalk from 'chalk'
import { versionRegEx } from '../util/constants.js'
import getInstalledVersions from '../util/getInstalledVersions.js'
import getErrorMessage from '../util/errorChecker.js'
import { logger } from '../util/logger.js'
import getSettings from '../util/getSettings.js'
import { getOS } from '../util/tfvmOS.js'
import { TfvmFS } from '../util/TfvmFS.js'
import * as semver from 'semver'
import { LOWEST_OTF_VERSION } from "../util/constants.js"
const os = getOS()

async function uninstall (uninstallVersion) {
  try {
    uninstallVersion = 'v' + uninstallVersion
    if (!versionRegEx.test(uninstallVersion)) {
      console.log(chalk.red.bold('Invalid version syntax'))
    } else {
      const settings = await getSettings()
      const installedVersions = await getInstalledVersions()
      const semverCheck = semver.gte(uninstallVersion, LOWEST_OTF_VERSION)
      const openTofuCheck = settings.useOpenTofu && semverCheck

      if (!installedVersions.includes(uninstallVersion)) {
        console.log(chalk.white.bold(`${openTofuCheck ? 'opentofu' : 'terraform'} ${uninstallVersion} is not installed. Type "tfvm list" to see what is installed.`))
      } else {
        console.log(chalk.white.bold(`Uninstalling ${openTofuCheck ? 'opentofu' : 'terraform'} ${uninstallVersion}...`))
        if (openTofuCheck) {
          await TfvmFS.deleteDirectory(os.getOtfVersionsDir(), uninstallVersion)
        } else {
          await TfvmFS.deleteDirectory(os.getTfVersionsDir(), uninstallVersion)
        }
        console.log(chalk.cyan.bold(`Successfully uninstalled ${openTofuCheck ? 'opentofu' : 'terraform'} ${uninstallVersion}`))
      }
    }
  } catch (error) {
    logger.fatal(error, `Fatal error when running "uninstall" command where uninstallVersion=${uninstallVersion}: `)
    getErrorMessage(error)
  }
}

export default uninstall
