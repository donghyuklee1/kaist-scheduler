import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, Clock, MapPin, Users, Tag, Save, Building, UserPlus, Search } from 'lucide-react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { meetingTypes } from '../data/meetings'
import { allBuildings, getBuildingById, buildingTypes } from '../data/buildings'

const MeetingModal = ({ meeting, onSave, onClose, currentUser }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'study',
    location: '',
    buildingId: '',
    maxParticipants: '',
    organizer: '',
    organizerContact: '',
    status: 'draft'
  })

  const [errors, setErrors] = useState({})
  const [showCampusMap, setShowCampusMap] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')

  useEffect(() => {
    if (meeting) {
      setFormData({
        title: meeting.title || '',
        description: meeting.description || '',
        type: meeting.type || 'study',
        location: meeting.location || '',
        buildingId: meeting.buildingId || '',
        maxParticipants: meeting.maxParticipants || '',
        organizer: meeting.organizer || '',
        organizerContact: meeting.organizerContact || '',
        status: meeting.status || 'draft'
      })
    } else {
      // 새 모임의 경우 기본값 설정
      setFormData({
        title: '',
        description: '',
        type: 'study',
        location: '',
        buildingId: '',
        maxParticipants: '',
        organizer: '',
        organizerContact: '',
        status: 'draft'
      })
    }
  }, [meeting])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = '모임 제목을 입력해주세요'
    }


    if (formData.maxParticipants && (isNaN(formData.maxParticipants) || formData.maxParticipants < 2)) {
      newErrors.maxParticipants = '최소 2명 이상이어야 합니다'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // 로그인하지 않은 사용자 체크
    if (!currentUser || !currentUser.uid) {
      alert('모임을 생성하려면 로그인이 필요합니다.')
      return
    }
    
    if (!validateForm()) {
      return
    }

    const meetingData = {
      ...formData,
      maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : null
    }

    onSave(meetingData)
    onClose() // 모달 자동 닫기
  }

  const handleBuildingChange = (buildingId) => {
    try {
      const building = getBuildingById(buildingId)
      setFormData({
        ...formData,
        buildingId,
        location: building ? building.name : ''
      })
    } catch (error) {
      console.error('건물 선택 오류:', error)
      setFormData({
        ...formData,
        buildingId,
        location: ''
      })
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 50 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="bg-white rounded-2xl p-8 shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>

          <h2 className="text-3xl font-bold text-kaist-blue mb-6">
            {meeting ? '모임 수정' : '새 모임 만들기'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 제목과 설명 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  모임 제목 *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={`input-field pl-4 ${errors.title ? 'border-red-500' : ''}`}
                  placeholder="모임 제목을 입력하세요"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  모임 타입
                </label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="input-field pl-10"
                  >
                    {Object.entries(meetingTypes).map(([key, type]) => (
                      <option key={key} value={key}>
                        {type.icon} {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                모임 설명
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-field pl-4 h-24 resize-none"
                placeholder="모임에 대한 자세한 설명을 입력하세요"
              />
            </div>

            {/* 날짜와 시간 */}
            {/* Time Range Info */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-5 h-5 text-blue-500" />
                <span className="font-medium text-blue-700 dark:text-blue-300">시간 조율 방식</span>
              </div>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                모임 생성 후 참여자들이 각자 가능한 시간을 선택할 수 있습니다. 
                구체적인 날짜와 시간은 참여자들과의 시간 조율을 통해 결정됩니다.
              </p>
            </div>

            {/* 장소 설정 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                장소 선택
              </label>
              
              {/* 건물 선택 버튼 */}
              <div className="flex space-x-2 mb-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCampusMap(!showCampusMap)}
                  type="button"
                  className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                    showCampusMap 
                      ? 'border-kaist-blue bg-blue-50 text-kaist-blue' 
                      : 'border-gray-300 hover:border-kaist-blue'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  <span>캠퍼스맵에서 선택</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowCampusMap(false)
                    setFormData({ ...formData, buildingId: '', location: '' })
                  }}
                  type="button"
                  className="px-4 py-3 border-2 border-gray-300 rounded-xl hover:border-gray-400 transition-all duration-300"
                >
                  직접 입력
                </motion.button>
              </div>

              {/* 캠퍼스맵 인터페이스 */}
              {showCampusMap && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border border-gray-200 rounded-xl p-4 bg-gray-50"
                >
                  {/* 검색 및 필터 */}
                  <div className="mb-4 space-y-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="건물 검색..."
                        className="input-field pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="input-field pl-10"
                          >
                            <option value="all">모든 타입</option>
                            {buildingTypes && Object.entries(buildingTypes).map(([type, info]) => (
                              <option key={type} value={type}>{info.label}</option>
                            ))}
                          </select>
                    </div>
                  </div>

                  {/* 캠퍼스맵 이미지와 건물 목록 */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* 캠퍼스맵 이미지 */}
                    <div className="relative">
                      <img
                        src="/SCR-20250921-blps.jpeg"
                        alt="KAIST 캠퍼스맵"
                        className="w-full h-64 object-contain rounded-lg border border-gray-200"
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.nextElementSibling.style.display = 'block'
                        }}
                      />
                      <div className="hidden w-full h-64 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 rounded-lg border border-gray-200 flex items-center justify-center">
                        <p className="text-gray-500">캠퍼스맵 이미지</p>
                      </div>
                    </div>

                        {/* 건물 목록 */}
                        <div className="max-h-64 overflow-y-auto space-y-2">
                          {allBuildings && allBuildings
                            .filter(building => {
                              const matchesSearch = building.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                    building.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                    building.id.toLowerCase().includes(searchTerm.toLowerCase())
                              const matchesType = filterType === 'all' || building.type === filterType
                              return matchesSearch && matchesType
                            })
                            .map(building => (
                          <motion.div
                            key={building.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleBuildingChange(building.id)}
                            className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                              formData.buildingId === building.id
                                ? 'border-kaist-blue bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: buildingTypes?.[building.type]?.color || '#6B7280' }}
                              ></div>
                              <span className="font-medium text-sm">{building.id}</span>
                              <span className="text-sm text-gray-600">{building.name}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{building.englishName}</p>
                          </motion.div>
                        ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 직접 입력 필드 */}
              {!showCampusMap && (
                <div className="space-y-3">
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <select
                          value={formData.buildingId}
                          onChange={(e) => handleBuildingChange(e.target.value)}
                          className="input-field pl-10"
                        >
                          <option value="">건물을 선택하세요</option>
                          {allBuildings && allBuildings.map(building => (
                            <option key={building.id} value={building.id}>
                              {building.id} - {building.name}
                            </option>
                          ))}
                        </select>
                  </div>
                  
                  {formData.buildingId && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: buildingTypes?.[getBuildingById(formData.buildingId)?.type]?.color || '#6B7280' }}
                        ></div>
                        <span className="text-sm text-blue-800">
                          {getBuildingById(formData.buildingId)?.englishName || '알 수 없는 건물'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                상세 장소
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="input-field pl-10"
                  placeholder="상세 장소를 입력하세요 (예: 강의실, 회의실)"
                />
              </div>
            </div>

            {/* 최대 참여자 수 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                최대 참여자 수
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  value={formData.maxParticipants}
                  onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                  className={`input-field pl-10 ${errors.maxParticipants ? 'border-red-500' : ''}`}
                  placeholder="제한 없음 (비워두세요)"
                  min="2"
                />
              </div>
              {errors.maxParticipants && <p className="text-red-500 text-sm mt-1">{errors.maxParticipants}</p>}
            </div>

            {/* 담당자 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  담당자 이름
                </label>
                <div className="relative">
                  <UserPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={formData.organizer}
                    onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                    className="input-field pl-10"
                    placeholder="담당자 이름을 입력하세요"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  담당자 연락처
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={formData.organizerContact}
                    onChange={(e) => setFormData({ ...formData, organizerContact: e.target.value })}
                    className="input-field pl-10"
                    placeholder="이메일 또는 전화번호"
                  />
                </div>
              </div>
            </div>

            {/* 액션 버튼 */}
            <div className="flex justify-end space-x-4 mt-8">
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="btn-secondary"
              >
                취소
              </motion.button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary flex items-center space-x-2"
              >
                <Save className="w-5 h-5" />
                <span>{meeting ? '수정' : '모임 만들기'}</span>
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default MeetingModal
