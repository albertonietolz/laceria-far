import { defineConfig } from 'vite'
import { builtinModules } from 'module'

const external = [
  'electron',
  'chokidar',
  'adm-zip',
  ...builtinModules,
  ...builtinModules.map((m) => `node:${m}`),
]

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: 'src/main/index.js',
        preload: 'src/main/preload.js',
        store: 'src/main/store.js',
        watcher: 'src/main/watcher.js',
        'actions/utils': 'src/main/actions/utils.js',
        'actions/move': 'src/main/actions/move.js',
        'actions/copy': 'src/main/actions/copy.js',
        'actions/rename': 'src/main/actions/rename.js',
        'actions/delete': 'src/main/actions/delete.js',
        'actions/unzip': 'src/main/actions/unzip.js',
      },
      formats: ['cjs'],
      fileName: (_, entryName) => `${entryName}.js`,
    },
    outDir: 'dist/main',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      external,
    },
  },
})
