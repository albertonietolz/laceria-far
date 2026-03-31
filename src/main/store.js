const fs = require('fs')
const path = require('path')
const { app } = require('electron')
const crypto = require('crypto')

function getRulesFilePath() {
  return path.join(app.getPath('userData'), 'rules.json')
}

function getCategoriesFilePath() {
  return path.join(app.getPath('userData'), 'categories.json')
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

function getCategories() {
  const filePath = getCategoriesFilePath()
  if (!fs.existsSync(filePath)) return []
  try {
    const raw = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function saveCategories(categories) {
  const filePath = getCategoriesFilePath()
  fs.writeFileSync(filePath, JSON.stringify(categories, null, 2), 'utf-8')
}

function saveCategory(category) {
  const categories = getCategories()
  if (!category.id) {
    category.id = crypto.randomUUID()
    categories.push(category)
  } else {
    const idx = categories.findIndex((c) => c.id === category.id)
    if (idx !== -1) {
      categories[idx] = category
    } else {
      categories.push(category)
    }
  }
  saveCategories(categories)
  return category
}

function deleteCategory(id) {
  saveCategories(getCategories().filter((c) => c.id !== id))
  saveRules(getRules().filter((r) => r.categoryId !== id))
  return id
}

module.exports = { getRules, saveRules, getCategories, saveCategory, deleteCategory }
