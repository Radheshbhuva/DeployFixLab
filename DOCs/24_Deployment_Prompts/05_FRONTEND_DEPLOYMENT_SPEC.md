# Frontend Deployment Specification — Vercel Edge & SPA Optimization

**Document Name:** Frontend Deployment Specification  
**Document ID:** DEP-PROMPT-005  
**Version:** 1.0.0  
**Category:** Frontend Hosting  
**Status:** Approved  

---

## 1. Vercel Configuration Blueprint (`frontend/vercel.json`)

To support client-side routing (React Router v6) and optimize asset caching headers across the global Edge CDN:

```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

---

## 2. Vite Production Build Configuration (`frontend/vite.config.ts`)

```typescript
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
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['lucide-react', 'zustand', 'clsx', 'tailwind-merge'],
        },
      },
    },
  },
  server: {
    port: 5173,
    host: true,
  },
});
```

---

## 3. Vercel CLI Manual Deployment Commands

```bash
# Install Vercel CLI globally
npm install -g vercel

# Deploy preview build
cd frontend
vercel

# Deploy to production
vercel --prod
```
