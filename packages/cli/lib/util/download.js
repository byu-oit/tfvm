import chalk from 'chalk'
import axios from 'axios'
import fs from 'node:fs/promises'

const download = async (url, filePath, version) => {
    try {
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      const fileData = Buffer.from(response.data, 'binary');
      await fs.writeFile(filePath, fileData)
    } catch (err) {
      console.log(chalk.red.bold(`Terraform ${version} is not yet released or available.`))
      throw new Error()
    }
}

export default download
