import chalk from 'chalk'
import fs from 'node:fs/promises'
import getSettings from "../util/getSettings.js"
import getErrorMessage from "../util/errorChecker.js"
import { dirname, resolve} from 'path'
import { fileURLToPath } from 'url'

async function config (setting) {
  const __dirname = dirname(fileURLToPath(import.meta.url))
  try {
    if(setting.includes('=')){
      const settings = setting.split('=')
      switch (settings[0]) {
        case 'disableErrors':
          const settingsObj = await getSettings()
          if (settings[1] === 'true' || settings[1] === 'false') {
            settingsObj.disableErrors = settings[1]
            await fs.writeFile(resolve(__dirname, './../settings.txt'), JSON.stringify(settingsObj),  'utf8')
          }
          else {
            console.log(
              chalk.red.bold(`Invalid input for disableErrors setting. Should be either 'tfvm config disableErrors=true' or 'tfvm config disableErrors=false'`)
            )
          }
          break
      }
    }
    else {
      console.log(
        chalk.red.bold(`Invalid config format. Command should be formatted config '<setting=value>'`)
      )
    }

  } catch (error) {
    getErrorMessage(error)
  }
}

export default config
