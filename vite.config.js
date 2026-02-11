import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'
import proxyOptions from './proxyOptions';
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	server: {
		port: 8080,
		host: '0.0.0.0',
		proxy: proxyOptions,
		"/api": {
			target: "http://127.0.0.1:8000",
			changeOrigin: true,
			secure: false,
		},

	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src')
		}
	},
	build: {
		outDir: '../addis_app/public/addis',
		emptyOutDir: true,
		target: 'es2015',
	},

});
