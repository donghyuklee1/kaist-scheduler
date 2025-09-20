import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Clock, MapPin, Users, Calendar as CalendarIcon } from 'lucide-react'
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns'
import { ko } from 'date-fns/locale'

const Calendar = ({ selectedDate, setSelectedDate, events, onEventClick, onDateClick }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 })
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 })

  const dateFormat = "d"
  const rows = []
  let days = []
  let day = startDate

  const getEventsForCalendarDate = (date) => {
    return events.filter(event => 
      isSameDay(new Date(event.date), date)
    )
  }

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const dayEvents = getEventsForCalendarDate(day)
      const isCurrentMonth = isSameMonth(day, monthStart)
      const isSelected = isSameDay(day, selectedDate)
      const isToday = isSameDay(day, new Date())

      days.push(
        <motion.div
          key={day}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`relative p-2 min-h-[120px] border border-gray-200 cursor-pointer transition-all duration-300 ${
            isCurrentMonth ? 'bg-white' : 'bg-gray-50'
          } ${isSelected ? 'ring-2 ring-kaist-blue bg-blue-50' : ''}`}
          onClick={() => {
            setSelectedDate(day)
            onDateClick(day)
          }}
        >
          <div className={`text-sm font-medium mb-2 ${
            isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
          } ${isToday ? 'text-kaist-blue font-bold' : ''}`}>
            {format(day, dateFormat)}
          </div>
          
          <div className="space-y-1">
            {dayEvents.slice(0, 3).map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-xs p-1 rounded bg-kaist-blue text-white truncate cursor-pointer hover:bg-kaist-lightblue transition-colors"
                onClick={(e) => {
                  e.stopPropagation()
                  onEventClick(event)
                }}
              >
                {event.title}
              </motion.div>
            ))}
            {dayEvents.length > 3 && (
              <div className="text-xs text-gray-500">
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

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold text-kaist-blue"
        >
          {format(currentMonth, 'yyyy년 M월', { locale: ko })}
        </motion.h2>
        
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={prevMonth}
            className="p-2 rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-300"
          >
            <ChevronLeft className="w-5 h-5 text-kaist-blue" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setCurrentMonth(new Date())}
            className="px-4 py-2 rounded-xl bg-kaist-blue text-white font-medium hover:bg-kaist-lightblue transition-all duration-300"
          >
            오늘
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={nextMonth}
            className="p-2 rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-300"
          >
            <ChevronRight className="w-5 h-5 text-kaist-blue" />
          </motion.button>
        </div>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-0">
        {['월', '화', '수', '목', '금', '토', '일'].map((day, index) => (
          <div key={day} className="p-3 text-center font-semibold text-gray-600 bg-gray-50 rounded-t-xl">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="space-y-0">
        {rows}
      </div>

      {/* Selected Date Info */}
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-xl p-4"
        >
          <h3 className="text-lg font-semibold text-kaist-blue mb-3">
            {format(selectedDate, 'yyyy년 M월 d일 (E)', { locale: ko })}
          </h3>
          
          <div className="space-y-2">
            {getEventsForCalendarDate(selectedDate).map((event) => (
              <motion.div
                key={event.id}
                whileHover={{ scale: 1.02 }}
                className="p-3 bg-white rounded-xl border border-gray-200 cursor-pointer hover:shadow-md transition-all duration-300"
                onClick={() => onEventClick(event)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{event.title}</h4>
                    {event.description && (
                      <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                    )}
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      {event.time && (
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{event.time}</span>
                        </div>
                      )}
                      {event.location && (
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                      )}
                      {event.participants && (
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{event.participants}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {getEventsForCalendarDate(selectedDate).length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>이 날짜에는 일정이 없습니다</p>
                <p className="text-sm">클릭하여 새 일정을 추가하세요</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default Calendar
