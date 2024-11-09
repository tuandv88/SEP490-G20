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
<<<<<<< HEAD
    outDir: 'build' // Đặt tên thư mục output là 'build'
=======
    outDir: 'build' 
>>>>>>> d656cee91989ac401e6d0c58bc64f3c5e41e903e
  }
})
