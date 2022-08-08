import chalk from 'chalk'
import getTerraformVersion from '../util/tfVersion.js'
import verifySetup from "../util/verifySetup.js"
import getErrorMessage from "../util/errorChecker.js"

async function current () {
  try {
    await verifySetup()
    const currentTFVersion = await getTerraformVersion()
    if (currentTFVersion !== null) {
      console.log(chalk.white.bold('Current Terraform version:'))
      process.stdout.write('\n')
      console.log(chalk.white.bold(currentTFVersion + ' (Currently using 64-bit executable)'))
    } else {
      console.log(
        chalk.cyan.bold('It appears you have no Terraform versions downloaded.', '\n',
          chalk.green.bold('Run tfvm install <version> to install a new version'))
      )
    }
  } catch (error) {
    getErrorMessage(error)
  }
}

export default current
