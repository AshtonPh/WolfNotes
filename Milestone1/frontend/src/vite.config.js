import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
    base: '',
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'home/index.html'),
                note: resolve(__dirname, 'notes/index.html'),
                registration: resolve(__dirname, 'registration/index.html'),
                signin: resolve(__dirname, 'signin/index.html'),
                demo: resolve(__dirname, 'demo/index.html')
            }
        }
    }
})