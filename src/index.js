import { OpenAI } from 'openai'
import { input } from '@inquirer/prompts'
import ora from 'ora'
import dotenv from 'dotenv'

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
    })

    pushMessage(response.choices[0].message)
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
