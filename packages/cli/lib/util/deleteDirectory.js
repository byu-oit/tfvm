import fs from 'node:fs/promises'

async function deleteDirectory (baseDirectory, removeDir) {
  const baseDirFiles = await fs.readdir(baseDirectory)
  if (baseDirFiles.includes(removeDir)) {
    const fullPath = baseDirectory.concat('\\').concat(removeDir)
    const files = await fs.readdir(fullPath)
    for (const file of files) {
      await fs.unlink(fullPath + '\\' + file)
    }
    await fs.rmdir(fullPath)
  }
}

export default deleteDirectory
