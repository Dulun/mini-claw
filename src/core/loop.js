import { input } from '@inquirer/prompts'
import ora from 'ora'
import { TOOLS, TOOL_SCHEMAS } from '#tools'
import openAiClient from './createOpenAIClient.js'

import {
  pushUserMessage,
  pushAssistantMessage,
  pushAssistantToolCallMessage,
  pushToolMessage,
  getMessages,
  trimMessages,
  printMessages,
} from './messages.js'

const MODEL = 'mimo-v2.5'

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
    pushUserMessage(userInput)

    const spinner = ora('AI 正在思考...').start()

    try {
      // =========================
      // Agent Loop
      // =========================

      while (true) {
        const response =
          await openAiClient.chat.completions.create({
            model: MODEL,

            messages: getMessages(),

            tools: TOOL_SCHEMAS,
          })

        const message = response.choices[0].message

        // =========================
        // Tool Calls
        // =========================

        if (message.tool_calls) {
          // push assistant tool call message
          pushAssistantToolCallMessage(message)

          // execute all tools
          for (const toolCall of message.tool_calls) {
            const toolName = toolCall.function.name

            const args = JSON.parse(
              toolCall.function.arguments,
            )

            console.log(`\n[TOOL] ${toolName}`)

            // execute tool
            const result = await TOOLS[toolName](args)

            // push tool result
            pushToolMessage(toolCall.id, result)
          }

          // continue thinking
          continue
        }

        // =========================
        // Final Assistant Response
        // =========================
        pushAssistantMessage(message.content)

        spinner.succeed('AI: ' + message.content)

        // trim after full turn completed
        trimMessages()

        break
      }
    } catch (error) {
      spinner.fail('出错了')

      console.error(error)
    }
  }
}

export default loop
