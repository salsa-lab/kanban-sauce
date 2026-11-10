import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  root: resolve(__dirname, 'src/webview'),
  build: {
    outDir: resolve(__dirname, 'dist/webview'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'src/webview/main.tsx')
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name]-[hash].js',
        assetFileNames: '[name].[ext]',
        // Split vendor deps into separate chunks for parallel loading
        manualChunks(id) {
          const nmIndex = id.lastIndexOf('node_modules/')
          if (nmIndex === -1) return
          const pkgPath = id.slice(nmIndex + 'node_modules/'.length)

          if (pkgPath.startsWith('react/') || pkgPath.startsWith('react-dom/') || pkgPath.startsWith('scheduler/')) {
            return 'react-vendor'
          }
          if (pkgPath.startsWith('lucide-react/') || pkgPath.startsWith('@radix-ui/react-icons/')) {
            return 'icons'
          }
          if (pkgPath.startsWith('@lezer/')) {
            return 'lezer'
          }
          if (
            pkgPath.startsWith('@codemirror/state/') ||
            pkgPath.startsWith('@codemirror/view/') ||
            pkgPath.startsWith('style-mod/') ||
            pkgPath.startsWith('w3c-keyname/') ||
            pkgPath.startsWith('crelt/')
          ) {
            return 'codemirror-core'
          }
          if (pkgPath.startsWith('@codemirror/') || pkgPath.startsWith('codemirror/') || pkgPath.startsWith('diff/')) {
            return 'codemirror-ext'
          }
          if (pkgPath.startsWith('lexical/') || pkgPath.startsWith('@lexical/')) {
            return 'lexical'
          }
          if (pkgPath.startsWith('micromark') || pkgPath.startsWith('mdast-') || pkgPath.startsWith('unist-')) {
            return 'markdown-parser'
          }
          if (pkgPath.startsWith('@mdxeditor/')) {
            return 'mdxeditor'
          }
          if (pkgPath.startsWith('@radix-ui/') || pkgPath.startsWith('@floating-ui/') || pkgPath.startsWith('downshift/')) {
            return 'ui-vendor'
          }
        }
      }
    },
    cssCodeSplit: false,
    sourcemap: true,
    // Optimize chunk size
    chunkSizeWarningLimit: 300
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})
