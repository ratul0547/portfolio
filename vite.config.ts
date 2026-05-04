import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import CONFIG from './gitprofile.config';

// https://vitejs.dev/config/
export default defineConfig({
  base: CONFIG.base || '/',
  plugins: [react()],
  define: {
    CONFIG: CONFIG,
  },
});
