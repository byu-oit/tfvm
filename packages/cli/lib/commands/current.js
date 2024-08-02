import chalk from 'chalk'

import getTerraformVersion from '../util/tfVersion.js'
import getErrorMessage from '../util/errorChecker.js'
import { logger } from '../util/logger.js'
import { TfvmFS } from '../util/getDirectoriesObj.js'
import getSettings from '../util/getSettings.js'

async function current () {
  try {
    const settings = await getSettings()
    const currentTFVersion = await getTerraformVersion()
    if (currentTFVersion !== null) {
      console.log(chalk.white.bold(`Current ${settings.useOpenTofu ? 'OpenTofu' : 'Terraform'} version:\n` +
        currentTFVersion + ` (Currently using ${TfvmFS.bitWidth}-bit executable)`))
    } else {
      console.log(chalk.cyan.bold(`It appears there is no ${settings.useOpenTofu ? 'opentofu' : 'terraform'} version running on your computer, or ` +
        'there was an error extracting the version.\n'))
      console.log(chalk.green.bold(`Run tfvm use <version> to set your ${settings.useOpenTofu ? 'opentofu' : 'terraform'} version, ` +
        `or ${settings.useOpenTofu ? 'tofu' : 'terraform'} -v to manually check the current version.`))
    }
  } catch (error) {
    logger.fatal(error, 'Fatal error when running "current" command: ')
    getErrorMessage(error)
  }
}

export default current
