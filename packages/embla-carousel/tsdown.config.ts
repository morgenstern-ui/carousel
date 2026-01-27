import { defineConfig } from 'tsdown'

export default defineConfig({
  exports: true,
  entry: ['./src/index.ts'],
  sourcemap: true,
  dts: {
    build: true,
    sourcemap: true,
  },
})
