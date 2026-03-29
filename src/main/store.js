const fs = require('fs')
const path = require('path')
const { app } = require('electron')

function getRulesFilePath() {
  return path.join(app.getPath('userData'), 'rules.json')
}

function getRules() {
  const filePath = getRulesFilePath()
  if (!fs.existsSync(filePath)) return []
  try {
    const raw = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function saveRules(rules) {
  const filePath = getRulesFilePath()
  fs.writeFileSync(filePath, JSON.stringify(rules, null, 2), 'utf-8')
}

module.exports = { getRules, saveRules }
