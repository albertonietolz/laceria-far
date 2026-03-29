const fs = require('fs')
const path = require('path')
const { default: pngToIco } = require('png-to-ico')

const src = path.join(__dirname, '../src/assets/tray-icon.png')
const dest = path.join(__dirname, '../src/assets/icon.ico')

pngToIco(src)
  .then(buf => {
    fs.writeFileSync(dest, buf)
    console.log(`icon.ico generado en ${dest}`)
  })
  .catch(err => {
    console.error('Error al convertir:', err.message)
    process.exit(1)
  })
