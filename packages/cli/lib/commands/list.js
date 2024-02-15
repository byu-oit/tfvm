import chalk from 'chalk'
import { compareVersions } from 'compare-versions'
import getTerraformVersion from '../util/tfVersion.js'
import getInstalledVersions from '../util/getInstalledVersions.js'
import getErrorMessage from '../util/errorChecker.js'
import { logger } from '../util/logger.js'
import { getOS } from '../util/tfvmOS.js'
const os = getOS()

async function list () {
  try {
    const printList = []
    const tfList = await getInstalledVersions()

    if (tfList.length > 0) {
      const currentTFVersion = await getTerraformVersion()
      console.log('\n')
      tfList.sort(compareVersions).reverse()
      for (const versionDir of tfList) {
        if (versionDir === currentTFVersion) {
          let printVersion = '  * '
          printVersion = printVersion + versionDir.substring(1, versionDir.length)
          printVersion = printVersion + ` (Currently using ${os.getBitWidth()}-bit executable)`
          printList.push(printVersion)
        } else {
          let printVersion = '    '
          printVersion = printVersion + versionDir.substring(1, versionDir.length)
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
