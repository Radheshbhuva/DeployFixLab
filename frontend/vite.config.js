import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        port: 5173,
        proxy: {
            '/api': {
                target: process.env.VITE_API_BASE_URL || 'http://localhost:3000',
                changeOrigin: true,
            },
            '/ws': {
                target: process.env.VITE_WS_URL || 'ws://localhost:3000',
                ws: true,
            },
        },
    },
});
