import { compareVersions } from 'compare-versions'

/**
 * Any version before this will require you to use older AWS authentication methods.
 * Any version later than and including this one supports the newer sso/cli cache methods
 */
const oldestTfVersionWithNewAWSAuth = '0.14.6'

function requiresOldAWSAuth (versionNum) {
  return compareVersions(versionNum, oldestTfVersionWithNewAWSAuth) === -1
}

export default requiresOldAWSAuth
