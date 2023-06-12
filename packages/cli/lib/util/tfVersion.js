import runShell from './runShell.js'
import { logger } from './logger.js'
import { tfCurrVersionRegEx } from './constants.js'

async function getTerraformVersion () {
  const response = (await runShell('terraform -v'))
  if (response == null) {
    logger.error('Error getting terraform version')
    return null
  }
  const versionExtractionResult = Array.from(response.matchAll(tfCurrVersionRegEx))
  if (versionExtractionResult.length === 0) {
    logger.error('Error extracting terraform version where this is the response from `terraform -v`:\n' + response)
    return null
  }
  // Terraform prints warnings at the start of the output which may contain other tf versions, such as the latest version
  // Terraform will print the actual current version at the end of the output.
  // Therefore, we want to grab the last match in the string and return that as our best guess for the current version
  return versionExtractionResult[versionExtractionResult.length - 1][0]
}

export default getTerraformVersion
