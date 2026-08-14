import { copyFileSync, existsSync } from 'node:fs'
import { resolve, join } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import markdown from './tools/vite-plugin-markdown.js'

// `base` comes from PAGES_BASE, defaulting to '/' — which is what Vercel wants.
const base = process.env.PAGES_BASE || '/'

// Filled in by configResolved, below.
let outDir = resolve('dist')

export default defineConfig({
  base,
  plugins: [
    markdown(),
    react(),
    {
      // Static hosts only know about index.html. Writing a copy to 404.html
      // gives the same SPA fallback on hosts that use it. The output directory
      // is read from the resolved config rather than assumed to be ./dist.
      name: 'younit-404-fallback',
      apply: 'build',
      configResolved(config) {
        outDir = resolve(config.root, config.build.outDir)
      },
      closeBundle() {
        const index = join(outDir, 'index.html')
        if (existsSync(index)) copyFileSync(index, join(outDir, '404.html'))
      },
    },
  ],
  server: { host: true, port: 5173 },
})
