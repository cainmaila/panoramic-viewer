import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const build = {
  lib: {
    entry: path.resolve(__dirname, 'src/sdk/main.ts'),
    name: 'CainSDK',
    fileName: (format) => `my-lib.${format}.js`,
  },
  rollupOptions: {
    // 确保外部化处理那些你不想打包进库的依赖
    external: ['three', 'rxjs'],
    output: {
      // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
      globals: {
        THREE: 'THREE',
        rxjs: 'rxjs',
      },
    },
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  build,
  plugins: [react()],
});
