const sharp = require('sharp')
const path = require('path')
const fs = require('fs')

async function main() {
  // Dynamic import for ESM png-to-ico
  const { default: pngToIco } = await import('png-to-ico')

  const src = path.join(__dirname, '../src/assets/laceriaico.png')
  const dest = path.join(__dirname, '../src/assets/icon.ico')

  const sizes = [16, 32, 48, 64, 128, 256]

  const buffers = await Promise.all(
    sizes.map(size =>
      sharp(src)
        .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer()
    )
  )

  const icoBuffer = await pngToIco(buffers)
  fs.writeFileSync(dest, icoBuffer)
  console.log(`icon.ico written with sizes: ${sizes.join(', ')}px`)
}

main().catch(err => { console.error(err); process.exit(1) })
