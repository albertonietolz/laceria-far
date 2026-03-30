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
  await fs.access(filePath)
  const ext = path.extname(filePath)
  const name = path.basename(filePath, ext)
  const dir = path.dirname(filePath)
  const now = new Date()

  // \.?\{ext\} absorbs an explicit dot the user may have typed before {ext}
  // and replaces it with ext-including-dot (e.g. ".pdf"), so both
  // "{name}{ext}" and "{name}.{ext}" produce "name.pdf" correctly.
  const newName = action.pattern
    .replace(/\{name\}/g, name)
    .replace(/\.?\{ext\}/g, ext)          // ext already contains the leading dot
    .replace(/\{datetime\}/g, formatDatetime(now))
    .replace(/\{date\}/g, formatDate(now))

  const newPath = path.join(dir, newName)
  await fs.rename(filePath, newPath)
  return newPath
}
