const fs = require('fs/promises')

module.exports = async function deleteFile(filePath, _action) {
  await fs.unlink(filePath)
}
