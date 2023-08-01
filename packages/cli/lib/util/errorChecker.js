import chalk from 'chalk'
import { logger, printDebugInfo } from './logger.js'
function getErrorMessage (error) {
  printDebugInfo()
  if (error.code === 'EPERM') {
    // TODO remove on next version if we don't see this anymore
    logger.error(error, 'Unexpected elevation requirement error: ')
    console.log(chalk.red.bold('Unexpected EPERM error while trying to copy files.'))
  } else {
    logger.fatal(error, `Unexpected error in getErrorMessage(${error}):`)
    console.error(error)
  }
}

export default getErrorMessage
