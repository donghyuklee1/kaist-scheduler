import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X, ExternalLink, Copy, Check } from 'lucide-react'

const FirebaseSetupAlert = ({ isVisible, onClose }) => {
  const [copied, setCopied] = useState(false)

  const envExample = `# Firebase 설정
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(envExample)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('복사 실패:', err)
    }
  }

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 헤더 */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Firebase 설정 필요
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Firestore 400 오류 해결을 위한 설정
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </motion.button>
          </div>

          {/* 내용 */}
          <div className="p-6 space-y-6">
            {/* 문제 설명 */}
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                    현재 문제
                  </h3>
                  <p className="text-sm text-red-600 dark:text-red-400">
                    Firestore에서 400 오류가 발생하고 있습니다. 이는 Firebase 설정이 완료되지 않았기 때문입니다.
                  </p>
                </div>
              </div>
            </div>

            {/* 해결 방법 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                해결 방법
              </h3>

              {/* 1단계 */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">1</span>
                  </div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Firebase 프로젝트 생성
                  </h4>
                </div>
                <div className="ml-8 space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    1. <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center">
                      Firebase Console <ExternalLink className="w-3 h-3 ml-1" />
                    </a>에 접속
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    2. "프로젝트 추가" 클릭하여 새 프로젝트 생성
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    3. 웹 앱 추가 후 Firebase SDK 설정 복사
                  </p>
                </div>
              </div>

              {/* 2단계 */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">2</span>
                  </div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    환경 변수 설정
                  </h4>
                </div>
                <div className="ml-8 space-y-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    프로젝트 루트에 <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm">.env.local</code> 파일을 생성하고 다음 내용을 추가:
                  </p>
                  
                  <div className="relative">
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                      <code>{envExample}</code>
                    </pre>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={copyToClipboard}
                      className="absolute top-2 right-2 p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-300" />
                      )}
                    </motion.button>
                  </div>
                  
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    위의 값들을 Firebase Console에서 복사한 실제 값으로 교체하세요.
                  </p>
                </div>
              </div>

              {/* 3단계 */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">3</span>
                  </div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    개발 서버 재시작
                  </h4>
                </div>
                <div className="ml-8">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    환경 변수 설정 후 개발 서버를 재시작하세요.
                  </p>
                </div>
              </div>
            </div>

            {/* 추가 정보 */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                추가 도움말
              </h4>
              <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
                <li>• <a href="https://firebase.google.com/docs/web/setup" target="_blank" rel="noopener noreferrer" className="hover:underline inline-flex items-center">
                  Firebase 웹 설정 가이드 <ExternalLink className="w-3 h-3 ml-1" />
                </a></li>
                <li>• <a href="https://firebase.google.com/docs/firestore/security/get-started" target="_blank" rel="noopener noreferrer" className="hover:underline inline-flex items-center">
                  Firestore 보안 규칙 설정 <ExternalLink className="w-3 h-3 ml-1" />
                </a></li>
                <li>• 설정 완료 후 <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">FIREBASE_SETUP.md</code> 파일 참조</li>
              </ul>
            </div>
          </div>

          {/* 푸터 */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              나중에 설정
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.open('https://console.firebase.google.com/', '_blank')}
              className="btn-primary flex items-center space-x-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Firebase Console 열기</span>
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default FirebaseSetupAlert

