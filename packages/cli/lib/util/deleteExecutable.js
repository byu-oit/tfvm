import getErrorMessage from './errorChecker.js'
import chalk from 'chalk'
import { logger } from './logger.js'
import { TfvmFS } from './TfvmFS.js'
import getSettings from './getSettings.js'

async function deleteExecutable (useOpenTofu) {
  try {
    let successfulDeletion = false
    if (useOpenTofu === true) {
      successfulDeletion = await TfvmFS.deleteCurrentTfExe()
    } else {
      successfulDeletion = await TfvmFS.deleteCurrentOtfExe()
    }

    logger.info(`Successfully deleted ${useOpenTofu ? 'Terraform' : 'OpenTofu'} executable`)
    const settings = await getSettings()
    if (!settings.disableTofuWarnings && successfulDeletion) {
      console.log(chalk.magenta.bold(`Switching to ${useOpenTofu ? 'OpenTofu' : 'Terraform'}. Make sure to use the ${useOpenTofu ? 'tofu' : 'terraform'} command instead of ${useOpenTofu ? 'terraform' : 'tofu'}.`))
      return true
    }
  } catch (error) {
    logger.fatal(error, `Fatal error when deleting executable when useOpenTofu=${useOpenTofu}`)
    getErrorMessage(error)
  }
}

export default deleteExecutable
