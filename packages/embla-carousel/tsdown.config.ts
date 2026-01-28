import { defineConfig } from 'tsdown'

export default defineConfig({
  exports: true,
  entry: 'src/**/*.ts',
  // entry: ['src/index.ts'],
  unbundle: true,
  dts: {
    build: true
  }
})
