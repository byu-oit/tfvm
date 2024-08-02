import axios from 'axios'
import {logger} from './logger.js'
import getSettings from "./getSettings.js";

export default async function () {
  const settings = await getSettings()
  try {
    if (settings.useOpenTofu){
      const response = await axios.get('https://api.github.com/repos/opentofu/opentofu/releases/latest')
      return response.data.name.replace('v', '')
    } else {
      const response = await axios.get('https://checkpoint-api.hashicorp.com/v1/check/terraform')
      return response.data.current_version
    }
  } catch (e) {
    if (settings.useOpenTofu){
      logger.fatal(e, 'Error attempting to fetch latest opentofu version with GitHub API:')
    } else {
      logger.fatal(e, 'Error attempting to fetch latest terraform version with Checkpoint Hashicorp API:')
    }
    return null
  }
}
