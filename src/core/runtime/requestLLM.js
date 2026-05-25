import config from '#config'
import { TOOLS, TOOL_SCHEMAS } from '#tools'
import openAiClient from '#src/infra/llm/createOpenAIClient.js'
import { en } from 'zod/locales'

const model = config.model

const requestLLM = async (messages) => {
  const response =
    await openAiClient.chat.completions.create({
      model,
      messages,
      tools: TOOL_SCHEMAS,
      // thinking: {
      //   type: 'disabled',
      // },
    })
  return response
}

export default requestLLM
