import chalk from 'chalk'
import compareVersions from 'compare-versions'
import getTerraformVersion from '../util/tfVersion.js'
import getInstalledVersions from '../util/getInstalledVersions.js'
import verifySetup from '../util/verifySetup.js'
import getErrorMessage from '../util/errorChecker.js'
import getOSBits from '../util/getOSBits.js'

async function list () {
  try {
    if (!await verifySetup()) return
    const printList = []
    const tfList = await getInstalledVersions()

    if (tfList !== null) {
      const currentTFVersion = await getTerraformVersion()
      process.stdout.write('\n')
      tfList.sort(compareVersions).reverse()
      for (const versionDir of tfList) {
        if (versionDir === currentTFVersion) {
          const bitType = getOSBits() === 'AMD64' ? '64' : '32'
          let printVersion = '  * '
          printVersion = printVersion + versionDir.substring(1, versionDir.length)
          printVersion = printVersion + ` (Currently using ${bitType}-bit executable)`
          printList.push(printVersion)
        } else {
          let printVersion = '    '
          printVersion = printVersion + versionDir.substring(1, versionDir.length)
          printList.push(printVersion)
        }
      }
      printList.forEach(printVersion => {
        console.log(
          chalk.white.bold(printVersion)
        )
      })
    } else {
      console.log(
        chalk.cyan.bold('It appears you have no Terraform versions downloaded.', '\n',
          chalk.green.bold('Run tfvm install <version> to install a new version'))
      )
    }
  } catch (error) {
    getErrorMessage(error)
  }
}

export default list
