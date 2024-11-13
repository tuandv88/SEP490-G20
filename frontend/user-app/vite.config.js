import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
// import importMetaUrlPlugin from './esbuildImportMetaUrlPlugin.js'
import { viteStaticCopy } from 'vite-plugin-static-copy'

// https://vitejs.dev/config/
export default defineConfig({
  // optimizeDeps: {
  //   esbuildOptions: {
  //     plugins: [importMetaUrlPlugin]
  //   },
  //   include: ['vscode-textmate', 'vscode-oniguruma']
  // },
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'resources/*', // Thư mục chứa file tĩnh
          dest: 'resources' // Thư mục gốc của build
        }
      ]
    })
  ],
  resolve: {
    alias: {
      // eslint-disable-next-line no-undef
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    historyApiFallback: true
  },
  build: {
    outDir: 'build'
  },
  worker: {
    rollupOptions: {
      output: {
        format: 'iife',
        inlineDynamicImports: true
      }
    }
  }
})
