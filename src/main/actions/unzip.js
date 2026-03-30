const fs = require('fs/promises')
const path = require('path')
const AdmZip = require('adm-zip')

module.exports = async function unzip(filePath, action) {
  await fs.access(filePath)
  const dest = action.destination || path.dirname(filePath)

  await fs.mkdir(dest, { recursive: true })

  const zip = new AdmZip(filePath)
  zip.extractAllTo(dest, /* overwrite */ true)

  if (action.deleteOriginal) {
    await fs.unlink(filePath)
    return null   // file consumed — no path to pass forward
  }
  return filePath // original still exists
}
