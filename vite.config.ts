import type { Plugin } from 'vite';

import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

/** Chrome DevTools probes `/.well-known/...`; answer before React Router to avoid noisy 404 stacks in dev. */
function stubWellKnownPlugin(): Plugin {
  return {
    name: 'stub-well-known',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const pathname = req.url?.split('?')[0] ?? '';
        if (pathname.startsWith('/.well-known/')) {
          res.statusCode = 204;
          res.end();
          return;
        }
        next();
      });
    },
  };
}

const sslKeyPath = resolve(__dirname, 'backoffice.myenglish.com-key.pem');
const sslCertPath = resolve(__dirname, 'backoffice.myenglish.com.pem');
const hasSslFiles = existsSync(sslKeyPath) && existsSync(sslCertPath);
const devServerPort = 5173;

const serverConfig = hasSslFiles
  ? {
      host: '0.0.0.0',
      port: devServerPort,
      strictPort: true,
      https: {
        key: readFileSync(sslKeyPath),
        cert: readFileSync(sslCertPath),
      },
      hmr: {
        protocol: 'wss',
        host: 'backoffice.myenglish.com',
        clientPort: devServerPort,
      },
    }
  : undefined;

export default defineConfig({
  plugins: [stubWellKnownPlugin(), reactRouter(), tailwindcss(), svgr()],
  server: serverConfig,
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
