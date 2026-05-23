import fs from 'fs-extra'
import path from 'path'

const WORKSPACE = path.resolve('./workspace')

export async function readFile(args) {
  try {
    const targetPath = path.resolve(WORKSPACE, args.path)

    // 防止 ../../ 逃逸
    if (!targetPath.startsWith(WORKSPACE)) {
      throw new Error('非法路径')
    }

    // 检查文件是否存在
    const exists = await fs.pathExists(targetPath)

    if (!exists) {
      return {
        success: false,
        error: '文件不存在',
      }
    }

    const content = await fs.readFile(targetPath, 'utf-8')

    // 防止上下文爆炸
    const MAX_LENGTH = 10000

    return {
      success: true,
      content: content.slice(0, MAX_LENGTH),
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
    }
  }
}
