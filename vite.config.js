import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const repoName = 'Funspot-Club';

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? `/${repoName}/` : '/',
  plugins: [react()],
}));
