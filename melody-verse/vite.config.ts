import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server:{allowedHosts:['5173-sahilgupta584-infloso-hudpm2iducw.ws-us117.gitpod.io']}
});
