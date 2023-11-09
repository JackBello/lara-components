import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
    plugins: [
        dts({ include: ['lib'] })
    ],
    build: {
        copyPublicDir: false,
        lib: {
            entry: resolve(__dirname, 'lib/main.ts'),
            name: 'LaraComponents',
            formats: ['umd', 'cjs', 'iife', 'es'],
            fileName: (format) => `lara-components.${format}.js`,
        }
    }
})