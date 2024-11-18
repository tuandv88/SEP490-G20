import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
    extensions: ['.js', '.jsx']
  },
  // Cấu hình server dev
  // server: {
  // port: 3000,
  //   open: true,
  //   host: true,
  //   cors: true
  // },
  // Cấu hình build
  build: {
    outDir: 'build',
    sourcemap: true
  }
})
