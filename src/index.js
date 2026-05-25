import 'dotenv/config'
import { loop } from '#core'
import {
  logRuntimeStart,
  logRuntimeExit,
  logRuntimeError,
} from '#logger'

try {
  logRuntimeStart()
  await loop()
} catch (error) {
  logRuntimeError(error)
} finally {
  logRuntimeExit()
}
