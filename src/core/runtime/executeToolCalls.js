import { TOOLS, TOOL_SCHEMAS } from '#tools'

import {
  pushUserMessage,
  pushAssistantMessage,
  pushAssistantToolCallMessage,
  pushToolMessage,
  getMessages,
  trimMessages,
  printMessages,
} from '../messages.js'

import {
  logRuntimeStart,
  logRuntimeExit,
  logUserInput,
  logLLMRequest,
  logLLMResponse,
  logToolExecute,
  logToolResult,
  logToolError,
  logAssistantMessage,
  logRuntimeError,
} from '#logger'

const executeToolCallAsync = async (toolCall) => {
  const toolName = toolCall.function.name
  const args = JSON.parse(toolCall.function.arguments)

  console.log(`\n[TOOL] ${toolName}`)
  const result = await TOOLS[toolName](args)
  return result
}

const executeToolCallsAsync = async (toolCalls) => {
  for (const toolCall of toolCalls) {
    try {
      logToolExecute(toolCall)
      const result = await executeToolCallAsync(toolCall)
      logToolResult(toolCall, result)
      pushToolMessage(toolCall.id, result)
    } catch (error) {
      logToolError(toolCall, error)
      pushToolMessage(toolCall.id, {
        error: String(error),
      })
    }
  }
}

export default executeToolCallsAsync
