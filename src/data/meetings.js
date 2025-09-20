// 모임 관련 데이터 구조 및 유틸리티 함수

// 모임 타입 정의
export const meetingTypes = {
  seminar: { label: '세미나', color: '#3B82F6', icon: '🎓' },
  study: { label: '스터디', color: '#10B981', icon: '📚' },
  project: { label: '프로젝트', color: '#F59E0B', icon: '💻' },
  social: { label: '모임', color: '#EF4444', icon: '👥' },
  workshop: { label: '워크샵', color: '#8B5CF6', icon: '🔧' },
  conference: { label: '컨퍼런스', color: '#06B6D4', icon: '🏛️' }
}

// 모임 상태 정의
export const meetingStatus = {
  draft: 'draft', // 초안
  open: 'open', // 참여 신청 받는 중
  closed: 'closed', // 참여 신청 마감
  confirmed: 'confirmed', // 확정
  cancelled: 'cancelled' // 취소
}

// 참여자 상태 정의
export const participantStatus = {
  pending: 'pending', // 승인 대기
  approved: 'approved', // 승인됨
  rejected: 'rejected', // 거절됨
  owner: 'owner' // 모임장
}

// 시간 슬롯 생성 함수 (30분 단위)
export const generateTimeSlots = (startDate, endDate, startTime = '09:00', endTime = '22:00') => {
  const slots = []
  const start = new Date(startDate)
  const end = new Date(endDate)
  
  for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
    const daySlots = []
    const [startHour, startMin] = startTime.split(':').map(Number)
    const [endHour, endMin] = endTime.split(':').map(Number)
    
    for (let hour = startHour; hour < endHour || (hour === endHour && startMin === 0); hour++) {
      for (let min = 0; min < 60; min += 30) {
        if (hour === endHour && min >= endMin) break
        
        const slotTime = new Date(date)
        slotTime.setHours(hour, min, 0, 0)
        
        daySlots.push({
          id: `${date.toISOString().split('T')[0]}_${hour.toString().padStart(2, '0')}_${min.toString().padStart(2, '0')}`,
          datetime: slotTime,
          available: 0, // 가능한 사람 수
          participants: [] // 가능한 참여자 ID 목록
        })
      }
    }
    
    slots.push({
      date: new Date(date),
      slots: daySlots
    })
  }
  
  return slots
}

// 모임 생성 함수
export const createMeeting = (meetingData) => {
  const meeting = {
    id: Date.now(),
    title: meetingData.title,
    description: meetingData.description,
    type: meetingData.type,
    location: meetingData.location,
    buildingId: meetingData.buildingId,
    owner: meetingData.owner,
    status: meetingStatus.draft,
    createdAt: new Date(),
    updatedAt: new Date(),
    maxParticipants: meetingData.maxParticipants || null,
    participants: [{
      userId: meetingData.owner,
      status: participantStatus.owner,
      joinedAt: new Date()
    }],
    availability: {}, // userId -> timeSlotId[] 매핑
    announcements: [] // 공지사항 배열
  }
  
  return meeting
}

// 참여자 추가 함수
export const addParticipant = (meeting, userId, status = participantStatus.pending) => {
  const existingParticipant = meeting.participants.find(p => p.userId === userId)
  
  if (existingParticipant) {
    return meeting
  }
  
  const newParticipant = {
    userId,
    status,
    joinedAt: new Date()
  }
  
  return {
    ...meeting,
    participants: [...meeting.participants, newParticipant],
    updatedAt: new Date()
  }
}

// 참여자 상태 업데이트 함수
export const updateParticipantStatus = (meeting, userId, status) => {
  return {
    ...meeting,
    participants: meeting.participants.map(p => 
      p.userId === userId ? { ...p, status } : p
    ),
    updatedAt: new Date()
  }
}

// 시간 가용성 업데이트 함수
export const updateAvailability = (meeting, userId, timeSlotIds) => {
  const newAvailability = { ...meeting.availability }
  newAvailability[userId] = timeSlotIds
  
  // 시간 슬롯별 가능한 사람 수 업데이트
  const updatedTimeSlots = meeting.timeSlots.map(day => ({
    ...day,
    slots: day.slots.map(slot => {
      const availableCount = Object.values(newAvailability).filter(slots => 
        slots.includes(slot.id)
      ).length
      
      const participants = Object.keys(newAvailability).filter(userId => 
        newAvailability[userId].includes(slot.id)
      )
      
      return {
        ...slot,
        available: availableCount,
        participants
      }
    })
  }))
  
  return {
    ...meeting,
    availability: newAvailability,
    timeSlots: updatedTimeSlots,
    updatedAt: new Date()
  }
}

// 시간 슬롯 포맷팅 함수
export const formatTimeSlot = (datetime) => {
  const date = new Date(datetime)
  return {
    date: date.toISOString().split('T')[0],
    time: date.toTimeString().slice(0, 5),
    display: `${date.toLocaleDateString('ko-KR')} ${date.toTimeString().slice(0, 5)}`
  }
}

// 시간 슬롯 그룹화 함수 (날짜별)
export const groupTimeSlotsByDate = (timeSlots) => {
  const grouped = {}
  
  timeSlots.forEach(day => {
    const dateKey = day.date.toISOString().split('T')[0]
    grouped[dateKey] = day.slots
  })
  
  return grouped
}

// 공지사항 추가 함수
export const addAnnouncement = (meeting, announcementData, userId) => {
  // 모임장만 공지사항을 추가할 수 있음
  const isOwner = meeting.participants.some(p => p.userId === userId && p.status === participantStatus.owner)
  
  if (!isOwner) {
    throw new Error('모임장만 공지사항을 추가할 수 있습니다.')
  }
  
  const newAnnouncement = {
    id: Date.now(),
    title: announcementData.title,
    content: announcementData.content,
    authorId: userId,
    createdAt: new Date(),
    priority: announcementData.priority || 'normal' // 'high', 'normal', 'low'
  }
  
  return {
    ...meeting,
    announcements: [newAnnouncement, ...meeting.announcements],
    updatedAt: new Date()
  }
}

// 공지사항 삭제 함수
export const deleteAnnouncement = (meeting, announcementId, userId) => {
  // 모임장만 공지사항을 삭제할 수 있음
  const isOwner = meeting.participants.some(p => p.userId === userId && p.status === participantStatus.owner)
  
  if (!isOwner) {
    throw new Error('모임장만 공지사항을 삭제할 수 있습니다.')
  }
  
  return {
    ...meeting,
    announcements: meeting.announcements.filter(announcement => announcement.id !== announcementId),
    updatedAt: new Date()
  }
}

// 사용자가 모임장인지 확인하는 함수
export const isMeetingOwner = (meeting, userId) => {
  return meeting.participants.some(p => p.userId === userId && p.status === participantStatus.owner)
}
