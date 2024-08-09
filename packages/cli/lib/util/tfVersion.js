import runShell from './runShell.js'
import { logger } from './logger.js'
import { tfCurrVersionRegEx, openTofuCurrVersionRegEx } from './constants.js'
import getSettings from './getSettings.js'
import * as semver from 'semver'

let currentTfVersion
let currentOtfVersion
const LOWEST_OTF_VERSION = '1.6.0'

/**
 * Returns the current terraform version, if there is one. Returns null if there is no current version
 * @returns {Promise<string|null>}
 */
async function getTerraformVersion () {
  const settings = await getSettings()
  // cache current tf version during a single execution of tfvm
  if (currentTfVersion && !settings.useOpenTofu) return currentTfVersion
  if (currentOtfVersion && settings.useOpenTofu) return currentOtfVersion

  let response
  if (settings.useOpenTofu) {
    response = (await runShell('tofu -v'))
    if (response === null) {
      response = (await runShell('terraform -v'))
    }
  } else {
    response = (await runShell('terraform -v'))
  }

  if (response == null) {
    logger.error('Error getting terraform version')
    return null
  }

  let versionExtractionResult
  if (response.includes('Terraform')) versionExtractionResult = Array.from(response.matchAll(tfCurrVersionRegEx))
  else versionExtractionResult = Array.from(response.matchAll(openTofuCurrVersionRegEx))

  if (versionExtractionResult.length === 0) {
    logger.error('Error extracting terraform version where this is the response from `terraform -v`:\n' + response)
    return null
  }
  // Terraform prints warnings at the start of the output which may contain other tf versions, such as the latest version
  // Terraform will print the actual current version at the end of the output.
  // Therefore, we want to grab the last match in the string and return that as our best guess for the current version
  currentTfVersion = versionExtractionResult[versionExtractionResult.length - 1][0]
  return currentTfVersion
}

export default getTerraformVersion
