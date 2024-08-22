import chalk from 'chalk'
import { compareVersions } from 'compare-versions'
import getTerraformVersion from '../util/tfVersion.js'
import getInstalledVersions from '../util/getInstalledVersions.js'
import getErrorMessage from '../util/errorChecker.js'
import { logger } from '../util/logger.js'
import { getOS } from '../util/tfvmOS.js'
import * as semver from 'semver'
import getSettings from '../util/getSettings.js'
import { LOWEST_OTF_VERSION } from "../util/constants.js"
const os = getOS()

async function list () {
  try {
    const printList = []
    const tfList = await getInstalledVersions()

    if (tfList.length > 0) {
      const currentTFVersion = await getTerraformVersion()
      tfList.sort(compareVersions).reverse()
      for (const versionDir of tfList) {
        const settings = await getSettings()
        const version = versionDir.substring(1, versionDir.length)

        let type = ''
        if (settings.useOpenTofu) {
          // logic to get the correct spacing
          const parsed = semver.parse(version)
          type += (parsed.minor.toString().length === 1 && parsed.patch.toString().length === 1 ? '  ' : ' ')
          if (semver.gte(version, LOWEST_OTF_VERSION)) {
            type += '[OpenTofu]'
          } else if (semver.lt(version, LOWEST_OTF_VERSION)) {
            type += '[Terraform]'
          }
        }

        if (versionDir === currentTFVersion) {
          let printVersion = '  * '
          printVersion += version
          if (settings.useOpenTofu) {
            printVersion += type
          }
          printVersion = printVersion + ` (Currently using ${os.getBitWidth()}-bit executable)`
          printList.push(printVersion)
        } else {
          let printVersion = '    '
          printVersion += version

          if (settings.useOpenTofu) {
            printVersion += type
          }
          printList.push(printVersion)
        }
      }
      printList.forEach(printVersion => {
        console.log(chalk.white.bold(printVersion))
      })
    } else {
      console.log(chalk.cyan.bold('It appears you have no Terraform versions downloaded.', '\n',
        chalk.green.bold('Run tfvm install <version> to install a new version')))
    }
  } catch (error) {
    logger.fatal(error, 'Fatal error when running "list" command: ')
    getErrorMessage(error)
  }
}

export default list
