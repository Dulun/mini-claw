export const TOOL_SCHEMAS = [
  {
    type: 'function',
    function: {
      name: 'readFile',
      description: '读取文件内容',
      parameters: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: '文件路径',
          },
        },
        required: ['path'],
      },
    },
  },

  {
    type: 'function',
    function: {
      name: 'writeFile',
      description: '写入文件',
      parameters: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
          },
          content: {
            type: 'string',
          },
        },
        required: ['path', 'content'],
      },
    },
  },

  {
    type: 'function',
    function: {
      name: 'listFiles',
      description: '列出文件',
      parameters: {
        type: 'object',
        properties: {},
      },
    },
  },
]
