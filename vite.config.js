import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React 관련 라이브러리들을 별도 청크로 분리
          'react-vendor': ['react', 'react-dom'],
          // UI 라이브러리들을 별도 청크로 분리
          'ui-vendor': ['framer-motion', 'lucide-react'],
          // 날짜 관련 라이브러리들을 별도 청크로 분리
          'date-vendor': ['date-fns'],
          // Firebase 관련 라이브러리들을 별도 청크로 분리
          'firebase-vendor': ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage']
        }
      }
    },
    // 청크 크기 경고 임계값을 높임 (현재 500kB)
    chunkSizeWarningLimit: 1000,
    // 압축 최적화
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // 프로덕션에서 console.log 제거
        drop_debugger: true
      }
    }
  }
})
