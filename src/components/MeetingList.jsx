import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Calendar, Clock, MapPin, Users, Tag, Search, Filter } from 'lucide-react'
import { format, isToday, isTomorrow, isYesterday } from 'date-fns'
import { ko } from 'date-fns/locale'
import { meetingTypes, meetingStatus, participantStatus } from '../data/meetings'

const MeetingList = ({ meetings, currentUser, onMeetingClick, onCreateMeeting, onJoinMeeting }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  // 필터링된 모임 목록
  const filteredMeetings = meetings.filter(meeting => {
    const matchesSearch = meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         meeting.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === 'all' || meeting.type === filterType
    const matchesStatus = filterStatus === 'all' || meeting.status === filterStatus
    
    return matchesSearch && matchesType && matchesStatus
  })

  // 사용자가 참여한 모임인지 확인
  const isParticipant = (meeting) => {
    return meeting.participants.some(p => p.userId === currentUser.id)
  }

  // 사용자가 모임장인지 확인
  const isOwner = (meeting) => {
    return meeting.owner === currentUser.id
  }

  // 참여 가능한 모임인지 확인
  const canJoin = (meeting) => {
    if (isParticipant(meeting) || isOwner(meeting)) return false
    if (meeting.status !== 'open') return false
    if (meeting.maxParticipants && meeting.participants.length >= meeting.maxParticipants) return false
    return true
  }

  // 날짜 라벨 생성
  const getDateLabel = (date) => {
    if (!date) return '날짜 미정'
    
    const eventDate = new Date(date)
    
    // 유효하지 않은 날짜 체크
    if (isNaN(eventDate.getTime())) {
      return '날짜 오류'
    }
    
    if (isToday(eventDate)) return '오늘'
    if (isTomorrow(eventDate)) return '내일'
    if (isYesterday(eventDate)) return '어제'
    return format(eventDate, 'M월 d일', { locale: ko })
  }

  // 상태별 색상
  const getStatusColor = (status) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'open': return 'bg-green-100 text-green-800'
      case 'closed': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed': return 'bg-blue-100 text-blue-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // 상태별 라벨
  const getStatusLabel = (status) => {
    switch (status) {
      case 'draft': return '초안'
      case 'open': return '참여 신청 중'
      case 'closed': return '신청 마감'
      case 'confirmed': return '확정'
      case 'cancelled': return '취소'
      default: return status
    }
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-kaist-blue">모임 목록</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCreateMeeting}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>새 모임 만들기</span>
        </motion.button>
      </div>

      {/* 검색 및 필터 */}
      <div className="flex flex-wrap items-center gap-4">
        {/* 검색 */}
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10"
            placeholder="모임 검색..."
          />
        </div>

        {/* 타입 필터 */}
        <div className="relative">
          <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="input-field pl-10 pr-8"
          >
            <option value="all">모든 타입</option>
            {Object.entries(meetingTypes).map(([key, type]) => (
              <option key={key} value={key}>
                {type.icon} {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* 상태 필터 */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-field pl-10 pr-8"
          >
            <option value="all">모든 상태</option>
            <option value="open">참여 신청 중</option>
            <option value="confirmed">확정</option>
            <option value="closed">신청 마감</option>
          </select>
        </div>
      </div>

      {/* 모임 목록 */}
      <div className="space-y-4">
        {filteredMeetings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-500 py-10 glass-effect rounded-xl"
          >
            <p className="text-lg font-medium mb-2">모임이 없습니다.</p>
            <p>새 모임을 만들거나 검색 조건을 변경해보세요!</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMeetings.map(meeting => (
              <motion.div
                key={meeting.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.3 }}
                onClick={() => onMeetingClick(meeting)}
                className="glass-effect card-hover p-6 rounded-xl cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* 헤더 */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-4 py-2 rounded-full text-sm font-bold ${meetingTypes[meeting.type]?.color} bg-opacity-30 shadow-md border-2 border-white`}>
                      {meetingTypes[meeting.type]?.icon} {meetingTypes[meeting.type]?.label}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(meeting.status)}`}>
                      {getStatusLabel(meeting.status)}
                    </span>
                  </div>

                  {/* 제목 */}
                  <h3 className="text-xl font-semibold text-kaist-darkgray mb-2">{meeting.title}</h3>

                  {/* 설명 */}
                  {meeting.description && (
                    <p className="text-gray-600 mb-4 line-clamp-2">{meeting.description}</p>
                  )}

                  {/* 정보 */}
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>시간 조율 중</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>참여자들과 협의</span>
                    </div>

                    {meeting.location && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>{meeting.location}</span>
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>
                        {meeting.participants.length}명 참여
                        {meeting.maxParticipants && ` / 최대 ${meeting.maxParticipants}명`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 액션 버튼 */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-2 h-2 rounded-full bg-kaist-blue"
                    ></motion.div>
                    <span className="text-xs text-gray-500 font-medium">
                      생성: {meeting.createdAt ? format(new Date(meeting.createdAt), 'yyyy.MM.dd', { locale: ko }) : '날짜 미정'}
                    </span>
                  </div>

                  {canJoin(meeting) && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        onJoinMeeting(meeting)
                      }}
                      className="px-3 py-1 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600 transition-colors"
                    >
                      참여 신청
                    </motion.button>
                  )}

                  {isParticipant(meeting) && !isOwner(meeting) && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-lg">
                      참여 중
                    </span>
                  )}

                  {isOwner(meeting) && (
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-lg">
                      모임장
                    </span>
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

export default MeetingList
