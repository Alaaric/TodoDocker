import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setupTests.ts', './test/vitest.setup.ts'],
    include: ['./test/**/*.{test,spec}.{js,jsx,ts,tsx}', './src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      all: true,
      include: [
        'src/'
      ],
      exclude: [
        'src/main.tsx',
        'src/vite-env.d.ts',
        'src/**/todoServiceInterface.ts',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80
      }
    }
  },
});
