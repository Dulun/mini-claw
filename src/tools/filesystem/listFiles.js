import { globby } from 'globby'

export async function listFiles() {
  try {
    const files = await globby(['**/*'], {
      cwd: './workspace',

      // 非常重要
      ignore: ['node_modules/**', '.git/**', 'dist/**'],
    })

    return {
      success: true,
      files,
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
    }
  }
}
