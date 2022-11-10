import fs from 'node:fs/promises'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

export default async function () {
  const __dirname = dirname(fileURLToPath(import.meta.url))
  return JSON.parse(await fs.readFile(resolve(__dirname, './../settings.txt'), { encoding: 'utf8' }))
}
