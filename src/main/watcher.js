const chokidar = require('chokidar')
const path = require('path')
const fs = require('fs')
const crypto = require('crypto')
const { getRules } = require('./store')
const { addActivity } = require('./activity')

const move = require('./actions/move')
const copy = require('./actions/copy')
const rename = require('./actions/rename')
const deleteFile = require('./actions/delete')
const unzip = require('./actions/unzip')

const ACTION_MAP = { move, copy, rename, delete: deleteFile, unzip }

/** @type {Map<string, import('chokidar').FSWatcher>} */
const watchers = new Map()
let paused = false
let mainWindow = null

/** @type {Set<string>} categoryIds that are individually paused */
const pausedCategories = new Set()

// ── Anti-loop protection ───────────────────────────────────────────────────

const processingFiles = new Set()

function markProcessing(filePath) {
  processingFiles.add(filePath)
  setTimeout(() => processingFiles.delete(filePath), 3000)
}

function setMainWindow(win) {
  mainWindow = win
}

function sendNotification(type, rule, actionType, message) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('notification', { type, rule, action: actionType, message })
  }
}

function sendActivityNew(entry) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('activity:new', entry)
  }
}

// ── File metadata ──────────────────────────────────────────────────────────

function getFileFields(filePath) {
  return new Promise((resolve, reject) => {
    fs.stat(filePath, (err, stats) => {
      if (err) return reject(err)
      resolve({
        extension: path.extname(filePath).replace(/^\./, '').toLowerCase(),
        name: path.basename(filePath, path.extname(filePath)),
        size: stats.size,
        createdAt: stats.birthtimeMs,
      })
    })
  })
}

// ── Condition evaluation ───────────────────────────────────────────────────

function evaluateCondition(condition, fields) {
  const raw = fields[condition.field]
  const val = condition.value
  let result

  switch (condition.operator) {
    case 'equals':
      result = String(raw).toLowerCase() === String(val).toLowerCase()
      break
    case 'contains':
      result = String(raw).toLowerCase().includes(String(val).toLowerCase())
      break
    case 'startsWith':
      result = String(raw).toLowerCase().startsWith(String(val).toLowerCase())
      break
    case 'endsWith':
      result = String(raw).toLowerCase().endsWith(String(val).toLowerCase())
      break
    case 'greaterThan':
      result = Number(raw) > Number(val)
      break
    case 'lessThan':
      result = Number(raw) < Number(val)
      break
    default:
      console.error(`[watcher] Unknown operator: "${condition.operator}"`)
      result = false
  }

  console.log(
    `[watcher]   condition: ${condition.field} ${condition.operator} "${val}" → field value="${raw}" → ${result ? 'PASS' : 'FAIL'}`
  )
  return result
}

function evaluateRule(rule, fields) {
  if (!rule.conditions || rule.conditions.length === 0) return true
  const evaluate = (c) => evaluateCondition(c, fields)
  return rule.conditionOperator === 'OR'
    ? rule.conditions.some(evaluate)
    : rule.conditions.every(evaluate)
}

// ── Action execution ───────────────────────────────────────────────────────

async function executeActions(rule, filePath) {
  let currentPath = filePath

  for (const action of rule.actions) {
    const handler = ACTION_MAP[action.type]
    if (!handler) {
      console.error(`[watcher] Unknown action type: "${action.type}"`)
      continue
    }

    const pathBeforeAction = currentPath
    try {
      const newPath = await handler(currentPath, action)
      console.log(
        `[watcher] Action "${action.type}" succeeded: "${pathBeforeAction}" → "${newPath ?? 'consumed'}"`
      )
      if (newPath) {
        markProcessing(newPath)
        currentPath = newPath
      }
      sendNotification('success', rule.name, action.type, null)
      const entry = addActivity({
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        ruleName: rule.name,
        filePath: pathBeforeAction,
        action: action.type,
        status: 'success',
        message: null,
      })
      sendActivityNew(entry)
      if (newPath === null) break  // file consumed (delete / unzip+deleteOriginal)
    } catch (err) {
      console.error(`[watcher] Action "${action.type}" failed for "${pathBeforeAction}":`, err.message)
      sendNotification('error', rule.name, action.type, err.message)
      const entry = addActivity({
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        ruleName: rule.name,
        filePath: pathBeforeAction,
        action: action.type,
        status: 'error',
        message: err.message,
      })
      sendActivityNew(entry)
      break  // stop chain — file may be in unknown state
    }
  }
}

// ── File event handler ─────────────────────────────────────────────────────

async function handleFileAdded(filePath) {
  if (paused) return

  console.log(`[watcher] 'add' event → "${filePath}"`)

  let fields
  try {
    fields = await getFileFields(filePath)
  } catch (err) {
    console.error(`[watcher] Could not stat "${filePath}":`, err.message)
    return
  }

  console.log(`[watcher] file fields → name="${fields.name}" extension="${fields.extension}" size=${fields.size}`)

  const folder = path.normalize(path.dirname(filePath))
  const matchingRules = getRules().filter(
    (r) => r.enabled && path.normalize(r.watchPath) === folder,
  )

  for (const rule of matchingRules) {
    if (rule.categoryId && pausedCategories.has(rule.categoryId)) {
      console.log(`[watcher] Rule "${rule.name}" skipped — category "${rule.categoryId}" is paused`)
      continue
    }
    if (rule.ignoreProcessed && processingFiles.has(filePath)) {
      console.log(`[watcher] Rule "${rule.name}" skipped — ignoreProcessed=true and file in processingFiles`)
      continue
    }
    if (evaluateRule(rule, fields)) {
      console.log(`[watcher] Rule "${rule.name}" matched → "${filePath}"`)
      await executeActions(rule, filePath)
    }
  }
}

// ── Public API ─────────────────────────────────────────────────────────────

function initWatchers() {
  stopWatchers()

  const allRules = getRules()
  console.log(`[watcher] initWatchers — ${allRules.length} rule(s) loaded:`)
  allRules.forEach((r) =>
    console.log(`[watcher]   id=${r.id} name="${r.name}" enabled=${r.enabled} watch="${r.watch}" watchPath="${r.watchPath}"`)
  )

  const rules = allRules.filter((r) => r.enabled)
  const watchPaths = [...new Set(rules.map((r) => r.watchPath))]

  for (const watchPath of watchPaths) {
    const watcher = chokidar.watch(watchPath, {
      ignoreInitial: true,
      depth: 0,
      usePolling: false,
      awaitWriteFinish: true,
    })

    watcher.on('add', (filePath) => handleFileAdded(filePath))
    watcher.on('error', (err) =>
      console.error(`[watcher] Error on "${watchPath}":`, err),
    )

    watchers.set(watchPath, watcher)
    console.log(`[watcher] Watching "${watchPath}"`)
  }
}

function stopWatchers() {
  for (const [watchPath, watcher] of watchers) {
    watcher.close()
    console.log(`[watcher] Stopped "${watchPath}"`)
  }
  watchers.clear()
}

function pauseWatchers() {
  paused = true
  console.log('[watcher] Paused')
}

function resumeWatchers() {
  paused = false
  console.log('[watcher] Resumed')
}

function pauseCategory(categoryId) {
  pausedCategories.add(categoryId)
  console.log(`[watcher] Category "${categoryId}" paused`)
}

function resumeCategory(categoryId) {
  pausedCategories.delete(categoryId)
  console.log(`[watcher] Category "${categoryId}" resumed`)
}

module.exports = { initWatchers, stopWatchers, pauseWatchers, resumeWatchers, pauseCategory, resumeCategory, setMainWindow }
