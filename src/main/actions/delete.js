const fs = require('fs/promises')

module.exports = async function deleteFile(filePath, _action) {
  await fs.access(filePath)
  await fs.unlink(filePath)
  return null  // file consumed — no path to pass forward
}
