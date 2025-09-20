import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Bell, AlertCircle, CheckCircle, Clock, Users, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

const NotificationModal = ({ isOpen, onClose, meetings = [] }) => {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  // 중요 공지사항이 있는 모임들을 알림으로 변환
  useEffect(() => {
    const importantAnnouncements = []
    
    meetings.forEach(meeting => {
      if (meeting.announcements && Array.isArray(meeting.announcements)) {
        meeting.announcements.forEach(announcement => {
          if (announcement.priority === 'high' || announcement.priority === 'urgent') {
            importantAnnouncements.push({
              id: `${meeting.id}-${announcement.id}`,
              type: 'announcement',
              title: announcement.title,
              content: announcement.content,
              priority: announcement.priority,
              meetingTitle: meeting.title,
              meetingId: meeting.id,
              createdAt: announcement.createdAt,
              isRead: false
            })
          }
        })
      }
    })

    // 생성일 기준으로 정렬 (최신순)
    importantAnnouncements.sort((a, b) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt)
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt)
      return dateB - dateA
    })

    setNotifications(importantAnnouncements)
    setUnreadCount(importantAnnouncements.filter(n => !n.isRead).length)
  }, [meetings])

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    )
    setUnreadCount(0)
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-500 bg-red-100 dark:bg-red-900/20'
      case 'high':
        return 'text-orange-500 bg-orange-100 dark:bg-orange-900/20'
      default:
        return 'text-blue-500 bg-blue-100 dark:bg-blue-900/20'
    }
  }

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'urgent':
        return '긴급'
      case 'high':
        return '중요'
      default:
        return '일반'
    }
  }

  const formatDate = (date) => {
    if (!date) return '알 수 없음'
    const dateObj = date.toDate ? date.toDate() : new Date(date)
    return format(dateObj, 'MM월 dd일 HH:mm', { locale: ko })
  }

  if (!isOpen) return null

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
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-kaist-blue rounded-xl flex items-center justify-center">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">알림</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {unreadCount > 0 ? `${unreadCount}개의 읽지 않은 알림` : '모든 알림을 확인했습니다'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={markAllAsRead}
                  className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                >
                  모두 읽음
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </motion.button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {notifications.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">알림이 없습니다</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  중요 공지사항이 등록되면 여기에 표시됩니다
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl border transition-all duration-200 ${
                      notification.isRead 
                        ? 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600' 
                        : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getPriorityColor(notification.priority)}`}>
                        {notification.priority === 'urgent' ? (
                          <AlertCircle className="w-4 h-4" />
                        ) : (
                          <Bell className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(notification.priority)}`}>
                            {getPriorityLabel(notification.priority)}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(notification.createdAt)}
                          </span>
                        </div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                          {notification.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                          {notification.content}
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                          <Users className="w-3 h-3" />
                          <span>{notification.meetingTitle}</span>
                        </div>
                      </div>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default NotificationModal
