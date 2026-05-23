import fs from 'fs-extra'
import path from 'path'

const WORKSPACE = path.resolve('./workspace')

export async function writeFile(args) {
  try {
    const targetPath = path.resolve(WORKSPACE, args.path)

    // 防止越界
    if (!targetPath.startsWith(WORKSPACE)) {
      throw new Error('非法路径')
    }

    // 自动创建目录
    await fs.ensureDir(path.dirname(targetPath))

    // 写文件
    await fs.writeFile(targetPath, args.content, 'utf-8')

    return {
      success: true,
      message: '文件写入成功',
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
    }
  }
}
