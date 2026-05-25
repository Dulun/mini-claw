// src/core/messages.js

/**
 * ============================================
 * Agent Runtime Message System (Turn/Chunk Based)
 * ============================================
 *
 * 核心思想：
 *
 * 不再把 messages 当“数组”
 * 而是：
 *
 * conversation turns / chunks
 *
 * 一个完整 chunk:
 *
 * user
 * assistant(tool_calls)
 * tool
 * assistant(final)
 *
 * trim 时：
 *
 * 删除完整 chunk
 * 而不是单条 message
 *
 * 避免：
 *
 * tool_call protocol 被破坏
 *
 * ============================================
 */
const MAX_CONTEXT_CHARS = 50000
const MAX_TOOL_CONTENT_LENGTH = 10000

const MESSAGES = []

// ============================================
// Base
// ============================================

export function pushMessage(message) {
  MESSAGES.push(message)
  return message
}

export function getMessages() {
  return structuredClone(MESSAGES)
}

export function getLastMessage() {
  return MESSAGES[MESSAGES.length - 1]
}

export function clearMessages() {
  MESSAGES.length = 0
}

// ============================================
// System
// ============================================

export function pushSystemMessage(content) {
  return pushMessage({
    role: 'system',
    content,
  })
}

// ============================================
// User
// ============================================

export function pushUserMessage(content) {
  return pushMessage({
    role: 'user',
    content,
  })
}

// ============================================
// Assistant
// ============================================

export function pushAssistantMessage(message) {
  return pushMessage(message)
}

export function pushAssistantToolCallMessage(message) {
  return pushMessage(message)
}

// ============================================
// Tool
// ============================================

export function pushToolMessage(toolCallId, result) {
  const safeResult = structuredClone(result)

  // 只截断 content
  if (
    typeof safeResult.content === 'string' &&
    safeResult.content.length > MAX_TOOL_CONTENT_LENGTH
  ) {
    safeResult.content =
      safeResult.content.slice(0, MAX_TOOL_CONTENT_LENGTH) +
      '\n...[TRUNCATED]'

    safeResult.truncated = true
  }

  return pushMessage({
    role: 'tool',
    tool_call_id: toolCallId,
    content: JSON.stringify(safeResult),
  })
}

// ============================================
// Context Size
// ============================================

export function getContextSize(messages = MESSAGES) {
  return JSON.stringify(messages).length
}

// ============================================
// Chunk Parser
// ============================================

/**
 * 将 messages 解析为 conversation chunks
 *
 * chunk:
 * {
 *   messages: []
 * }
 */
export function buildChunks() {
  const chunks = []

  let currentChunk = null

  for (const message of MESSAGES) {
    // system message 单独保留
    if (message.role === 'system') {
      continue
    }

    // user 开始新的 chunk
    if (message.role === 'user') {
      // 保存上一个 chunk
      if (currentChunk) {
        chunks.push(currentChunk)
      }

      currentChunk = {
        messages: [message],
      }

      continue
    }

    // assistant/tool 属于当前 chunk
    if (currentChunk) {
      currentChunk.messages.push(message)
    }
  }

  // push 最后 chunk
  if (currentChunk) {
    chunks.push(currentChunk)
  }

  return chunks
}

// ============================================
// Trim (Chunk Based)
// ============================================

/**
 * 真正安全的 trim
 *
 * 删除完整 chunk
 *
 * 不会破坏：
 *
 * assistant(tool_calls)
 * tool
 *
 * 的协议关系
 */
export function trimMessages() {
  const systemMessage =
    MESSAGES[0]?.role === 'system' ? MESSAGES[0] : null

  const chunks = buildChunks()

  // 当前 context size
  let currentMessages = [
    ...(systemMessage ? [systemMessage] : []),

    ...chunks.flatMap((chunk) => chunk.messages),
  ]

  let currentSize = getContextSize(currentMessages)

  // 不需要 trim
  if (currentSize <= MAX_CONTEXT_CHARS) {
    return
  }

  /**
   * 从最老 chunk 开始删除
   */
  while (
    chunks.length > 0 &&
    currentSize > MAX_CONTEXT_CHARS
  ) {
    // 删除最老 chunk
    chunks.shift()

    currentMessages = [
      ...(systemMessage ? [systemMessage] : []),

      ...chunks.flatMap((chunk) => chunk.messages),
    ]

    currentSize = getContextSize(currentMessages)
  }

  // 重建 MESSAGES
  MESSAGES.length = 0

  if (systemMessage) {
    MESSAGES.push(systemMessage)
  }

  for (const chunk of chunks) {
    MESSAGES.push(...chunk.messages)
  }
}

// ============================================
// Debug
// ============================================

export function printMessages() {
  console.log(JSON.stringify(MESSAGES, null, 2))
}

export function printChunks() {
  console.log(JSON.stringify(buildChunks(), null, 2))
}

// ============================================
// Future Runtime Hooks
// ============================================

/**
 * 后续：
 *
 * summary memory
 * semantic compression
 * episodic memory
 * working memory
 */
export function summarizeMessages() {
  return {
    summary: 'summary not implemented yet',
  }
}
