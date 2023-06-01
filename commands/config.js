import chalk from 'chalk'
import fs from 'node:fs/promises'
import getSettings from '../util/getSettings.js'
import getErrorMessage from '../util/errorChecker.js'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { logger } from '../util/logger.js'

async function config (setting, options) {
  logger.level = options.level
  const __dirname = dirname(fileURLToPath(import.meta.url))
  try {
    if (setting.includes('=')) {
      const settings = setting.split('=')
      const settingsObj = await getSettings()
      switch (settings[0]) {
        case 'disableErrors':
          if (settings[1] === 'true' || settings[1] === 'false') {
            settingsObj.disableErrors = settings[1]
            await fs.writeFile(resolve(__dirname, './../settings.txt'), JSON.stringify(settingsObj), 'utf8')
          } else {
            console.log(
              chalk.red.bold('Invalid input for disableErrors setting. Use either \'tfvm config disableErrors=true\' or \'tfvm config disableErrors=false\'')
            )
          }
          break
        case 'disableAWSWarnings':
          if (settings[1] === 'true' || settings[1] === 'false') {
            settingsObj.disableAWSWarnings = settings[1]
            await fs.writeFile(resolve(__dirname, './../settings.txt'), JSON.stringify(settingsObj), 'utf8')
          } else {
            console.log(
              chalk.red.bold('Invalid input for disableAWSWarnings setting. Use either \'tfvm config disableAWSWarnings=true\' or \'tfvm config disableAWSWarnings=false\'')
            )
          }
          break
        case 'disableSettingPrompts':
          if (settings[1] === 'true' || settings[1] === 'false') {
            settingsObj.disableSettingPrompts = settings[1]
            await fs.writeFile(resolve(__dirname, './../settings.txt'), JSON.stringify(settingsObj), 'utf8')
          } else {
            console.log(
              chalk.red.bold('Invalid input for disableSettingPrompts setting. Use either \'tfvm config disableSettingPrompts=true\' or \'tfvm config disableSettingPrompts=false\'')
            )
          }
          break
        default:
          logger.warn(`Invalid setting change attempt with setting=${setting} and __dirname=${__dirname}`)
          console.log(
            chalk.red.bold('Invalid setting. See the README.md file for all configurable settings.')
          )
      }
    } else {
      logger.warn(`Invalid setting change format attempt with setting=${setting} and __dirname=${__dirname}`)
      console.log(
        chalk.red.bold('Invalid config format. Command should be formatted config \'<setting=value>\'')
      )
    }
  } catch (error) {
    logger.fatal(error, `Fatal error when running "config" command where setting=${setting} and __dirname=${__dirname}: `)
    getErrorMessage(error)
  }
  logger.debug('Execution of "config" command finished.')
}

export default config
