import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Clock, MapPin, Users, Tag, Calendar, Building } from 'lucide-react'
import { format, isSameDay, isToday, isTomorrow, isYesterday } from 'date-fns'
import { ko } from 'date-fns/locale'
import { allBuildings, getBuildingById } from '../data/buildings'

const ScheduleGrid = ({ events, onEventClick, onAddEvent }) => {
  const [filter, setFilter] = useState('all') // 'all', 'today', 'week', 'month'
  const [sortBy, setSortBy] = useState('date') // 'date', 'priority', 'category'
  const [buildingFilter, setBuildingFilter] = useState('all') // 'all' or building ID

  const categories = {
    meeting: { label: '회의', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    study: { label: '스터디', color: 'bg-green-100 text-green-800 border-green-200' },
    exam: { label: '시험', color: 'bg-red-100 text-red-800 border-red-200' },
    assignment: { label: '과제', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    social: { label: '모임', color: 'bg-purple-100 text-purple-800 border-purple-200' },
    personal: { label: '개인', color: 'bg-gray-100 text-gray-800 border-gray-200' }
  }

  const priorities = {
    low: { label: '낮음', color: 'bg-green-100 text-green-800' },
    medium: { label: '보통', color: 'bg-yellow-100 text-yellow-800' },
    high: { label: '높음', color: 'bg-red-100 text-red-800' }
  }

  const getFilteredEvents = () => {
    let filtered = [...events]

    // Apply date filter
    switch (filter) {
      case 'today':
        filtered = filtered.filter(event => isToday(new Date(event.date)))
        break
      case 'week':
        const weekFromNow = new Date()
        weekFromNow.setDate(weekFromNow.getDate() + 7)
        filtered = filtered.filter(event => new Date(event.date) <= weekFromNow)
        break
      case 'month':
        const monthFromNow = new Date()
        monthFromNow.setMonth(monthFromNow.getMonth() + 1)
        filtered = filtered.filter(event => new Date(event.date) <= monthFromNow)
        break
    }

    // Apply building filter
    if (buildingFilter !== 'all') {
      filtered = filtered.filter(event => event.buildingId === buildingFilter)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        case 'category':
          return a.category.localeCompare(b.category)
        case 'date':
        default:
          return new Date(a.date) - new Date(b.date)
      }
    })

    return filtered
  }

  const getDateLabel = (date) => {
    const eventDate = new Date(date)
    if (isToday(eventDate)) return '오늘'
    if (isTomorrow(eventDate)) return '내일'
    if (isYesterday(eventDate)) return '어제'
    return format(eventDate, 'M월 d일 (E)', { locale: ko })
  }

  const filteredEvents = getFilteredEvents()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold text-kaist-blue"
        >
          일정 목록
        </motion.h2>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAddEvent}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>일정 추가</span>
        </motion.button>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-600">필터:</span>
          {['all', 'today', 'week', 'month'].map((filterOption) => (
            <motion.button
              key={filterOption}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(filterOption)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300 ${
                filter === filterOption
                  ? 'bg-kaist-blue text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {filterOption === 'all' ? '전체' : 
               filterOption === 'today' ? '오늘' :
               filterOption === 'week' ? '이번 주' : '이번 달'}
            </motion.button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-600">정렬:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-kaist-blue"
          >
            <option value="date">날짜순</option>
            <option value="priority">우선순위순</option>
            <option value="category">카테고리순</option>
          </select>
        </div>
      </div>

      {/* Building Filter */}
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-600">건물:</span>
        <select
          value={buildingFilter}
          onChange={(e) => setBuildingFilter(e.target.value)}
          className="px-3 py-1 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-kaist-blue"
        >
          <option value="all">전체 건물</option>
          {allBuildings.map(building => (
            <option key={building.id} value={building.id}>
              {building.id} - {building.name}
            </option>
          ))}
        </select>
      </div>

      {/* Events Grid */}
      <div className="space-y-4">
        {filteredEvents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-500 mb-2">일정이 없습니다</h3>
            <p className="text-gray-400 mb-4">새로운 일정을 추가해보세요</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onAddEvent}
              className="btn-primary"
            >
              일정 추가하기
            </motion.button>
          </motion.div>
        ) : (
          filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="glass-effect rounded-xl p-6 card-hover cursor-pointer"
              onClick={() => onEventClick(event)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${categories[event.category]?.color || categories.personal.color}`}>
                      {categories[event.category]?.label || '개인'}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorities[event.priority]?.color || priorities.medium.color}`}>
                      {priorities[event.priority]?.label || '보통'}
                    </span>
                  </div>
                  
                  {event.description && (
                    <p className="text-gray-600 mb-4">{event.description}</p>
                  )}
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span className="font-medium">{getDateLabel(event.date)}</span>
                    </div>
                    
                    {event.time && (
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{event.time}</span>
                      </div>
                    )}
                    
                    {event.buildingId && (
                      <div className="flex items-center space-x-2">
                        <Building className="w-4 h-4" />
                        <span>{event.buildingId} - {getBuildingById(event.buildingId)?.name}</span>
                      </div>
                    )}
                    
                    {event.location && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                    )}
                    
                    {event.participants && (
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4" />
                        <span>{event.participants}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-3 h-3 rounded-full bg-kaist-blue"
                  />
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-effect rounded-xl p-4"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-kaist-blue">{events.length}</div>
            <div className="text-sm text-gray-600">전체 일정</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {events.filter(event => isToday(new Date(event.date))).length}
            </div>
            <div className="text-sm text-gray-600">오늘 일정</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-600">
              {events.filter(event => event.priority === 'high').length}
            </div>
            <div className="text-sm text-gray-600">높은 우선순위</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {events.filter(event => event.category === 'meeting').length}
            </div>
            <div className="text-sm text-gray-600">회의</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ScheduleGrid
