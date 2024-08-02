import chalk from 'chalk'
import fs from 'node:fs/promises'
import getSettings, { defaultSettings } from '../util/getSettings.js'
import getErrorMessage from '../util/errorChecker.js'
import { logger } from '../util/logger.js'
import { getOS } from '../util/tfvmOS.js'

const os = getOS()

async function config (setting) {
  try {
    const settingsObj = await getSettings()
    if (typeof setting === 'string') {
      if (setting.includes('=')) {
        const [settingKey, value] = setting.split('=')

        // if the settings is a valid setting, handle it.
        if (Object.keys(defaultSettings).includes(settingKey)) {
          if (value === 'true' || value === 'false') {
            // we need to store logical true or false, not the string 'true' or 'false'. This converts to a boolean:
            settingsObj[settingKey] = value === 'true'
            await fs.writeFile(os.getSettingsDir(), JSON.stringify(settingsObj), 'utf8')
          } else {
            console.log(chalk.red.bold(`Invalid input for ${settingKey} setting. ` +
              `Use either 'tfvm config ${settingKey}=true' or 'tfvm config ${settingKey}=false'`))
          }
          console.log(chalk.cyan.bold(`Successfully set ${setting}`))
        } else {
          logger.warn(`Invalid setting change attempt with setting=${setting}`)
          console.log(chalk.red.bold('Invalid setting. See the README.md file for all configurable settings.'))
        }
      } else {
        logger.warn(`Invalid setting change format attempt with setting=${setting}`)
        console.log(chalk.red.bold('Invalid config format. Command should be formatted config \'<setting=value>\''))
      }
    } else {
      await printSettings(settingsObj)
    }
  } catch (error) {
    logger.fatal(error, `Fatal error when running "config" command where setting=${setting}: `)
    getErrorMessage(error)
  }
}

export default config

async function printSettings (settingsObj) {
  console.log(chalk.cyan.bold('Current Settings: '))
  // turn object into an array of objects to append default values and then back into an object for displaying
  // https://stackoverflow.com/a/53653088/6901706
  const settingsData = Object.keys(settingsObj).map(key => ({
    key,
    value: settingsObj[key],
    '(default)': defaultSettings[key]
  })).reduce((accumulator, { key, ...restOfObj }) => {
    accumulator[key] = restOfObj
    return accumulator
  }, {})
  console.table(settingsData)

  console.log(chalk.yellow('Get more information about config settings by running `tfvm config -h`'))
}
