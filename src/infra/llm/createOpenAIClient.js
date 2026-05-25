import OpenAI from 'openai'
import config from '#config'

const client = new OpenAI({
  baseURL: config.baseURL,
  apiKey: config.apiKey,
})

export default client
