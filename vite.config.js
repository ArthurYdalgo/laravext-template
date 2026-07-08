import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import {
    defineConfig
} from 'vite';
import tailwindcss from "@tailwindcss/vite";
// import { nativephpMobile, nativephpHotFile } from './vendor/nativephp/mobile/resources/js/vite-plugin.js';
import manifestSRI from 'vite-plugin-manifest-sri';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
            // hotFile: nativephpHotFile(), 
        }),
        react(),
        tailwindcss(),
        // nativephpMobile(),
        manifestSRI()
    ],
    esbuild: {
        jsx: 'automatic',
    },
});