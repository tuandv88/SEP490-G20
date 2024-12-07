// vite.config.js
import { defineConfig } from "file:///E:/EPPETE_FU/Semester_9_Fall_2024/SEP490_G20_Official/SEP490_G20/frontend/user-app/node_modules/vite/dist/node/index.js";
import react from "file:///E:/EPPETE_FU/Semester_9_Fall_2024/SEP490_G20_Official/SEP490_G20/frontend/user-app/node_modules/@vitejs/plugin-react-swc/index.mjs";
import path from "path";
import { viteStaticCopy } from "file:///E:/EPPETE_FU/Semester_9_Fall_2024/SEP490_G20_Official/SEP490_G20/frontend/user-app/node_modules/vite-plugin-static-copy/dist/index.js";
var __vite_injected_original_dirname = "E:\\EPPETE_FU\\Semester_9_Fall_2024\\SEP490_G20_Official\\SEP490_G20\\frontend\\user-app";
var vite_config_default = defineConfig({
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
          src: "resources/*",
          // Thư mục chứa file tĩnh
          dest: "resources"
          // Thư mục gốc của build
        }
      ]
    })
  ],
  resolve: {
    alias: {
      // eslint-disable-next-line no-undef
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  server: {
    historyApiFallback: true
  },
  build: {
    outDir: "build"
    // Đặt tên thư mục output là 'build'd656cee91989ac401e6d0c58bc64f3c5e41e903e
  },
  worker: {
    rollupOptions: {
      output: {
        format: "iife",
        inlineDynamicImports: true
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxFUFBFVEVfRlVcXFxcU2VtZXN0ZXJfOV9GYWxsXzIwMjRcXFxcU0VQNDkwX0cyMF9PZmZpY2lhbFxcXFxTRVA0OTBfRzIwXFxcXGZyb250ZW5kXFxcXHVzZXItYXBwXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJFOlxcXFxFUFBFVEVfRlVcXFxcU2VtZXN0ZXJfOV9GYWxsXzIwMjRcXFxcU0VQNDkwX0cyMF9PZmZpY2lhbFxcXFxTRVA0OTBfRzIwXFxcXGZyb250ZW5kXFxcXHVzZXItYXBwXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9FOi9FUFBFVEVfRlUvU2VtZXN0ZXJfOV9GYWxsXzIwMjQvU0VQNDkwX0cyMF9PZmZpY2lhbC9TRVA0OTBfRzIwL2Zyb250ZW5kL3VzZXItYXBwL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0LXN3YydcclxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcclxuLy8gaW1wb3J0IGltcG9ydE1ldGFVcmxQbHVnaW4gZnJvbSAnLi9lc2J1aWxkSW1wb3J0TWV0YVVybFBsdWdpbi5qcydcclxuaW1wb3J0IHsgdml0ZVN0YXRpY0NvcHkgfSBmcm9tICd2aXRlLXBsdWdpbi1zdGF0aWMtY29weSdcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgLy8gb3B0aW1pemVEZXBzOiB7XHJcbiAgLy8gICBlc2J1aWxkT3B0aW9uczoge1xyXG4gIC8vICAgICBwbHVnaW5zOiBbaW1wb3J0TWV0YVVybFBsdWdpbl1cclxuICAvLyAgIH0sXHJcbiAgLy8gICBpbmNsdWRlOiBbJ3ZzY29kZS10ZXh0bWF0ZScsICd2c2NvZGUtb25pZ3VydW1hJ11cclxuICAvLyB9LFxyXG4gIHBsdWdpbnM6IFtcclxuICAgIHJlYWN0KCksXHJcbiAgICB2aXRlU3RhdGljQ29weSh7XHJcbiAgICAgIHRhcmdldHM6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBzcmM6ICdyZXNvdXJjZXMvKicsIC8vIFRoXHUwMUIwIG1cdTFFRTVjIGNoXHUxRUU5YSBmaWxlIHRcdTAxMjluaFxyXG4gICAgICAgICAgZGVzdDogJ3Jlc291cmNlcycgLy8gVGhcdTAxQjAgbVx1MUVFNWMgZ1x1MUVEMWMgY1x1MUVFN2EgYnVpbGRcclxuICAgICAgICB9XHJcbiAgICAgIF1cclxuICAgIH0pXHJcbiAgXSxcclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczoge1xyXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWZcclxuICAgICAgJ0AnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMnKVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgc2VydmVyOiB7XHJcbiAgICBoaXN0b3J5QXBpRmFsbGJhY2s6IHRydWVcclxuICB9LFxyXG4gIGJ1aWxkOiB7XHJcbiAgICBvdXREaXI6ICdidWlsZCcgLy8gXHUwMTEwXHUxRUI3dCB0XHUwMEVBbiB0aFx1MDFCMCBtXHUxRUU1YyBvdXRwdXQgbFx1MDBFMCAnYnVpbGQnZDY1NmNlZTkxOTg5YWM0MDFlNmQwYzU4YmM2NGYzYzVlNDFlOTAzZVxyXG4gIH0sXHJcbiAgd29ya2VyOiB7XHJcbiAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgIG91dHB1dDoge1xyXG4gICAgICAgIGZvcm1hdDogJ2lpZmUnLFxyXG4gICAgICAgIGlubGluZUR5bmFtaWNJbXBvcnRzOiB0cnVlXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn0pXHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBc2IsU0FBUyxvQkFBb0I7QUFDbmQsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTtBQUVqQixTQUFTLHNCQUFzQjtBQUovQixJQUFNLG1DQUFtQztBQU96QyxJQUFPLHNCQUFRLGFBQWE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQU8xQixTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixlQUFlO0FBQUEsTUFDYixTQUFTO0FBQUEsUUFDUDtBQUFBLFVBQ0UsS0FBSztBQUFBO0FBQUEsVUFDTCxNQUFNO0FBQUE7QUFBQSxRQUNSO0FBQUEsTUFDRjtBQUFBLElBQ0YsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQTtBQUFBLE1BRUwsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLElBQ3RDO0FBQUEsRUFDRjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sb0JBQW9CO0FBQUEsRUFDdEI7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQTtBQUFBLEVBQ1Y7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLGVBQWU7QUFBQSxNQUNiLFFBQVE7QUFBQSxRQUNOLFFBQVE7QUFBQSxRQUNSLHNCQUFzQjtBQUFBLE1BQ3hCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
