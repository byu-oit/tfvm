import * as https from 'https'
import * as http from 'http'
import chalk from 'chalk'
import fs from 'node:fs'

async function download(url, filePath, version) {
  const proto = !url.charAt(4).localeCompare('s') ? https : http

  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath)
    let fileInfo = null

    const request = proto.get(url, response => {
      if (response.statusCode !== 200) {
        fs.unlink(filePath, () => {
          console.log(
            chalk.red.bold(`Terraform ${version}  is not yet released or available.`)
          )
        })
        return
      }

      fileInfo = {
        mime: response.headers['content-type'],
        size: parseInt(response.headers['content-length'], 10),
      }

      response.pipe(file)
    })

    // The destination stream is ended by the time it's called
    file.on('finish', () => resolve(fileInfo))

    request.on('error', err => {
      fs.unlink(filePath, () => reject(err))
    })

    file.on('error', err => {
      fs.unlink(filePath, () => reject(err))
    })

    request.end()
  })
}

export default download
