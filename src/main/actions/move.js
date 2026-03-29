const fs = require('fs/promises')
const { resolveDestPath } = require('./utils')

module.exports = async function move(filePath, action) {
  await fs.access(filePath)
  const destPath = await resolveDestPath(filePath, action.destination)
  try {
    await fs.rename(filePath, destPath)
  } catch (err) {
    if (err.code === 'EXDEV') {
      // Unidades distintas en Windows: copiar y eliminar
      await fs.copyFile(filePath, destPath)
      await fs.unlink(filePath)
    } else {
      throw err
    }
  }
}
