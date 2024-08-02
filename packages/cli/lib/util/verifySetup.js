import fs from 'node:fs'
import chalk from 'chalk'
import getSettings from './getSettings.js'
import runShell from './runShell.js'
import { logger } from './logger.js'
import { getOS } from './tfvmOS.js'
import TfvmFS from './getDirectoriesObj.js'

async function verifySetup () {
  const os = getOS()

  // STEP 1: Check that the appdata/roaming/tfvm folder exists
  if (!fs.existsSync(os.getOtfVersionsDir())) fs.mkdirSync(os.getOtfVersionsDir())

  // STEP 2: Check that the path is set
  const otfPaths = []
  if (!fs.existsSync(os.getTfVersionsDir())) {
    fs.mkdirSync(os.getTfVersionsDir())
  }

  // STEP 2: Check that the path is set
  const tfPaths = []

  const PATH = await runShell(os.getPathCommand())
  logger.trace(`PATH in verifySetup(): ${PATH}`)
  if (PATH == null) {
    logger.fatal('Error fetching path from console')
    throw new Error('Error fetching path from console')
  } // do we want to have an error here?
  const pathVars = PATH.split(os.getPathDelimiter())
  let pathVarDoesntExist = true
  let pathVarDoesntExistOpenTofu = true
  for (const variable of pathVars) {
    if (variable.replace(/[\r\n]/gm, '') === os.getTerraformDir()) pathVarDoesntExist = false
    if (variable.toLowerCase().includes('terraform') && variable.replace(/[\r\n]/gm, '') !== os.getTerraformDir()) { // strip newlines
      tfPaths.push(variable)
    }
    if (variable.replace(/[\r\n]/gm, '') === os.getOpenTofuDir()) pathVarDoesntExistOpenTofu = false
    if (variable.toLowerCase().includes('opentofu') && variable.replace(/[\r\n]/gm, '') !== os.getOpenTofuDir()) { // strip newlines
      otfPaths.push(variable)
    }
  }
  if (pathVarDoesntExist || pathVarDoesntExistOpenTofu) {
    // add to local paths
    logger.warn(`Couldn't find tfvm in path where this is the path: ${PATH}`)
    logger.debug(`Attempting to run ${pathVarDoesntExist ? 'addToPath.ps1' : 'addToPath.ps1'}...`)
    if (pathVarDoesntExist) {
      logger.debug('Attempting to run addToPath script...')
      if (await runShell(...(await os.getAddToPathShellArgs())) == null) {
        os.handleAddPathError()
      } else {
        logger.debug('Successfully ran addToPath script, added to path.')
        console.log(chalk.red.bold('We couldn\'t find the right path variable for terraform, so we just added it.\n' +
          'Please restart your terminal, or open a new one, for terraform to work correctly.\n'))
      }
    } else {
      if (await runShell(resolve(__dirname, './../scripts/addToPathOpenTofu.ps1'), { shell: 'powershell.exe' }) == null) {
        console.log(chalk.red.bold('tfvm script failed to run. Please run the following command in a powershell window:\n'))
        console.log(chalk.blue.bold('Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser'))
      } else {
        logger.debug('Successfully ran addToPathOpenTofu.ps1, added to path.')
        console.log(chalk.red.bold('We couldn\'t find the right path variable for opentofu, so we just added it.\n' +
          'Please restart your terminal, or open a new one, for opentofu to work correctly.\n'))
      }
    }
    return false
  }
  const settings = await getSettings()
  // OpenTofu path check
  if (settings.disableErrors === 'false') {
    if (otfPaths.length === 1) {
      if (otfPaths[0] !== os.getOpenTofuDir()) {
        logger.error(`Extra opentofu path in PATH: ${otfPaths[0]}.`)
        console.log(chalk.red.bold(`It appears you have ${otfPaths[0]} in your Path system environmental variables.`))
        console.log(chalk.red.bold('This may stop tfvm from working correctly, so please remove this from the path.\n' +
          'If you make changes to the path, make sure to restart your terminal.'))
        if (!settings.disableSettingPrompts) {
          console.log(chalk.cyan.bold('To disable this error run \'tfvm config disableErrors=true\''))
        }
        return false
      }
    } else if (otfPaths.length > 1) {
      console.log(chalk.red.bold('Your Path environmental variable includes the following terraform paths:'))
      for (const badPath of otfPaths) {
        logger.warn(`It appears you have ${badPath} in your environmental variables, which may be bad.`)
        console.log(chalk.red.bold(badPath))
      }
      console.log(chalk.red.bold('This may stop tfvm from working correctly, so please remove these from the path.\n' +
        'If you make changes to the path, make sure to restart your terminal.'))
      if (!settings.disableSettingPrompts) {
        console.log(chalk.cyan.bold('To disable this error run \'tfvm config disableErrors=true\''))
      }
      logger.trace('verifySetup exited unsuccessfully')
      return false
    }
    // Terraform path check
    if (tfPaths.length === 1) {
      if (tfPaths[0] !== os.getTerraformDir()) {
        logger.error(`Extra terraform path in PATH: ${tfPaths[0]}.`)
        console.log(chalk.red.bold(`It appears you have ${tfPaths[0]} in your Path system environmental variables.`))
        console.log(chalk.red.bold('This may stop tfvm from working correctly, so please remove this from the path.\n' +
          'If you make changes to the path, make sure to restart your terminal.'))
        if (!settings.disableSettingPrompts) {
          console.log(chalk.cyan.bold('To disable this error run \'tfvm config disableErrors=true\''))
        }
        return false
      }
    } else if (tfPaths.length > 1) {
      console.log(chalk.red.bold('Your Path environmental variable includes the following terraform paths:'))
      for (const badPath of tfPaths) {
        logger.warn(`It appears you have ${badPath} in your environmental variables, which may be bad.`)
        console.log(chalk.red.bold(badPath))
      }
      console.log(chalk.red.bold('This may stop tfvm from working correctly, so please remove these from the path.\n' +
        'If you make changes to the path, make sure to restart your terminal.'))
      if (!settings.disableSettingPrompts) {
        console.log(chalk.cyan.bold('To disable this error run \'tfvm config disableErrors=true\''))
      }
      logger.trace('verifySetup exited unsuccessfully')
      return false
    }
  }
  logger.trace('verifySetup exited successfully')
  return true
}

export default verifySetup
