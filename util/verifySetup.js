import fs from 'node:fs/promises'
import chalk from 'chalk'
import getDirectoriesObj from './getDirectoriesObj.js'
import getSettings from './getSettings.js'
import runShell from '../util/runShell.js'
import { dirname, resolve} from 'path'
import { fileURLToPath } from 'url'
const __dirname = dirname(fileURLToPath(import.meta.url))

const tfPathString = `C:\\Program Files\\terraform`

async function verifySetup () {
  const appDataDir = getDirectoriesObj().appDataDir

  // STEP 1: Check that the appdata/roaming/tfvm folder exists
  const appDataDirFiles = await fs.readdir(appDataDir)
  // check to make sure that there is a tfvm folder
  if (!appDataDirFiles.includes('tfvm')) {
    // if the tfvm folder in AppData doesn't exist, create it
    const tfvmDir = appDataDir.concat('\\tfvm')
    await fs.mkdir(tfvmDir)
  }

  // STEP 2: Check that the path is set
  let tfPaths = []
  const PATH = await runShell('echo %path%')
  if (PATH == null) throw new Error('Error fetching path from console') // do we want to have an error here?
  let pathVars = PATH.split(';')
  let pathVarDoesntExist = true
  for (const variable of pathVars) {
    if (variable === tfPathString) pathVarDoesntExist = false
    if (variable.toLowerCase().includes('terraform') && variable.replace(/[\r\n]/gm, '') !== tfPathString) { // strip newlines
      tfPaths.push(variable)
    }
  }
  if (pathVarDoesntExist) {
    // add to system and local paths, if possible path. If you are not in an admin shell, it will only add to local.
    await runShell(resolve(__dirname, './../scripts/addToPath.ps1'), {'shell':'powershell.exe'})
    console.log(
      chalk.red.bold(`We couldn't find the right path variable for terraform, so we just added it. Please restart your terminal, or open a new one, for terraform to work correctly.`)
    )
  }
  const settings = await getSettings()
  if (settings.disableErrors === 'false') {
    if (tfPaths.length === 1) {
      if (tfPaths[0] !== tfPathString) {
        console.log(
          chalk.red.bold(`It appears you have ${tfPaths[0]} in your Path system environmental variables.`)
        )
        console.log(
          chalk.red.bold('This may stop tfvm from working correctly, so please remove this from the path. If you make changes to the path, make sure to restart your terminal.')
        )
        // todo prompt the user with an option in the program to remove those lines for them, with a 'I know what I am doing' check?
        console.log(
          chalk.cyan.bold(`To disable this error run 'tfvm config disableErrors=true'`)
        )
      }
    } else if (tfPaths.length > 1) {
      console.log(
        chalk.red.bold(
          'Your Path environmental variable includes the following terraform paths:'
        )
      )
      for (const badPath of tfPaths) {
        console.log(
          chalk.red.bold(badPath)
        )
      }
      console.log(
        chalk.red.bold(`This may stop tfvm from working correctly, so please remove these from the path. If you make changes to the path, make sure to restart your terminal.`)
      )
      console.log(
        chalk.cyan.bold(`To disable this error run 'tfvm config disableErrors=true'`)
      )
    }
  }
}

export default verifySetup
