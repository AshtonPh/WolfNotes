import { resolve } from 'path'
import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

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
    },
    server: {
        port: process.env.PORT || 80,
        host: "0.0.0.0"
    },
    plugins: [
        viteStaticCopy({
            targets: [
                {src: 'notes/images/*', dest: 'notes/images/'},
                {src: 'notes/tinymce', dest: 'notes/'}
            ]
        })
    ]
})