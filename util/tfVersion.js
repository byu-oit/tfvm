import runShell from '../util/runShell.js'

async function getTerraformVersion () {
  let response = (await runShell('terraform -v'))
  if (response == null) {
    return null
  }
  response = response.split('\n')[0]
  response = response.split(' ')[1]
  return response
}

export default getTerraformVersion
