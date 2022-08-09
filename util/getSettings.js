import fs from 'node:fs/promises'
import { dirname, resolve} from 'path'
import { fileURLToPath } from 'url'

export default async function () {
  const __dirname = dirname(fileURLToPath(import.meta.url))
  // there are normally easier ways to do this with require but I can't figure out a simpler way to do it with an ES6 module
  const data = JSON.parse(await fs.readFile(resolve(__dirname, './../settings.txt'), { encoding: 'utf8' }))
  return data
}