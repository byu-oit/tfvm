import axios from 'axios'

export default async function () {
  try {
    const response = await axios.get('https://checkpoint-api.hashicorp.com/v1/check/terraform')
    return response.data.current_version
  }catch (e) {
    return null
  }
}
