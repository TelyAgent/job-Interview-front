import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Isolate only the SDK document; leave the main app and OAuth popup unchanged.
const zoomIsolation = (): Plugin => {
  const install = (server: { middlewares: { use: (handler: (req: { url?: string }, res: { setHeader: (name: string, value: string) => void }, next: () => void) => void) => void } }) => {
    server.middlewares.use((req, res, next) => {
      if (req.url?.split('?')[0] === '/zoom-meeting/index.html') {
        res.setHeader('Document-Isolation-Policy', 'isolate-and-credentialless');
      }
      next();
    });
  };
  return { name: 'zoom-document-isolation', configureServer: install, configurePreviewServer: install };
};

export default defineConfig({
  plugins: [react(), tailwindcss(), zoomIsolation()],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: process.env.API_PROXY_TARGET || 'http://127.0.0.1:3001',
        changeOrigin: true,
      },
    },
  },
});
