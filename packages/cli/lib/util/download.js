import chalk from 'chalk'
import getSettings from './getSettings.js'
import axios from 'axios'
import fs from 'node:fs/promises'
import * as semver from 'semver'

const download = async (url, filePath, version) => {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    const fileData = Buffer.from(response.data, 'binary')
    await fs.writeFile(filePath, fileData)
  } catch (err) {
    const settings = await getSettings()
    console.log(chalk.red.bold(`${settings.useOpenTofu && semver.gte(version, '1.6.0') ? 'OpenTofu' : 'Terraform'} ${version} is not yet released or available.`))
    throw new Error()
  }
}

export default download
