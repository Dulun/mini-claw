import { OpenAI } from 'openai'
import dotenv from 'dotenv'

dotenv.config()

const client = new OpenAI({
  baseURL: process.env.BASEURL,
  apiKey: process.env.OPENAI_API_KEY,
})

async function main() {
  try {
    const response = await client.chat.completions.create({
      model: 'mimo-v2.5',
      messages: [
        {
          role: 'user',
          content: '你是谁？',
        },
      ],
    })
    console.log(response.choices[0].message.content)
  } catch (error) {
    console.error('Error:', error)
  }
}

main()
