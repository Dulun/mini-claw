import fs from 'fs'
import path from 'path'

import pino from 'pino'

const logsDir = path.resolve('logs')

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, {
    recursive: true,
  })
}

const targets = [
  // always write file
  {
    target: 'pino/file',
    options: {
      destination: './logs/runtime.log',
      mkdir: true,
    },
    level: 'debug',
  },
]

// dev only console output
// if (process.env.NODE_ENV !== 'production') {
//   targets.push({
//     target: 'pino-pretty',
//     options: {
//       colorize: true,
//       translateTime: 'HH:MM:ss',
//       ignore: 'pid,hostname,service',
//     },

//     level: 'debug',
//   })
// }

const transport = pino.transport({
  targets,
})

const logger = pino(
  {
    level: 'debug',
    base: {
      service: 'mini-claw',
    },
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  transport,
)

export default logger
