import utils from 'util'
import { exec } from 'node:child_process'
import { logger } from './logger.js'
export const execute = utils.promisify(exec)

export default async function (command, options = {}) {
  let response = ''
  try {
    response = await execute(command, options)
    logger.debug(response, `Response from runShell(${command}, ${JSON.stringify(options)}):`)
    if (!response.stderr) {
      return response.stdout
    } else {
      logger.error(response.stderr, `stderr output in runShell(${command}, ${JSON.stringify(options)}):`)
    }
  } catch (e) {
    logger.error(e, `(potentially expected) error in runShell(${command}, ${JSON.stringify(options)}):`)
    return null
  }
}
