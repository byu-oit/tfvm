import chalk from 'chalk'
import fs from 'node:fs/promises'
import enquirer from 'enquirer'
import { satisfies } from 'compare-versions'
import parser from '@evops/hcl-terraform-parser'

import { versionRegEx } from '../util/constants.js'
import getInstalledVersions from '../util/getInstalledVersions.js'
import verifySetup from '../util/verifySetup.js'
import getErrorMessage from '../util/errorChecker.js'
import { getAllFiles } from '../util/util.js'
import getTerraformVersion from '../util/tfVersion.js'
import { installNewVersion, switchVersionTo, useVersion } from './use.js'
import { logger } from '../util/logger.js'
import { TfvmFS } from '../util/TfvmFS.js'
import getSettings from "../util/getSettings.js";

async function detect () {
  const settings = await getSettings()
  // set of objects that contain the constraints and the file name
  const tfVersionConstraintSet = new Set()
  try {
    if (!await verifySetup()) return
    await findLocalVersionConstraints(tfVersionConstraintSet)

    // if there were any version constraints found, try to satisfy them
    if (tfVersionConstraintSet.size >= 1) {
      await satisfyConstraints(tfVersionConstraintSet)
    } else {
      // todo let the user select from list of frequently used versions instead of this disappointing message
      console.log(chalk.white.bold(`No ${settings.useOpenTofu ? 'OpenTofu' : 'Terraform'} files containing any version constraints are found in this directory.`))
    }
  } catch (error) {
    logger.fatal(error, `Fatal error when running "detect" command with these local ${settings.useOpenTofu ? 'OpenTofu' : 'Terraform'} ` +
      `constraints: ${Array.from(tfVersionConstraintSet).map(c => JSON.stringify(c)).join('; ')}: `)
    getErrorMessage(error)
  }
}

async function satisfyConstraints (tfVersionConstraintSet) {
  const currentTfVersion = await getTerraformVersion()
  /**
   * An array of objects containing a version and a fileName
   * @type {Record<string, string>[]}
   */
  const tfVersionConstraints = Array.from(tfVersionConstraintSet)

  // generate a list of all the unmet version constraints
  const unmetVersionConstraints = currentTfVersion == null
    ? tfVersionConstraints // if the current version is null, then all the constraints are unmet
    : getUnmetConstraints(tfVersionConstraints, currentTfVersion)
  if (unmetVersionConstraints.length === 0) {
    const settings = await getSettings()
    // exit quickly if the current tf version satisfies all required constraints
    console.log(chalk.cyan.bold(`Your current ${settings.useOpenTofu ? 'OpenTofu' : 'Terraform'} version (${currentTfVersion}) already ` +
    `satisfies the requirements of your local ${settings.useOpenTofu ? 'OpenTofu' : 'Terraform'} files.`))
  } else if (unmetVersionConstraints.length === 1 && tfVersionConstraints.length === 1) {
    await satisfySingleConstraint(unmetVersionConstraints[0])
  } else if (unmetVersionConstraints.length >= 1) {
    await satisfyMultipleConstraints(tfVersionConstraints)
  }
}

/**
 * Picks and switches to a satisfactory version or exits gracefully when there are multiple version constraints
 * @param {Record<string, string>[]} tfVersionConstraints
 * @returns {Promise<void>}
 */
async function satisfyMultipleConstraints (tfVersionConstraints) {
  if (allConstraintsAreSingleVersions(tfVersionConstraints)) {
    // if all the constraints are single versions, give them a dropdown list to select from
    await chooseAndUseVersionFrom(tfVersionConstraints)
  } else {
    const settings = await getSettings()
    console.log(chalk.white.bold(`There are multiple ${settings.useOpenTofu ? 'OpenTofu' : 'Terraform'} version constraints in this directory:`))
    tfVersionConstraints.forEach(c =>
      console.log(chalk.white.bold(`   - ${c.displayVersion} (${c.fileName})`)))

    const satisfactoryVersion = await tfVersionThatSatisfiesConstraints(tfVersionConstraints)
    if (satisfactoryVersion != null) {
      console.log(chalk.white.bold(`Switching to version ${satisfactoryVersion}...`))
      await switchVersionTo(satisfactoryVersion)
    } else {
      console.log(chalk.yellow.bold('No locally installed version satisfies all of the version constraints.\n' +
        'Install and/or switch to a version that satisfies the constraints of your choosing.'))
    }
  }
}

/**
 * Picks and switches to a satisfactory version or exits gracefully when there is only a single version constraint
 * @param {Record<string, string>} unmetVersionConstraint
 * @returns {Promise<void>}
 */
async function satisfySingleConstraint (unmetVersionConstraint) {
  // if there is only one constraint, and it is unmet, attempt to satisfy it
  console.log(chalk.white.bold(`${unmetVersionConstraint.fileName} requires a version that satisfies this constraint: ${unmetVersionConstraint.displayVersion}`))

  // install and/or switch to a version that meets the constraint
  const versionToUse = await tfVersionThatSatisfiesConstraints([unmetVersionConstraint])
  if (versionToUse != null) {
    console.log(chalk.white.bold(`Switching to version ${versionToUse}...`))
    await switchVersionTo(versionToUse)
    return
  }

  // if the constraint is a single version, but it is uninstalled, offer to install it.
  if (constraintIsSingleVersion(unmetVersionConstraint.version)) {
    const versionInstalled = await installNewVersion(unmetVersionConstraint.version)

    // Switch to that version if they opted to install it.
    if (versionInstalled) await switchVersionTo(unmetVersionConstraint.version)
  } else {
    // If the constraint is NOT a single version, tell the user that a version satisfying the constraint is not installed.
    // They can install it on their own.
    // We could use science to determine a version that meets all the criteria, but there is no guarantee that such a
    //  version is actually a valid terraform version.
    console.log(chalk.yellow.bold(`No installed version satisfies the ${unmetVersionConstraint.displayVersion} constraint.\n
            Install a compatible version using 'tfvm install <version>'`))
  }
}

/**
 * A subset of the tfVersionConstraints containing a version and a fileName
 * @param {Record<string, string>[]} tfVersionConstraints
 * @param {string} currentTfVersion
 * @returns {Record<string, string>[]}
 */
function getUnmetConstraints (tfVersionConstraints, currentTfVersion) {
  const unmetVersionConstraints = []
  for (const tfVersionConstraint of tfVersionConstraints) {
    if (!satisfies(currentTfVersion, tfVersionConstraint.version)) {
      unmetVersionConstraints.push(tfVersionConstraint)
    }
  }
  return unmetVersionConstraints
}

/**
 * Returns true if the constraint is a valid single version (vX.X.X or X.X.X format)
 * @param {string} constraint
 * @returns {boolean}
 */
function constraintIsSingleVersion (constraint) {
  return versionRegEx.test(constraint[0] === 'v' ? constraint : 'v' + constraint)
}

/**
 * Give user a list of choices from the given list and use the selected version
 * @param {Record<string, string>[]} constraintList
 * @returns {Promise<void>}
 */
async function chooseAndUseVersionFrom (constraintList) {
  console.log(chalk.white.bold('Found multiple required versions in this directory. Which version do you want to use?'))
  const cancelOptionText = 'Cancel'
  const selectedVersion = await new enquirer.Select({
    name: 'version',
    message: 'Select a version to switch to:',
    choices: [ // 'message' is the text that is displayed, 'name' is the text assigned to the selectedVersion variable
      ...constraintList.map(c => ({
        message: `${c.displayVersion} (${c.fileName})`,
        name: c.version
      })),
      {
        message: 'Cancel & Exit',
        name: cancelOptionText
      }
    ]
  }).run()
  if (selectedVersion === cancelOptionText) {
    chalk.yellow.bold('Action cancelled, no action taken.')
  } else {
    await useVersion(selectedVersion)
  }
}

/**
 * Populate a set with version constraints in the directory where the command was initiated
 * @param {Set<Record<string, string>>}constraintSet
 * @returns {Promise<void>}
 */
async function findLocalVersionConstraints (constraintSet) {
  // detect all the files in the current directory
  const localFilePaths = await getAllFiles()
  // determine which ones are terraform files
  for (const filePath of localFilePaths) {
    if (filePath.slice(-3) === '.tf') {
      // scan each one and add any required tf versions (if any) to a set
      const content = await fs.readFile(filePath)
      const fileName = TfvmFS.getFileNameFromPath(filePath)
      const fileHclAsJson = parser.parse(content)
      if (fileHclAsJson.required_core) {
        const settings = await getSettings()
        fileHclAsJson.required_core.forEach(version => {
          // terraform supports '!=' and `~>' in semver but the 'compare-versions' package does not
          for (const badOperator of ['!=']) {
            if (version.includes(badOperator)) {
              logger.error(`Failed to parse version ${version} because of '${badOperator}'.`)
              console.log(chalk.red.bold(`Ignoring constraint from ${fileName} ` +
                `because tfvm doesn't support parsing versions with '${badOperator}' in the ${settings.useOpenTofu ? 'OpenTofu' : 'Terraform'} required_version.`))
              return // functional equivalent of 'continue' in forEach
            }
          }
          // terraform includes commas in version ranges but the compare-versions library will break if it sees a comma
          // terraform also uses the `~>` operator in the same way that traditional semver uses `~`, so swap those.
          constraintSet.add({
            version: version.replaceAll(/,/g, '').replaceAll(/~> ?/g, '~'), // version for comparing
            displayVersion: version, // the version straight from the tf file, for printing
            fileName
          })
        })
      }
    }
  }
}

/**
 * Given a list of constraints, find the first (locally installed) tf version that satisfies all the constraints
 * @param {Record<string, string>[]} constraints the list of terraform constraints
 * @returns {Promise<string | null>} a version that satisfies the constraints, or null if no version was found.
 */
async function tfVersionThatSatisfiesConstraints (constraints) {
  // find a version that satisfies all
  for (const installedVersion of await getInstalledVersions()) {
    let versionSatisfiesConstraints = true
    for (const constraint of constraints) {
      if (!satisfies(installedVersion, constraint.version)) {
        versionSatisfiesConstraints = false
        break
      }
    }
    if (versionSatisfiesConstraints) return installedVersion
  }
  return null
}

/**
 * Returns true if the list of constraints are all single versions (X.X.X format)
 * @param {Record<string, string>[]} constraints
 * @returns {boolean}
 */
function allConstraintsAreSingleVersions (constraints) {
  for (const constraint of constraints) {
    if (!constraintIsSingleVersion(constraint.version)) return false
  }
  return true
}

export default detect
