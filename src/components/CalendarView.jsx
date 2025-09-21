import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Plus, Clock, MapPin, Users, Tag, Calendar as CalendarIcon, X, Edit3, Trash2 } from 'lucide-react'
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths, isToday } from 'date-fns'
import { ko } from 'date-fns/locale'
import { createEvent, deleteEvent } from '../services/firestoreService'

const CalendarView = ({ events, onEventClick, onAddEvent, currentUser }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showDateModal, setShowDateModal] = useState(false)
  const [showEventModal, setShowEventModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: 'personal',
    priority: 'medium'
  })

  const categories = {
    meeting: { label: '회의', color: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-700' },
    study: { label: '스터디', color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700' },
    exam: { label: '시험', color: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-700' },
    assignment: { label: '과제', color: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-700' },
    social: { label: '모임', color: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-700' },
    personal: { label: '개인', color: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600' }
  }

  const priorities = {
    low: { label: '낮음', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' },
    medium: { label: '보통', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' },
    high: { label: '높음', color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' }
  }

  // 달력 데이터 생성
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 })
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 })

  const getEventsForDate = (date) => {
    return events.filter(event => 
      event.userId === currentUser?.uid && isSameDay(new Date(event.date), date)
    )
  }

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const handleDateClick = (date) => {
    setSelectedDate(date)
    setShowDateModal(true)
  }

  const handleAddEvent = () => {
    setEventForm({
      title: '',
      description: '',
      date: format(selectedDate, 'yyyy-MM-dd'),
      time: '',
      location: '',
      category: 'personal',
      priority: 'medium'
    })
    setEditingEvent(null)
    setShowEventModal(true)
  }

  const handleEditEvent = (event) => {
    setEventForm({
      title: event.title,
      description: event.description || '',
      date: format(new Date(event.date), 'yyyy-MM-dd'),
      time: event.time || '',
      location: event.location || '',
      category: event.category || 'personal',
      priority: event.priority || 'medium'
    })
    setEditingEvent(event)
    setShowEventModal(true)
  }

  const handleSaveEvent = async () => {
    if (!eventForm.title.trim()) {
      alert('제목을 입력해주세요.')
      return
    }

    try {
      const eventData = {
        ...eventForm,
        userId: currentUser.uid,
        createdAt: new Date().toISOString()
      }

      if (editingEvent) {
        // 기존 이벤트 업데이트 (deleteEvent + createEvent로 구현)
        await deleteEvent(editingEvent.id)
        await createEvent(eventData)
      } else {
        await createEvent(eventData)
      }

      setShowEventModal(false)
      setEventForm({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        category: 'personal',
        priority: 'medium'
      })
      setEditingEvent(null)
    } catch (error) {
      console.error('일정 저장 실패:', error)
      alert('일정 저장에 실패했습니다: ' + error.message)
    }
  }

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('정말로 이 일정을 삭제하시겠습니까?')) {
      try {
        await deleteEvent(eventId)
      } catch (error) {
        console.error('일정 삭제 실패:', error)
        alert('일정 삭제에 실패했습니다: ' + error.message)
      }
    }
  }

  // 달력 그리드 생성
  const renderCalendarGrid = () => {
    const rows = []
    let days = []
    let day = startDate

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const dayEvents = getEventsForDate(day)
        const isCurrentMonth = isSameMonth(day, monthStart)
        const isSelected = isSameDay(day, selectedDate)
        const isTodayDate = isToday(day)

        days.push(
          <motion.div
            key={day}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`relative p-2 min-h-[120px] border border-gray-200 dark:border-gray-700 cursor-pointer transition-all duration-300 ${
              isCurrentMonth 
                ? 'bg-white dark:bg-gray-800' 
                : 'bg-gray-50 dark:bg-gray-900'
            } ${
              isSelected 
                ? 'ring-2 ring-kaist-blue bg-blue-50 dark:bg-blue-900/20' 
                : ''
            } ${
              isTodayDate 
                ? 'bg-blue-100 dark:bg-blue-900/30' 
                : ''
            }`}
            onClick={() => handleDateClick(day)}
          >
            <div className={`text-sm font-medium mb-1 ${
              isCurrentMonth 
                ? 'text-gray-900 dark:text-gray-100' 
                : 'text-gray-400 dark:text-gray-500'
            } ${
              isTodayDate 
                ? 'text-blue-600 dark:text-blue-400 font-bold' 
                : ''
            }`}>
              {format(day, 'd')}
            </div>
            
            {/* 일정 표시 */}
            <div className="space-y-1">
              {dayEvents.slice(0, 3).map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`text-xs p-1 rounded truncate cursor-pointer ${
                    categories[event.category]?.color || categories.personal.color
                  }`}
                  onClick={(e) => {
                    e.stopPropagation()
                    onEventClick(event)
                  }}
                >
                  {event.time && `${event.time} `}{event.title}
                </motion.div>
              ))}
              {dayEvents.length > 3 && (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  +{dayEvents.length - 3}개 더
                </div>
              )}
            </div>
          </motion.div>
        )
        day = addDays(day, 1)
      }
      rows.push(
        <div key={day} className="grid grid-cols-7 gap-0">
          {days}
        </div>
      )
      days = []
    }
    return rows
  }

  return (
    <div className="space-y-6">
      {/* 달력 헤더 */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {format(currentMonth, 'yyyy년 M월', { locale: ko })}
        </h2>
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={prevMonth}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={nextMonth}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </motion.button>
        </div>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 gap-0">
        {['월', '화', '수', '목', '금', '토', '일'].map((day) => (
          <div key={day} className="p-3 text-center font-semibold text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            {day}
          </div>
        ))}
      </div>

      {/* 달력 그리드 */}
      <div className="space-y-0">
        {renderCalendarGrid()}
      </div>

      {/* 날짜별 일정 모달 */}
      <AnimatePresence>
        {showDateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {format(selectedDate, 'yyyy년 M월 d일 (E)', { locale: ko })}
                </h3>
                <button
                  onClick={() => setShowDateModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-3 mb-4">
                {getEventsForDate(selectedDate).map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-3 rounded-lg border ${
                      categories[event.category]?.color || categories.personal.color
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{event.title}</h4>
                        {event.time && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            <Clock className="w-3 h-3 inline mr-1" />
                            {event.time}
                          </p>
                        )}
                        {event.location && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            <MapPin className="w-3 h-3 inline mr-1" />
                            {event.location}
                          </p>
                        )}
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleEditEvent(event)}
                          className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {getEventsForDate(selectedDate).length === 0 && (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                    등록된 일정이 없습니다.
                  </p>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddEvent}
                className="w-full btn-primary flex items-center justify-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>일정 추가</span>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 일정 추가/편집 모달 */}
      <AnimatePresence>
        {showEventModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowEventModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {editingEvent ? '일정 수정' : '일정 추가'}
                </h3>
                <button
                  onClick={() => setShowEventModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    제목 *
                  </label>
                  <input
                    type="text"
                    value={eventForm.title}
                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    className="w-full input-field"
                    placeholder="일정 제목을 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    설명
                  </label>
                  <textarea
                    value={eventForm.description}
                    onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                    className="w-full input-field h-20 resize-none"
                    placeholder="일정 설명을 입력하세요"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      날짜 *
                    </label>
                    <input
                      type="date"
                      value={eventForm.date}
                      onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                      className="w-full input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      시간
                    </label>
                    <input
                      type="time"
                      value={eventForm.time}
                      onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                      className="w-full input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    장소
                  </label>
                  <input
                    type="text"
                    value={eventForm.location}
                    onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                    className="w-full input-field"
                    placeholder="장소를 입력하세요"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      카테고리
                    </label>
                    <select
                      value={eventForm.category}
                      onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                      className="w-full input-field"
                    >
                      {Object.entries(categories).map(([key, value]) => (
                        <option key={key} value={key}>{value.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      우선순위
                    </label>
                    <select
                      value={eventForm.priority}
                      onChange={(e) => setEventForm({ ...eventForm, priority: e.target.value })}
                      className="w-full input-field"
                    >
                      {Object.entries(priorities).map(([key, value]) => (
                        <option key={key} value={key}>{value.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowEventModal(false)}
                  className="flex-1 btn-secondary"
                >
                  취소
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSaveEvent}
                  className="flex-1 btn-primary"
                >
                  {editingEvent ? '수정' : '추가'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CalendarView
