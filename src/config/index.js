import rawConfig from '#rawconfig' with { type: 'json' }
import { z } from 'zod'

export const ConfigSchema = z.object({
  agents: z.object({
    defaults: z.object({
      models: z.record(
        z.string(),

        z.object({
          alias: z.string(),
        }),
      ),
    }),

    model: z.object({
      primary: z.object({
        provider: z.string(),
        model: z.string(),
      }),
    }),
  }),

  models: z.object({
    providers: z.record(
      z.string(),

      z.object({
        models: z.array(
          z.object({
            name: z.string(),
            baseURL: z.url(),
          }),
        ),
      }),
    ),
  }),
})

const result = ConfigSchema.safeParse(rawConfig)

// console.dir(result, {
//   depth: null,
// })

if (!result.success) {
  console.error('Config validation failed:')
  console.error(result.error.format())
  process.exit(1)
}

const _config = result.data
const primary = _config.agents.model.primary

const provider = primary.provider
const model = primary.model

const config = {
  model,
  baseURL: _config.models.providers[provider].models.find(
    (m) => m.name === model,
  ).baseURL,

  // secrets 从 env 来
  apiKey: process.env.OPENAI_API_KEY,
}
// console.log('Config loaded successfully:', config)

export default config
