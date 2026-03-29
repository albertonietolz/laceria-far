const fs = require('fs/promises')
const path = require('path')

/**
 * Resuelve un destino libre de colisiones.
 * Si "dir/file.ext" ya existe prueba "dir/file (1).ext", "dir/file (2).ext", etc.
 */
async function resolveDestPath(srcPath, destDir) {
  const ext = path.extname(srcPath)
  const base = path.basename(srcPath, ext)
  let candidate = path.join(destDir, path.basename(srcPath))
  let counter = 1
  while (true) {
    try {
      await fs.access(candidate)
      candidate = path.join(destDir, `${base} (${counter})${ext}`)
      counter++
    } catch {
      return candidate
    }
  }
}

module.exports = { resolveDestPath }
