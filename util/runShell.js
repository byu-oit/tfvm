import utils from 'util'
import { exec } from 'node:child_process'
export const execute = utils.promisify(exec)

export default async function (command, options = {}) {
  let response = ''
  try {
    response = await execute(command, options)
    if (!response.stderr) {
      return response.stdout
    }
  } catch (e) {
    return null
  }
}
