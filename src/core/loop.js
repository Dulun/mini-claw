import { input } from '@inquirer/prompts'
import ora from 'ora'
import { TOOLS, TOOL_SCHEMAS } from '#tools'
import config from '#config'
import requestLLM from './runtime/requestLLM.js'
import executeToolCallsAsync from './runtime/executeToolCalls.js'
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

import {
  pushUserMessage,
  pushAssistantMessage,
  pushAssistantToolCallMessage,
  pushToolMessage,
  getMessages,
  trimMessages,
  printMessages,
} from './messages.js'

const MODEL = config.model

const loop = async () => {
  while (true) {
    // =========================
    // User Input
    // =========================

    const userInput = await input({
      message: 'You:',
      prefix: ' ',
    })

    if (userInput.toLowerCase() === 'exit') {
      console.log('Exiting...')
      break
    }
    // push user message
    logUserInput(userInput)
    pushUserMessage(userInput)

    const spinner = ora('AI 正在思考...').start()

    try {
      // =========================
      // Agent Loop
      // =========================

      while (true) {
        logLLMRequest({
          model: MODEL,
          messages: getMessages(),
        })
        const response = await requestLLM(getMessages())

        const message = response.choices[0].message

        // =========================
        // Tool Calls
        // =========================

        if (message.tool_calls) {
          // push assistant tool call message
          pushAssistantToolCallMessage(message)
          // execute tool calls
          await executeToolCallsAsync(message.tool_calls)
          continue
        }

        // =========================
        // Final Assistant Response
        // =========================
        logLLMResponse(response)
        logAssistantMessage(message.content)
        pushAssistantMessage(message.content)

        spinner.succeed('AI: ' + message.content)

        // trim after full turn completed
        trimMessages()

        break
      }
    } catch (error) {
      logRuntimeError(error)
      spinner.fail('出错了')
      console.error(error)
    }
  }
}

export default loop
