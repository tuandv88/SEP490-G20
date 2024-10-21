import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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
    outDir: 'build' // Đặt tên thư mục output là 'build'
  },
  esbuild: {
    loader: 'jsx', // Cấu hình esbuild để xử lý JSX trong file .js
    include: /src\/.*\.js$/,
    exclude: [] // Chỉ định các file .js trong thư mục src có JSX
  }
})
