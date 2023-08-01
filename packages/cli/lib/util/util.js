import fs from 'node:fs/promises'
import path from 'path'

/**
 * Gets a list of all files in the current directory
 * For the purposes of this program, we will not check recursively.
 * @param dirPath the path to check. Defaults to current directory.
 * @param fileList a file list to append file names to, if wanted.
 * @returns {Promise<*[]>}
 */
export async function getAllFiles (dirPath = process.cwd(), fileList = []) {
  const files = await fs.readdir(dirPath)

  for (const file of files) {
    const filePath = path.join(dirPath, file)
    const stat = await fs.stat(filePath)

    if (!stat.isDirectory()) {
      fileList.push(filePath)
    } else {
      // do not check recursively
      // await getAllFiles(filePath, fileList)
    }
  }

  return fileList
}
