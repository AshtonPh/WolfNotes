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
                dictionary: resolve(__dirname, 'dictionary/index.html'),
                registration: resolve(__dirname, 'registration/index.html'),
                login: resolve(__dirname, 'login/index.html'),
                tags: resolve(__dirname, 'tags/index.html'),
                offline: resolve(__dirname, 'offline/index.html'),
                'offline-viewer': resolve(__dirname, 'offline-viewer/index.html')
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
                {src: 'notes/tinymce', dest: 'notes/'},
            ]
        })
    ]
})