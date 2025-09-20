import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const LoginModal = ({ isOpen, onClose }) => {
  const { login, isKaistUser } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    setError('')
    
    try {
      await login()
      onClose()
    } catch (error) {
      if (error.code === 'auth/popup-closed-by-user') {
        setError('로그인 창이 닫혔습니다. 다시 시도해주세요.')
      } else if (error.code === 'auth/popup-blocked') {
        setError('팝업이 차단되었습니다. 브라우저 설정에서 팝업을 허용해주세요.')
      } else {
        setError('로그인 중 오류가 발생했습니다. 다시 시도해주세요.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleKaistSSO = () => {
    // KAIST SSO는 별도 구현이 필요합니다
    setError('KAIST SSO는 현재 개발 중입니다. Google 로그인을 사용해주세요.')
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 50 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl w-full max-w-md relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-kaist-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">K</span>
            </div>
            <h2 className="text-3xl font-bold text-kaist-blue dark:text-blue-400 mb-2">
              KAIST Scheduler
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              로그인하여 모임과 일정을 관리하세요
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center space-x-2"
            >
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <span className="text-red-700 dark:text-red-300 text-sm">{error}</span>
            </motion.div>
          )}

          <div className="space-y-4">
            {/* Google 로그인 */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:border-kaist-blue dark:hover:border-blue-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-kaist-blue border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              <span className="text-gray-700 dark:text-gray-200 font-medium">
                {isLoading ? '로그인 중...' : 'Google로 로그인'}
              </span>
            </motion.button>

            {/* KAIST SSO 로그인 */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleKaistSSO}
              className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-kaist-blue text-white rounded-xl hover:bg-blue-700 transition-all duration-300"
            >
              <Mail className="w-5 h-5" />
              <span className="font-medium">KAIST SSO로 로그인</span>
            </motion.button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              로그인하면{' '}
              <span className="text-kaist-blue dark:text-blue-400 font-medium">
                서비스 이용약관
              </span>
              과{' '}
              <span className="text-kaist-blue dark:text-blue-400 font-medium">
                개인정보처리방침
              </span>
              에 동의하는 것으로 간주됩니다.
            </p>
          </div>

          {/* 사용자 안내 */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
              <div>
                <p className="text-blue-700 dark:text-blue-300 text-sm font-medium">
                  지원되는 이메일
                </p>
                <p className="text-blue-600 dark:text-blue-400 text-xs">
                  @kaist.ac.kr 또는 @gmail.com 이메일로 로그인 가능합니다
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default LoginModal
