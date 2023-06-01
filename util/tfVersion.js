import runShell from '../util/runShell.js'
import { logger } from './logger.js'

async function getTerraformVersion () {
  let response = (await runShell('terraform -v'))
  if (response == null) {
    logger.error('Error getting terraform version')
    return null
  }
  response = response.split('\n')[0]
  response = response.split(' ')[1]
  return response
}

export default getTerraformVersion
