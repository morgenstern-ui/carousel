import { defineConfig } from 'tsdown'

export default defineConfig({
  exports: true,
  entry: {
    index: './src/index.ts',
    plugins: './src/plugins.ts',
  },
  sourcemap: true,
  dts: {
    build: true,
    sourcemap: true,
  },
})
