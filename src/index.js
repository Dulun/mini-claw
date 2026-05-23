import { OpenAI } from 'openai'
import { input } from '@inquirer/prompts'
import ora from 'ora'
import dotenv from 'dotenv'
import { TOOL_SCHEMAS } from './tools/index.js'
import { TOOLS } from './tools/index.js'

dotenv.config()
const MESSAGES = []
const MODEL = 'mimo-v2.5'
// mimo-v2-flash
// mimo-v2.5-tts
// mimo-v2.5

const client = new OpenAI({
  baseURL: process.env.BASEURL,
  apiKey: process.env.OPENAI_API_KEY,
})

const pushMessage = (msg) => {
  MESSAGES.push({
    role: msg.role,
    content: msg.content,
    ...(msg.tool_calls && { tool_calls: msg.tool_calls }),
  })
  return MESSAGES
}

/*
{
  id: 'f7f1d1a9caf645f2bdeecd3850b5cf71',
  choices: [ { finish_reason: 'stop', index: 0, message: [Object] } ],
  created: 1779504636,
  model: 'mimo-v2.5',
  object: 'chat.completion',
  usage: {
    completion_tokens: 116,
    prompt_tokens: 250,
    total_tokens: 366,
    completion_tokens_details: { reasoning_tokens: 71 },
    prompt_tokens_details: { cached_tokens: 192 }
  }
}
*/
const chat = async (msg) => {
  const messages = pushMessage(msg)
  // console.log(messages)
  try {
    const response = await client.chat.completions.create({
      model: MODEL,
      messages,
      tools: TOOL_SCHEMAS,
    })

    const message = response.choices[0].message
    if (!!message.tool_calls) {
      for (const toolCall of message.tool_calls) {
        console.log(
          toolCall,
          '工具调用:',
          toolCall.function.name,
          toolCall.function.arguments,
        )
        const toolName = toolCall.function.name
        const args = JSON.parse(toolCall.function.arguments)

        // important: how toolcalling acturally works
        // 这里应该有个超时机制，防止工具调用卡死
        const result = await TOOLS[toolName](args)
      }
    }

    pushMessage({
      role: 'tool',
      tool_call_id: toolCall.id,
      content: JSON.stringify(result),
    })
    messages.push()
    return response.choices[0].message.content
    // console.log(response.choices[0].message.content)
  } catch (error) {
    console.error('Error:', error)
  }
}

const main = async () => {
  await chat({ role: 'user', content: '你是谁？' })

  while (true) {
    const userInput = await input({
      message: 'You:',
      prefix: ' ',
    })

    if (userInput.toLowerCase() === 'exit') {
      console.log('Exiting...')
      break
    }

    // 显示加载动画
    const spinner = ora('AI 正在思考...').start()

    try {
      const response = await chat({
        role: 'user',
        content: userInput,
      })
      spinner.succeed('AI: ' + response)
    } catch (error) {
      spinner.fail('出错了')
      console.error(error)
    }
  }
}

main()
