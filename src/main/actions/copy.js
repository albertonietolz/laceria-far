const fs = require('fs/promises')
const { resolveDestPath } = require('./utils')

module.exports = async function copy(filePath, action) {
  await fs.access(filePath)
  const destPath = await resolveDestPath(filePath, action.destination)
  await fs.copyFile(filePath, destPath)
  return destPath
}
