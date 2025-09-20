import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, Users, Bell, TrendingUp, MapPin, ChevronRight, AlertCircle, CheckCircle, Calendar as CalendarIcon } from 'lucide-react'
import { format, isToday, isTomorrow, isYesterday, addDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns'
import { ko } from 'date-fns/locale'

const Dashboard = ({ 
  selectedDate, 
  setSelectedDate, 
  events, 
  meetings, 
  onEventClick, 
  onDateClick,
  onViewChange,
  currentUser 
}) => {
  const [currentTime, setCurrentTime] = useState(new Date())

  // 실시간 시간 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // 다가오는 일정 (오늘부터 7일간)
  const upcomingEvents = events
    .filter(event => {
      const eventDate = new Date(event.date)
      const today = new Date()
      const weekFromNow = addDays(today, 7)
      return eventDate >= today && eventDate <= weekFromNow
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5)

  // 참여중인 모임 (승인된 모임만)
  const joinedMeetings = meetings.filter(meeting => 
    meeting.participants.some(p => 
      p.userId === currentUser?.uid && 
      (p.status === 'approved' || p.status === 'owner')
    )
  ).slice(0, 4)

  // 중요 공지사항 (모든 모임의 공지사항 중 우선순위가 높은 것들)
  const importantAnnouncements = meetings
    .flatMap(meeting => 
      meeting.announcements?.map(announcement => ({
        ...announcement,
        meetingTitle: meeting.title,
        meetingId: meeting.id
      })) || []
    )
    .filter(announcement => announcement.priority === 'high')
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3)

  // 이번 주 캘린더 데이터
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 }) // 월요일 시작
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 })
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })

  // 각 날짜별 이벤트 수
  const getEventsForDate = (date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date)
      return eventDate.toDateString() === date.toDateString()
    })
  }

  // 날짜 포맷팅 헬퍼
  const formatDate = (date) => {
    if (isToday(date)) return '오늘'
    if (isTomorrow(date)) return '내일'
    if (isYesterday(date)) return '어제'
    return format(date, 'M/d', { locale: ko })
  }

  // 시간 포맷팅 헬퍼
  const formatTime = (date) => {
    return format(date, 'HH:mm', { locale: ko })
  }

  return (
    <div className="space-y-6">
      {/* 환영 메시지 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-kaist-blue to-kaist-lightblue rounded-2xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              안녕하세요! 👋
            </h1>
            <p className="text-blue-100">
              {currentUser?.displayName || currentUser?.email || '사용자'}님의 대시보드입니다
            </p>
            <p className="text-sm text-blue-200 mt-1">
              {format(currentTime, 'yyyy년 M월 d일 EEEE', { locale: ko })} {formatTime(currentTime)}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">
              {upcomingEvents.length}
            </div>
            <div className="text-sm text-blue-200">
              다가오는 일정
            </div>
          </div>
        </div>
      </motion.div>

      {/* 메인 컨텐츠 그리드 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 왼쪽: 축소된 캘린더 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1"
        >
          <div className="glass-effect rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
                <CalendarIcon className="w-5 h-5 mr-2 text-kaist-blue" />
                이번 주
              </h2>
              <button
                onClick={() => onViewChange('schedule')}
                className="text-sm text-kaist-blue hover:text-kaist-lightblue transition-colors"
              >
                전체 보기
              </button>
            </div>

            {/* 주간 캘린더 */}
            <div className="space-y-2">
              {weekDays.map((day, index) => {
                const dayEvents = getEventsForDate(day)
                const isSelected = day.toDateString() === selectedDate.toDateString()
                
                return (
                  <motion.div
                    key={day.toISOString()}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => onDateClick(day)}
                    className={`p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'bg-kaist-blue text-white shadow-lg'
                        : 'bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className={`text-sm font-medium ${
                          isSelected ? 'text-white' : 'text-gray-600 dark:text-gray-300'
                        }`}>
                          {format(day, 'E', { locale: ko })}
                        </div>
                        <div className={`text-lg font-bold ${
                          isSelected ? 'text-white' : 'text-gray-800 dark:text-white'
                        }`}>
                          {format(day, 'd')}
                        </div>
                      </div>
                      {dayEvents.length > 0 && (
                        <div className={`flex items-center space-x-1 ${
                          isSelected ? 'text-white' : 'text-kaist-blue'
                        }`}>
                          <div className="w-2 h-2 bg-current rounded-full"></div>
                          <span className="text-xs font-medium">{dayEvents.length}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* 오른쪽: 정보 카드들 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 중요 공지사항 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-effect rounded-2xl p-6 shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
                <Bell className="w-5 h-5 mr-2 text-red-500" />
                중요 공지사항
              </h2>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <AlertCircle className="w-4 h-4 mr-1" />
                {importantAnnouncements.length}개
              </div>
            </div>

            <div className="space-y-3">
              {importantAnnouncements.length > 0 ? (
                importantAnnouncements.map((announcement) => (
                  <motion.div
                    key={announcement.id}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-xs px-2 py-1 bg-red-500 text-white rounded-full font-medium">
                            긴급
                          </span>
                          <span className="text-sm text-red-600 dark:text-red-400 font-medium">
                            {announcement.meetingTitle}
                          </span>
                        </div>
                        <h3 className="font-semibold text-red-800 dark:text-red-200 mb-1">
                          {announcement.title}
                        </h3>
                        <p className="text-sm text-red-600 dark:text-red-400 line-clamp-2">
                          {announcement.content}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-red-400 mt-1" />
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>중요한 공지사항이 없습니다</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* 다가오는 일정 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-effect rounded-2xl p-6 shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
                <Clock className="w-5 h-5 mr-2 text-green-500" />
                다가오는 일정
              </h2>
              <button
                onClick={() => onEventClick()}
                className="text-sm text-kaist-blue hover:text-kaist-lightblue transition-colors"
              >
                일정 추가
              </button>
            </div>

            <div className="space-y-3">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <motion.div
                    key={event.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => onEventClick(event)}
                    className="p-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl cursor-pointer hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 dark:text-white">
                            {event.title}
                          </h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                            <span>{formatDate(new Date(event.date))}</span>
                            {event.time && <span>• {event.time}</span>}
                            {event.location && (
                              <>
                                <span>•</span>
                                <div className="flex items-center">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  <span>{event.location}</span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>다가오는 일정이 없습니다</p>
                  <button
                    onClick={() => onEventClick()}
                    className="mt-3 text-kaist-blue hover:text-kaist-lightblue transition-colors"
                  >
                    첫 번째 일정을 추가해보세요
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          {/* 참여중인 모임 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-effect rounded-2xl p-6 shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
                <Users className="w-5 h-5 mr-2 text-purple-500" />
                참여중인 모임
              </h2>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <CheckCircle className="w-4 h-4 mr-1" />
                {joinedMeetings.length}개
              </div>
            </div>

            <div className="space-y-3">
              {joinedMeetings.length > 0 ? (
                joinedMeetings.map((meeting) => (
                  <motion.div
                    key={meeting.id}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 dark:text-white">
                            {meeting.title}
                          </h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                            <span className="capitalize">{meeting.type}</span>
                            <span>•</span>
                            <span>{meeting.participants.length}명 참여</span>
                            {meeting.location && (
                              <>
                                <span>•</span>
                                <div className="flex items-center">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  <span>{meeting.location}</span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>참여중인 모임이 없습니다</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* 하단 통계 카드 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <div className="glass-effect rounded-xl p-4 text-center">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-gray-800 dark:text-white">
            {events.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            총 일정
          </div>
        </div>

        <div className="glass-effect rounded-xl p-4 text-center">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div className="text-2xl font-bold text-gray-800 dark:text-white">
            {joinedMeetings.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            참여 모임
          </div>
        </div>

        <div className="glass-effect rounded-xl p-4 text-center">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Bell className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <div className="text-2xl font-bold text-gray-800 dark:text-white">
            {importantAnnouncements.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            중요 공지
          </div>
        </div>

        <div className="glass-effect rounded-xl p-4 text-center">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-2">
            <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-gray-800 dark:text-white">
            {upcomingEvents.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            이번 주 일정
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard
