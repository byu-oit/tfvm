import getErrorMessage from './errorChecker.js'
import { logger } from './logger.js'
import { TfvmFS } from './TfvmFS.js'

async function deleteExecutable (useOpenTofu, os) {
  try {
    if (useOpenTofu === true) {
      await TfvmFS.deleteCurrentTfExe()
      logger.info('Successfully deleted Terraform executable')
    } else {
      await TfvmFS.deleteCurrentOtfExe()
      logger.info('Successfully deleted Open Tofu executable')
    }
  } catch (error) {
    logger.fatal(error, `Fatal error when deleting executable when useOpenTofu=${useOpenTofu}`)
    getErrorMessage(error)
  }
}

export default deleteExecutable
