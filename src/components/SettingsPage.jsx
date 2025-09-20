import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Settings, LogOut, Shield, Bell, Moon, Sun, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useDarkMode } from '../hooks/useDarkMode'

const SettingsPage = ({ onBack }) => {
  const { user, logout } = useAuth()
  const [isDarkMode, toggleDarkMode] = useDarkMode()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
      setShowLogoutConfirm(false)
      onBack()
    } catch (error) {
      console.error('로그아웃 실패:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="sticky top-0 z-40 glass-effect border-b border-white/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="p-2 rounded-xl bg-white dark:bg-gray-700 shadow-md hover:shadow-lg transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </motion.button>

            <div>
              <h1 className="text-2xl font-bold text-kaist-blue dark:text-white">설정</h1>
              <p className="text-gray-600 dark:text-gray-300">계정 및 앱 설정</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto space-y-6"
        >
          {/* 계정 정보 */}
          <div className="glass-effect rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2 mb-4">
              <Shield className="w-5 h-5 text-kaist-blue" />
              <span>계정 정보</span>
            </h3>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">이메일</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{user?.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">계정 타입</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.email?.endsWith('@kaist.ac.kr') ? 'KAIST 구성원' : 'Gmail 사용자'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">가입일</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString('ko-KR') : '알 수 없음'}
                </span>
              </div>
            </div>
          </div>

          {/* 앱 설정 */}
          <div className="glass-effect rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2 mb-4">
              <Bell className="w-5 h-5 text-kaist-blue" />
              <span>앱 설정</span>
            </h3>
            
            <div className="space-y-4">
              {/* 다크모드 토글 */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={toggleDarkMode}
                className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  {isDarkMode ? <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" /> : <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />}
                  <div className="text-left">
                    <p className="font-medium text-gray-900 dark:text-white">다크 모드</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {isDarkMode ? '다크 모드가 활성화되어 있습니다' : '라이트 모드가 활성화되어 있습니다'}
                    </p>
                  </div>
                </div>
                <div className={`w-12 h-6 rounded-full transition-colors ${isDarkMode ? 'bg-kaist-blue' : 'bg-gray-300'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-0.5'} mt-0.5`}></div>
                </div>
              </motion.button>

              {/* 알림 설정 */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900 dark:text-white">알림</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">중요 공지사항 알림</p>
                  </div>
                </div>
                <div className="w-12 h-6 bg-kaist-blue rounded-full transition-colors">
                  <div className="w-5 h-5 bg-white rounded-full shadow-md transform translate-x-6 mt-0.5"></div>
                </div>
              </motion.button>
            </div>
          </div>

          {/* 계정 관리 */}
          <div className="glass-effect rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2 mb-4">
              <LogOut className="w-5 h-5 text-red-500" />
              <span>계정 관리</span>
            </h3>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full flex items-center justify-center space-x-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-red-600 dark:text-red-400"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">로그아웃</span>
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* 로그아웃 확인 모달 */}
      {showLogoutConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm p-6"
          >
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">로그아웃</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  정말로 로그아웃하시겠습니까?
                </p>
              </div>
              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  취소
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  {isLoggingOut ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>로그아웃 중...</span>
                    </>
                  ) : (
                    <>
                      <LogOut className="w-4 h-4" />
                      <span>로그아웃</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default SettingsPage
