const fs = require('fs/promises')
const path = require('path')

function pad(n) {
  return String(n).padStart(2, '0')
}

function formatDate(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function formatDatetime(d) {
  return `${formatDate(d)}_${pad(d.getHours())}-${pad(d.getMinutes())}-${pad(d.getSeconds())}`
}

module.exports = async function rename(filePath, action) {
  const ext = path.extname(filePath)
  const name = path.basename(filePath, ext)
  const dir = path.dirname(filePath)
  const now = new Date()

  const newName = action.pattern
    .replace(/\{name\}/g, name)
    .replace(/\{ext\}/g, ext.replace(/^\./, ''))
    .replace(/\{datetime\}/g, formatDatetime(now))  // antes que {date} para evitar colisión
    .replace(/\{date\}/g, formatDate(now))

  await fs.rename(filePath, path.join(dir, newName))
}
