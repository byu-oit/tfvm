import chalk from 'chalk'
import fs from 'node:fs/promises'
import versionRegEx from '../util/versionRegEx.js'
import getInstalledVersions from '../util/getInstalledVersions.js'
import getDirectoriesObj from '../util/getDirectoriesObj.js'
import verifySetup from '../util/verifySetup.js'
import getErrorMessage from '../util/errorChecker.js'
import getOSBits from '../util/getOSBits.js'
import { installFromWeb } from './install.js'
import enquirer from 'enquirer'
import getSettings from '../util/getSettings.js'
import requiresOldAWSAuth from '../util/requiresOldAWSAuth.js'
import { logger } from '../util/logger.js'

async function use (useVersion) {
  try {
    if (!await verifySetup()) return
    const versionNum = useVersion
    useVersion = 'v' + useVersion
    if (!versionRegEx.test(useVersion)) {
      console.log(
        chalk.red.bold('Invalid version syntax')
      )
    } else {
      const { terraformDir, appDataDir, tfvmDir } = getDirectoriesObj()
      const useVerDir = tfvmDir.concat('\\').concat(useVersion)
      const installedVersions = await getInstalledVersions()
      if (installedVersions === null || !installedVersions.includes(useVersion)) {
        console.log(
          chalk.white.bold(`Terraform ${useVersion} is not installed. Would you like to install it?`)
        )
        const installToggle = new enquirer.Toggle({
          disabled: 'Yes',
          enabled: 'No'
        })
        if (await installToggle.run()) {
          console.log(
            chalk.white.bold(`No action taken. Use 'tfvm install ${versionNum}' to install terraform ${useVersion}`)
          )
          return
        } else {
          await installFromWeb(useVersion, versionNum, false)
        }
      }
      // if appdata/roaming/terraform doesn't exist, create it
      const appDataFiles = await fs.readdir(appDataDir)
      if (!appDataFiles.includes('terraform')) {
        await fs.mkdir(terraformDir)
      }
      // if appdata/roaming/terraform/terraform.exe exists, delete it
      if ((await fs.readdir(terraformDir)).includes('terraform.exe')) {
        await fs.unlink(terraformDir + '\\terraform.exe')
      }

      const bitType = getOSBits() === 'AMD64' ? '64' : '32'
      await fs.copyFile(useVerDir + '\\terraform.exe', terraformDir + '\\terraform.exe')
      console.log(
        chalk.cyan.bold(`Now using terraform ${useVersion} (${bitType}-bit)`)
      )
      const settings = await getSettings()
      if (requiresOldAWSAuth(versionNum) && !settings.disableAWSWarnings) {
        console.log(
          chalk.yellow.bold('Warning: This tf version is not compatible with the newest AWS CLI authentication methods (e.g. aws sso login). Use short-term credentials instead.')
        )
        if (!settings.disableSettingPrompts) {
          console.log(
            chalk.yellow.bold('To disable this error run \'tfvm config disableAWSWarnings=true\'')
          )
        }
      }
    }
  } catch (error) {
    logger.fatal(error, `Fatal error when running "use" command where useVersion=${useVersion}: `)
    getErrorMessage(error)
  }
  logger.debug('Execution of "use" command finished.')
}

export default use
