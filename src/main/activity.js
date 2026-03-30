const { app } = require('electron')
const path = require('path')
const fs = require('fs')

const MAX_ENTRIES = 500

function getActivityPath() {
  return path.join(app.getPath('userData'), 'activity.json')
}

function readActivity() {
  try {
    return JSON.parse(fs.readFileSync(getActivityPath(), 'utf8'))
  } catch {
    return []
  }
}

function writeActivity(entries) {
  try {
    fs.writeFileSync(getActivityPath(), JSON.stringify(entries), 'utf8')
  } catch (err) {
    console.error('[activity] Failed to write:', err.message)
  }
}

function addActivity(entry) {
  const entries = readActivity()
  entries.unshift(entry)
  if (entries.length > MAX_ENTRIES) entries.length = MAX_ENTRIES
  writeActivity(entries)
  return entry
}

function clearActivity() {
  writeActivity([])
}

module.exports = { readActivity, addActivity, clearActivity }
