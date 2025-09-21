import React, { useState, useMemo, memo } from 'react'
import { motion } from 'framer-motion'
import { Plus, Calendar, Clock, MapPin, Users, Tag, Search, Filter, User, ChevronDown } from 'lucide-react'
import { format, isToday, isTomorrow, isYesterday } from 'date-fns'
import { ko } from 'date-fns/locale'
import { meetingTypes, meetingStatus, participantStatus } from '../data/meetings'

const MeetingList = ({ meetings, currentUser, onMeetingClick, onCreateMeeting, onJoinMeeting }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // 필터링된 모임 목록
  const filteredMeetings = meetings.filter(meeting => {
    const matchesSearch = meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         meeting.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === 'all' || meeting.type === filterType
    const matchesStatus = filterStatus === 'all' || meeting.status === filterStatus
    const matchesCategory = selectedCategory === 'all' || meeting.type === selectedCategory
    
    return matchesSearch && matchesType && matchesStatus && matchesCategory
  })

  // 사용자가 참여한 모임인지 확인
  const isParticipant = (meeting) => {
    return meeting.participants?.some(p => p.userId === currentUser?.uid)
  }

  // 사용자가 모임장인지 확인
  const isOwner = (meeting) => {
    return meeting.owner === currentUser?.uid
  }

  // 참여 가능한 모임인지 확인
  const canJoin = (meeting) => {
    if (isParticipant(meeting) || isOwner(meeting)) return false
    if (meeting.status !== 'open') return false
    if (meeting.maxParticipants && meeting.participants?.filter(p => p.status === 'approved' || p.status === 'owner').length >= meeting.maxParticipants) return false
    
    // 공개 범위 확인
    if (meeting.visibility === 'invite') return false // 초대 전용은 참가 불가
    
    return true
  }

  // 모집 상태에 따른 색상 반환
  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
      case 'closed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
      case 'full':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  // 모집 상태 라벨 반환
  const getStatusLabel = (status) => {
    switch (status) {
      case 'open':
        return '모집중'
      case 'closed':
        return '모집마감'
      case 'full':
        return '정원초과'
      default:
        return '상태미정'
    }
  }

  // 참여율 계산 (승인된 참여자만)
  const getParticipationRate = (meeting) => {
    if (!meeting.maxParticipants) return 0
    const approvedParticipants = meeting.participants?.filter(p => p.status === 'approved' || p.status === 'owner').length || 0
    return Math.round(approvedParticipants / meeting.maxParticipants * 100)
  }

  // 날짜 포맷팅
  const formatDateRange = (dateRange) => {
    if (!dateRange) return '날짜 미정'
    return dateRange
  }

  // 시간 포맷팅
  const formatTimeRange = (timeRange) => {
    if (!timeRange) return '시간 미정'
    return timeRange
  }

  // 카테고리 태그들
  const categories = [
    { key: 'all', label: '전체', icon: '📋' },
    { key: 'study', label: '스터디', icon: '📚' },
    { key: 'seminar', label: '세미나', icon: '🎓' },
    { key: 'project', label: '프로젝트', icon: '💻' },
    { key: 'social', label: '소셜', icon: '🎉' }
  ]

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">모임</h2>
            <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">
              다양한 주제의 모임과 스터디에 참여해보세요
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCreateMeeting}
            className="btn-primary flex items-center space-x-1 md:space-x-2 px-3 md:px-4 py-2 md:py-3"
          >
            <Plus className="w-4 h-4 md:w-5 md:h-5" />
            <span className="text-xs md:text-base hidden sm:inline">모임 개설하기</span>
            <span className="text-xs md:text-base sm:hidden">개설</span>
          </motion.button>
        </div>
      </div>

      {/* 검색 및 필터 */}
      <div className="space-y-4">
        {/* 검색바 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-kaist-blue focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
            placeholder="모임 검색..."
          />
        </div>

        {/* 필터 및 카테고리 */}
        <div className="flex flex-wrap items-center gap-2">
          {/* 상태 필터 */}
          <div className="relative">
            <Filter className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-7 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-kaist-blue bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 appearance-none text-sm"
            >
              <option value="all">모든 상태</option>
              <option value="open">모집중</option>
              <option value="closed">모집마감</option>
              <option value="full">정원초과</option>
            </select>
          </div>

          {/* 학기 필터 */}
          <div className="relative">
            <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-7 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-kaist-blue bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 appearance-none text-sm"
            >
              <option value="all">모든 학기</option>
              <option value="2025-1">2025년 1학기</option>
              <option value="2025-2">2025년 2학기</option>
              <option value="2024-1">2024년 1학기</option>
              <option value="2024-2">2024년 2학기</option>
            </select>
          </div>

          {/* 카테고리 태그들 */}
          <div className="flex items-center space-x-2">
            {categories.map((category) => (
              <motion.button
                key={category.key}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.key)}
                className={`px-2 md:px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category.key
                    ? 'bg-kaist-blue text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <span className="mr-0 md:mr-1">{category.icon}</span>
                <span className="hidden md:inline">{category.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* 모임 목록 */}
      <div className="space-y-4">
        {filteredMeetings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
          >
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">모임이 없습니다</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              새 모임을 만들거나 검색 조건을 변경해보세요!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCreateMeeting}
              className="btn-primary"
            >
              모임 만들기
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredMeetings.map((meeting) => (
              <motion.div
                key={meeting.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                {/* 카드 헤더 */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {meeting.title}
                      </h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <User className="w-4 h-4" />
                        <span>담당자: {meeting.ownerName || '미정'}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(meeting.status)}`}>
                      {getStatusLabel(meeting.status)}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    {meeting.description || '설명이 없습니다.'}
                  </p>
                </div>

                {/* 카드 본문 */}
                <div className="p-6 space-y-4">
                  {/* 기본 정보 */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600 dark:text-gray-400">
                        {formatDateRange(meeting.dateRange)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600 dark:text-gray-400">
                        {meeting.location || '장소 미정'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600 dark:text-gray-400">
                        총 {meeting.sessionCount || 0}회차
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Tag className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600 dark:text-gray-400">
                        학기: {meeting.semester || '2025년 2학기'}
                      </span>
                    </div>
                  </div>

                  {/* 신청 기간 */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      신청: {meeting.applicationPeriod || '2025. 9. 15. ~ 2025. 12. 31.'}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-medium ${
                        isParticipant(meeting) ? 'text-blue-600 dark:text-blue-400' : 
                        meeting.visibility === 'invite' ? 'text-gray-500' : 
                        'text-green-600 dark:text-green-400'
                      }`}>
                        {isParticipant(meeting) ? '참여중' : 
                         meeting.visibility === 'invite' ? '초대 전용' : 
                         '참가 신청 가능'}
                      </span>
                    </div>
                  </div>

                  {/* 참여자 현황 */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">신청 현황</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {meeting.participants?.filter(p => p.status === 'approved' || p.status === 'owner').length || 0}/{meeting.maxParticipants || '∞'}명
                      </span>
                    </div>
                    {meeting.maxParticipants && (
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div 
                          className="bg-kaist-blue h-2 rounded-full transition-all duration-300"
                          style={{ width: `${getParticipationRate(meeting)}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 카드 푸터 */}
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onMeetingClick(meeting)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-kaist-blue dark:hover:text-blue-400 transition-colors"
                    >
                      상세보기
                    </motion.button>
                    
                    {isParticipant(meeting) ? (
                      <span className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                        {isOwner(meeting) ? '개설자' : '참여중'}
                      </span>
                    ) : canJoin(meeting) ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onJoinMeeting(meeting)}
                        className="btn-primary px-4 py-2 text-sm"
                      >
                        신청하기
                      </motion.button>
                    ) : (
                      <span className="px-4 py-2 text-sm font-medium text-gray-500 bg-gray-100 dark:bg-gray-600 rounded-lg">
                        신청 불가
                      </span>
                    )}
                  </div>
                  {canJoin(meeting) && (
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                      승인 방식
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(MeetingList)