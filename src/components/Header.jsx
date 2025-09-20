import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar as CalendarIcon, Grid, Plus, Bell, Sun, Moon, Users } from 'lucide-react'
import { useDarkMode } from '../hooks/useDarkMode'
import { useAuth } from '../contexts/AuthContext'
import UserProfile from './UserProfile'
import NotificationModal from './NotificationModal'

const Header = ({ view, setView, onAddEvent, onLogin, meetings = [], onNavigateToProfile, onNavigateToSettings }) => {
  const [isDarkMode, toggleDarkMode] = useDarkMode()
  const { user } = useAuth()
  const [showNotificationModal, setShowNotificationModal] = useState(false)

  return (
    <motion.header
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="sticky top-0 z-50 glass-effect border-b border-white/20"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setView('calendar')}
            className="flex items-center space-x-3 cursor-pointer"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-kaist-blue to-kaist-lightblue rounded-xl flex items-center justify-center">
              <CalendarIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-kaist-blue">KAIST Scheduler</h1>
              <p className="text-sm text-gray-600">스마트한 일정 관리</p>
            </div>
          </motion.button>

          {/* View Toggle */}
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setView('calendar')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                view === 'calendar'
                  ? 'bg-kaist-blue text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <CalendarIcon className="w-4 h-4" />
              <span className="font-medium">대시보드</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setView('schedule')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                view === 'schedule'
                  ? 'bg-kaist-blue text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="font-medium">📋</span>
              <span className="font-medium">스케줄</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setView('meetings')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                view === 'meetings'
                  ? 'bg-kaist-blue text-white shadow-lg'
                  : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              <Users className="w-4 h-4" />
              <span className="font-medium">모임</span>
            </motion.button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNotificationModal(true)}
              className="p-3 bg-white dark:bg-gray-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-gray-600 dark:text-gray-300 hover:text-kaist-blue dark:hover:text-blue-400"
            >
              <Bell className="w-5 h-5" />
            </motion.button>
            
            {/* 다크모드 토글 */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleDarkMode}
              className="p-3 bg-white dark:bg-gray-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-gray-600 dark:text-gray-300 hover:text-kaist-blue dark:hover:text-blue-400"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onAddEvent}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>일정 추가</span>
            </motion.button>

            {/* 사용자 프로필 또는 로그인 버튼 */}
            {user ? (
              <UserProfile 
                onNavigateToProfile={onNavigateToProfile}
                onNavigateToSettings={onNavigateToSettings}
              />
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onLogin}
                className="btn-secondary flex items-center space-x-2"
              >
                <Users className="w-4 h-4" />
                <span>로그인</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* 알림 모달 */}
      <NotificationModal 
        isOpen={showNotificationModal} 
        onClose={() => setShowNotificationModal(false)}
        meetings={meetings}
      />
    </motion.header>
  )
}

export default Header
