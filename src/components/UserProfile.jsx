import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, LogOut, Settings, ChevronDown } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const UserProfile = ({ onNavigateToProfile, onNavigateToSettings }) => {
  const { user, logout, isKaistUser } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      setIsOpen(false)
    } catch (error) {
      console.error('로그아웃 실패:', error)
    }
  }

  const getUserDisplayName = () => {
    if (user?.displayName) return user.displayName
    if (user?.email) return user.email.split('@')[0]
    return '사용자'
  }

  const getUserInitials = () => {
    const name = getUserDisplayName()
    return name.charAt(0).toUpperCase()
  }

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 rounded-xl hover:bg-white/50 dark:hover:bg-gray-700/50 transition-all duration-300"
      >
        {user?.photoURL ? (
          <img 
            src={user.photoURL} 
            alt={getUserDisplayName()}
            className="w-8 h-8 rounded-full object-cover"
            onError={(e) => {
              // 이미지 로드 실패 시 기본 아바타 표시
              e.target.style.display = 'none'
              e.target.nextElementSibling.style.display = 'flex'
            }}
          />
        ) : null}
        <div 
          className={`w-8 h-8 bg-kaist-blue rounded-full flex items-center justify-center text-white font-bold text-sm ${user?.photoURL ? 'hidden' : ''}`}
        >
          {getUserInitials()}
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
            {getUserDisplayName()}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {isKaistUser ? (user?.email?.endsWith('@kaist.ac.kr') ? 'KAIST 구성원' : 'Gmail 사용자') : '외부 사용자'}
          </p>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50"
          >
            {/* 사용자 정보 */}
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-kaist-blue rounded-full flex items-center justify-center text-white font-bold">
                  {getUserInitials()}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {getUserDisplayName()}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {user?.email}
                  </p>
                  {isKaistUser && (
                    <span className="inline-block mt-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                      {user?.email?.endsWith('@kaist.ac.kr') ? 'KAIST 구성원' : 'Gmail 사용자'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* 메뉴 항목들 */}
            <div className="py-2">
              <motion.button
                whileHover={{ backgroundColor: 'rgba(0, 65, 145, 0.1)' }}
                onClick={() => {
                  onNavigateToProfile()
                  setIsOpen(false)
                }}
                className="w-full flex items-center space-x-3 px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                <User className="w-4 h-4" />
                <span>프로필</span>
              </motion.button>

              <motion.button
                whileHover={{ backgroundColor: 'rgba(0, 65, 145, 0.1)' }}
                onClick={() => {
                  onNavigateToSettings()
                  setIsOpen(false)
                }}
                className="w-full flex items-center space-x-3 px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span>설정</span>
              </motion.button>

            </div>

            {/* 로그아웃 */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
              <motion.button
                whileHover={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-2 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>로그아웃</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}

export default UserProfile
