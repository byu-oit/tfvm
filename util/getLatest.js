import axios from 'axios'
import { logger } from './logger.js'

export default async function () {
  try {
    const response = await axios.get('https://checkpoint-api.hashicorp.com/v1/check/terraform')
    return response.data.current_version
  } catch (e) {
    logger.fatal(e, 'Error attempting to fetch latest terraform version with Checkpoint Hashicorp API:')
    return null
  }
}
