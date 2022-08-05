import utils from 'util'
import { exec } from 'node:child_process'
export const execute = utils.promisify(exec)

async function getTerraformVersion () {
  let response = ''
  try {
    response = await execute('terraform -v')
    if (!response.stderr) {
      response = response.stdout.split('\n')[0]
      response = response.split(' ')[1]
      return response
    }
  } catch (e) {
    return null
  }
}

export default getTerraformVersion
