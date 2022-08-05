import fs from 'node:fs/promises'
import chalk from 'chalk'
import getDirectoriesObj from "./getDirectoriesObj.js"

async function verifySetup () {
  const appDataDir = getDirectoriesObj().appDataDir

  const appDataDirFiles = await fs.readdir(appDataDir)
  if (!appDataDirFiles.includes('tfvm')) {
    const tfvmDir = appDataDir.concat('\\tfvm')
    await fs.mkdir(tfvmDir)
  }
  let tfPaths = []
  const PATH = process.env.Path
  let pathVars = PATH.split(';')
  for (const variable of pathVars) {
    if (variable.includes('terraform') || variable.includes('Terraform')) {
      tfPaths.push(variable)
    }
  }
  if (tfPaths.length === 1) {
    if (tfPaths[0] !== 'C:\\Program Files\\terraform'){
      console.log(
        chalk.red.bold(`It appears you have ${tfPaths[0]} in your path environmental variables. Please remove this and add 'C:\\Program Files\\terraform' instead.`)
      )
      console.log(
        chalk.red.bold(`This will likely stop tfvm from working correctly`)
      )
    }
  } else {
      console.log(
        chalk.red.bold(
          'Your path environmental variable includes the following terraform paths:'
        )
      )
      for (const badPath of tfPaths) {
        if (badPath !== 'C:\\Program Files\\terraform') {
          console.log(
            chalk.red.bold(badPath)
          )
        }
      }
      console.log(
        chalk.red.bold(`This may stop tfvm from working correctly`)
      )
      console.log(
        chalk.red.bold(`To ensure that tfvm functions correctly, use only 'C:\\Program Files\\terraform' in your path system/user variables`)
      )
  }
}

export default verifySetup
