import logger from './logger.js'

// ========================================
// LLM
// ========================================
const logLLMRequest = ({ model, messages }) => {
  logger.info({
    event: 'llm_request',
    model,
    messages,
  })
}

const logLLMResponse = ({ model, message, usage }) => {
  logger.info({
    event: 'llm_response',
    model,
    message,
    usage,
  })
}

// ========================================
// Tool
// ========================================

const logToolExecute = ({ tool, args }) => {
  logger.info({
    event: 'tool_execute',
    tool,
    args,
  })
}

const logToolResult = ({ tool, result }) => {
  logger.info({
    event: 'tool_result',
    tool,
    result,
  })
}

const logToolError = ({ tool, error }) => {
  logger.error({
    event: 'tool_error',
    tool,
    error: error?.stack || error?.message || String(error),
  })
}

// ========================================
// Context
// ========================================

const logContextTrim = ({ before, after }) => {
  logger.warn({
    event: 'context_trim',
    before,
    after,
  })
}

// ========================================
// Runtime
// ========================================

const logRuntimeError = (error) => {
  logger.error({
    event: 'runtime_error',
    error: error?.stack || error?.message || String(error),
  })
}

const logRuntimeStart = () => {
  logger.info({
    event: 'runtime_start',
  })
}

const logRuntimeExit = () => {
  logger.info({
    event: 'runtime_exit',
  })
}

// ========================================
// User
// ========================================

const logUserInput = (content) => {
  logger.info({
    event: 'user_input',
    content,
  })
}

// ========================================
// Assistant
// ========================================

const logAssistantMessage = (content) => {
  logger.info({
    event: 'assistant_message',
    content,
  })
}

export {
  logLLMRequest,
  logLLMResponse,
  logToolExecute,
  logToolResult,
  logToolError,
  logContextTrim,
  logRuntimeError,
  logRuntimeStart,
  logRuntimeExit,
  logUserInput,
  logAssistantMessage,
}
