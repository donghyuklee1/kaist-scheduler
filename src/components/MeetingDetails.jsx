import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Clock, Users, MapPin, CheckCircle, XCircle, BarChart3, Bell, Settings, Plus, Trash2, Edit3 } from 'lucide-react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { addAnnouncement, deleteAnnouncement, isMeetingOwner, getParticipantsCountForSlot } from '../services/firestoreService'

const MeetingDetails = ({ meeting, currentUser, onBack }) => {
  const [activeTab, setActiveTab] = useState('schedule') // 'schedule', 'attendance', 'announcements'
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false)
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    content: '',
    priority: 'normal'
  })

  // 시간 슬롯 생성 (9시부터 16시까지, 30분 단위)
  const generateTimeSlots = () => {
    const slots = []
    const startHour = 9
    const endHour = 16
    
    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        slots.push({
          id: `${hour}-${minute}`,
          time: timeString,
          hour: hour,
          minute: minute
        })
      }
    }
    return slots
  }

  const timeSlots = generateTimeSlots()
  const weekDays = ['월', '화', '수', '목', '금']
  const weekDates = ['12.31', '01.01', '01.02', '01.03', '01.04'] // 예시 날짜

  // 각 시간 슬롯에 대한 참여자 수 계산
  const getParticipantCount = (dayIndex, slotId) => {
    const fullSlotId = `${dayIndex}-${slotId}`
    let count = 0
    
    if (meeting?.availability) {
      Object.values(meeting.availability).forEach(userSlots => {
        if (userSlots.includes(fullSlotId)) {
          count++
        }
      })
    }
    
    return count
  }

  // 슬롯 색상 결정 (참여자 수에 따라)
  const getSlotColor = (dayIndex, slotId) => {
    const count = getParticipantCount(dayIndex, slotId)
    const totalParticipants = meeting?.participants?.length || 1
    
    if (count === 0) {
      return 'bg-gray-100 border-gray-200'
    } else if (count === totalParticipants) {
      return 'bg-green-500 border-green-600 text-white'
    } else if (count >= totalParticipants * 0.8) {
      return 'bg-green-400 border-green-500 text-white'
    } else if (count >= totalParticipants * 0.6) {
      return 'bg-green-300 border-green-400 text-white'
    } else if (count >= totalParticipants * 0.4) {
      return 'bg-yellow-300 border-yellow-400 text-white'
    } else if (count >= totalParticipants * 0.2) {
      return 'bg-orange-300 border-orange-400 text-white'
    } else {
      return 'bg-red-200 border-red-300 text-red-800'
    }
  }

  // 참석율 계산
  const getAttendanceRate = () => {
    const totalParticipants = meeting?.participants?.length || 0
    const participantsWithAvailability = Object.keys(meeting?.availability || {}).length
    return totalParticipants > 0 ? Math.round((participantsWithAvailability / totalParticipants) * 100) : 0
  }

  // 참여자별 가용성 요약
  const getParticipantSummary = () => {
    const summary = []
    
    if (meeting?.participants) {
      meeting.participants.forEach(participant => {
        const userSlots = meeting.availability?.[participant.userId] || []
        const totalSlots = weekDays.length * timeSlots.length
        const availabilityRate = totalSlots > 0 ? Math.round((userSlots.length / totalSlots) * 100) : 0
        
        summary.push({
          userId: participant.userId,
          status: participant.status,
          availabilityRate,
          slotCount: userSlots.length
        })
      })
    }
    
    return summary
  }

  const participantSummary = getParticipantSummary()

  // 공지사항 추가 함수
  const handleAddAnnouncement = async () => {
    if (!announcementForm.title.trim() || !announcementForm.content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.')
      return
    }

    try {
      await addAnnouncement(meeting.id, announcementForm, currentUser.uid)
      setAnnouncementForm({ title: '', content: '', priority: 'normal' })
      setShowAnnouncementModal(false)
    } catch (error) {
      alert(error.message)
    }
  }

  // 공지사항 삭제 함수
  const handleDeleteAnnouncement = async (announcementId) => {
    if (window.confirm('정말로 이 공지사항을 삭제하시겠습니까?')) {
      try {
        await deleteAnnouncement(meeting.id, announcementId, currentUser.uid)
      } catch (error) {
        alert(error.message)
      }
    }
  }

  // 모임장 여부 확인
  const isOwner = isMeetingOwner(meeting, currentUser?.uid)

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
              <h1 className="text-2xl font-bold text-kaist-blue dark:text-white">
                모임 세부사항
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {meeting?.title}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {meeting?.participants?.length || 0}명 참여
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                참석율 {getAttendanceRate()}%
              </span>
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
          className="glass-effect rounded-2xl p-6 shadow-xl"
        >
          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="flex space-x-2 glass-effect p-1 rounded-xl">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab('schedule')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                  activeTab === 'schedule'
                    ? 'bg-kaist-blue text-white shadow-lg'
                    : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span className="font-medium">시간표</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab('attendance')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                  activeTab === 'attendance'
                    ? 'bg-kaist-blue text-white shadow-lg'
                    : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span className="font-medium">참석율</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab('announcements')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                  activeTab === 'announcements'
                    ? 'bg-kaist-blue text-white shadow-lg'
                    : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                <Bell className="w-4 h-4" />
                <span className="font-medium">공지사항</span>
              </motion.button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'schedule' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                  전체 참여자 시간표
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  진한 색일수록 많은 사람이 가능한 시간입니다
                </p>
              </div>

              {/* Time Grid */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Header */}
                <div className="grid grid-cols-6 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <div className="p-4 text-center font-medium text-gray-500 dark:text-gray-400">
                    시간
                  </div>
                  {weekDays.map((day, index) => (
                    <div key={day} className="p-4 text-center border-l border-gray-200 dark:border-gray-600">
                      <div className="font-medium text-gray-800 dark:text-gray-200">{day}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{weekDates[index]}</div>
                    </div>
                  ))}
                </div>

                {/* Time Slots */}
                <div className="max-h-96 overflow-y-auto">
                  {timeSlots.map((slot) => (
                    <div key={slot.id} className="grid grid-cols-6 border-b border-gray-100 dark:border-gray-700">
                      {/* Time Label */}
                      <div className="p-3 text-center text-sm text-gray-600 dark:text-gray-400 border-r border-gray-200 dark:border-gray-600">
                        {slot.time}
                      </div>

                      {/* Day Columns */}
                      {weekDays.map((_, dayIndex) => {
                        const count = getParticipantCount(dayIndex, slot.id)
                        return (
                          <div
                            key={dayIndex}
                            className={`p-3 border-r border-gray-200 dark:border-gray-600 text-center text-xs font-medium ${getSlotColor(dayIndex, slot.id)}`}
                          >
                            {count > 0 && count}
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h4 className="font-medium text-gray-800 dark:text-white mb-2">범례</h4>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className="text-gray-600 dark:text-gray-300">모든 참여자 가능</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-300 rounded"></div>
                    <span className="text-gray-600 dark:text-gray-300">80% 이상</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-yellow-300 rounded"></div>
                    <span className="text-gray-600 dark:text-gray-300">40-60%</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-red-200 rounded"></div>
                    <span className="text-gray-600 dark:text-gray-300">20% 미만</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'attendance' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                  참석율 현황
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {getAttendanceRate()}%
                    </div>
                    <div className="text-sm text-blue-600 dark:text-blue-400">전체 참석율</div>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {Object.keys(meeting?.availability || {}).length}
                    </div>
                    <div className="text-sm text-green-600 dark:text-green-400">시간 조율 완료</div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                      {(meeting?.participants?.length || 0) - Object.keys(meeting?.availability || {}).length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">미완료</div>
                  </div>
                </div>
              </div>

              {/* 참여자별 상세 정보 */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-800 dark:text-white">참여자별 가용성</h4>
                {participantSummary.map((participant, index) => (
                  <div key={index} className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-kaist-blue to-kaist-lightblue rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">
                            {participant.userId.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-800 dark:text-white">
                            사용자 {participant.userId}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {participant.status === 'owner' ? '모임장' : '참여자'}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-800 dark:text-white">
                          {participant.availabilityRate}%
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {participant.slotCount}개 시간대
                        </div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-kaist-blue to-kaist-lightblue h-2 rounded-full transition-all duration-300"
                          style={{ width: `${participant.availabilityRate}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'announcements' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                      공지사항
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      모임 관련 중요한 공지사항을 확인하세요
                    </p>
                  </div>
                  
                  {isOwner && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowAnnouncementModal(true)}
                      className="btn-primary flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>공지 추가</span>
                    </motion.button>
                  )}
                </div>
              </div>

              {/* 공지사항 목록 */}
              <div className="space-y-4">
                {meeting?.announcements?.length > 0 ? (
                  meeting.announcements.map((announcement) => (
                    <div
                      key={announcement.id}
                      className={`p-4 border rounded-lg ${
                        announcement.priority === 'high'
                          ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                          : announcement.priority === 'low'
                          ? 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                          : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Bell className={`w-4 h-4 ${
                            announcement.priority === 'high' ? 'text-red-500' :
                            announcement.priority === 'low' ? 'text-gray-500' : 'text-blue-500'
                          }`} />
                          <span className={`font-medium ${
                            announcement.priority === 'high' ? 'text-red-700 dark:text-red-300' :
                            announcement.priority === 'low' ? 'text-gray-700 dark:text-gray-300' : 'text-blue-700 dark:text-blue-300'
                          }`}>
                            {announcement.title}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            announcement.priority === 'high' ? 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-800' :
                            announcement.priority === 'low' ? 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800' : 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-800'
                          }`}>
                            {announcement.priority === 'high' ? '긴급' :
                             announcement.priority === 'low' ? '일반' : '중요'}
                          </span>
                        </div>
                        
                        {isOwner && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteAnnouncement(announcement.id)}
                            className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        )}
                      </div>
                      
                      <p className={`text-sm mb-2 ${
                        announcement.priority === 'high' ? 'text-red-600 dark:text-red-400' :
                        announcement.priority === 'low' ? 'text-gray-600 dark:text-gray-400' : 'text-blue-600 dark:text-blue-400'
                      }`}>
                        {announcement.content}
                      </p>
                      
                      <div className={`text-xs ${
                        announcement.priority === 'high' ? 'text-red-500 dark:text-red-400' :
                        announcement.priority === 'low' ? 'text-gray-500 dark:text-gray-400' : 'text-blue-500 dark:text-blue-400'
                      }`}>
                        {(() => {
                          try {
                            if (!announcement.createdAt) return '날짜 미정'
                            const date = announcement.createdAt.toDate ? announcement.createdAt.toDate() : new Date(announcement.createdAt)
                            if (isNaN(date.getTime())) return '날짜 오류'
                            return format(date, 'yyyy년 M월 d일 HH:mm', { locale: ko })
                          } catch (error) {
                            console.error('날짜 포맷 오류:', error)
                            return '날짜 오류'
                          }
                        })()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 mb-2">아직 공지사항이 없습니다</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                      {isOwner ? '새로운 공지사항을 추가해보세요' : '모임장이 공지사항을 추가하면 여기에 표시됩니다'}
                    </p>
                  </div>
                )}

                {/* 기본 모임 정보 */}
                <div className="p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Settings className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">모임 정보</span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <div>• 모임 유형: {meeting?.type || '스터디'}</div>
                    <div>• 최대 참여자: {meeting?.maxParticipants || '제한 없음'}명</div>
                    <div>• 장소: {meeting?.location || '미정'}</div>
                    <div>• 생성일: {(() => {
                      try {
                        if (!meeting?.createdAt) return '날짜 미정'
                        const date = meeting.createdAt.toDate ? meeting.createdAt.toDate() : new Date(meeting.createdAt)
                        if (isNaN(date.getTime())) return '날짜 오류'
                        return format(date, 'yyyy년 M월 d일', { locale: ko })
                      } catch (error) {
                        console.error('날짜 포맷 오류:', error)
                        return '날짜 오류'
                      }
                    })()}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* 공지사항 추가 모달 */}
      {showAnnouncementModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowAnnouncementModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 50 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-kaist-blue to-kaist-lightblue rounded-xl flex items-center justify-center">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-kaist-blue dark:text-white">
                    공지사항 추가
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    새로운 공지사항을 작성하세요
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowAnnouncementModal(false)}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <XCircle className="w-5 h-5 text-gray-500 dark:text-gray-300" />
              </motion.button>
            </div>

            {/* Form */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  제목 *
                </label>
                <input
                  type="text"
                  value={announcementForm.title}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                  className="input-field"
                  placeholder="공지사항 제목을 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  내용 *
                </label>
                <textarea
                  value={announcementForm.content}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
                  className="input-field min-h-[120px] resize-none"
                  placeholder="공지사항 내용을 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  우선순위
                </label>
                <select
                  value={announcementForm.priority}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, priority: e.target.value })}
                  className="input-field"
                >
                  <option value="low">일반</option>
                  <option value="normal">중요</option>
                  <option value="high">긴급</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAnnouncementModal(false)}
                  className="btn-secondary"
                >
                  취소
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddAnnouncement}
                  className="btn-primary"
                >
                  추가
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default MeetingDetails
