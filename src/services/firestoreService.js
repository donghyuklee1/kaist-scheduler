import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDoc,
  onSnapshot, 
  query, 
  orderBy, 
  where,
  serverTimestamp,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore'
import { db } from '../config/firebase'

// 컬렉션 이름 상수
export const COLLECTIONS = {
  EVENTS: 'events',
  MEETINGS: 'meetings',
  NOTIFICATIONS: 'notifications'
}

// ==================== 이벤트 관련 함수 ====================

// 사용자별 이벤트 구독
export const subscribeToUserEvents = (userId, callback) => {
  try {
    if (!userId) {
      console.log('사용자 ID가 없어서 이벤트 구독을 중단합니다.')
      callback([])
      return () => {}
    }

    // Firebase 설정 확인
    if (!db) {
      console.error('❌ Firestore 데이터베이스가 초기화되지 않았습니다.')
      callback([])
      return () => {}
    }

    console.log('사용자 이벤트 구독 시작:', userId)

    const q = query(
      collection(db, COLLECTIONS.EVENTS),
      where('userId', '==', userId),
      orderBy('date', 'asc')
    )

    return onSnapshot(q, (snapshot) => {
      console.log('사용자 이벤트 데이터 변경 감지:', snapshot.docs.length, '개 이벤트')
      const events = snapshot.docs.map(doc => {
        const data = doc.data()
        console.log('이벤트 데이터:', { id: doc.id, title: data.title, date: data.date })
        return {
          id: doc.id,
          ...data
        }
      })
      callback(events)
    }, (error) => {
      console.error('사용자 이벤트 구독 오류:', error)
      console.error('에러 상세:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      })
      
      // Firebase 설정 문제인지 확인
      if (error.code === 'permission-denied') {
        console.error('❌ Firestore 보안 규칙 문제입니다. Firebase Console에서 보안 규칙을 설정해주세요.')
      } else if (error.code === 'unavailable') {
        console.error('❌ Firebase 서비스에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.')
      } else if (error.message.includes('400')) {
        console.error('❌ Firebase 설정이 잘못되었습니다. 환경 변수를 확인해주세요.')
      }
      
      callback([])
    })
  } catch (error) {
    console.error('사용자 이벤트 구독 초기화 오류:', error)
    callback([])
    return () => {}
  }
}

// 이벤트 생성
export const createEvent = async (eventData, userId) => {
  try {
    console.log('이벤트 생성 시작:', { eventData, userId })
    
    // Firebase 설정 확인
    if (!db) {
      throw new Error('Firestore 데이터베이스가 초기화되지 않았습니다.')
    }
    
    // 필수 필드 검증
    if (!userId) {
      throw new Error('사용자 ID가 필요합니다.')
    }
    
    if (!eventData.title || !eventData.date) {
      throw new Error('제목과 날짜는 필수입니다.')
    }
    
    // 날짜 객체 변환
    let eventDate = eventData.date
    if (typeof eventDate === 'string') {
      eventDate = new Date(eventDate)
    }
    
    // 유효한 날짜인지 확인
    if (isNaN(eventDate.getTime())) {
      throw new Error('올바른 날짜 형식이 아닙니다.')
    }
    
    const eventDoc = {
      title: eventData.title,
      description: eventData.description || '',
      date: eventDate,
      time: eventData.time || '',
      location: eventData.location || '',
      buildingId: eventData.buildingId || '',
      category: eventData.category || 'personal',
      priority: eventData.priority || 'medium',
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }
    
    console.log('저장할 이벤트 데이터:', eventDoc)
    
    const docRef = await addDoc(collection(db, COLLECTIONS.EVENTS), eventDoc)
    console.log('이벤트 생성 성공, ID:', docRef.id)
    console.log('생성된 이벤트 문서:', eventDoc)
    
    // 생성 후 즉시 문서를 다시 읽어서 확인
    const createdDoc = await getDoc(docRef)
    if (createdDoc.exists()) {
      console.log('생성된 문서 확인 성공:', createdDoc.data())
    } else {
      console.error('생성된 문서를 찾을 수 없습니다!')
    }
    
    return docRef.id
  } catch (error) {
    console.error('이벤트 생성 실패:', error)
    console.error('에러 상세:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    })
    
    // Firestore 특정 오류 처리
    if (error.code === 'permission-denied') {
      throw new Error('권한이 없습니다. 다시 로그인해주세요.')
    } else if (error.code === 'unavailable') {
      throw new Error('네트워크 연결을 확인해주세요.')
    } else if (error.code === 'invalid-argument') {
      throw new Error('입력 데이터가 올바르지 않습니다.')
    }
    
    throw error
  }
}

// 이벤트 업데이트
export const updateEvent = async (eventId, eventData) => {
  try {
    const eventRef = doc(db, COLLECTIONS.EVENTS, eventId)
    await updateDoc(eventRef, {
      ...eventData,
      updatedAt: serverTimestamp()
    })
  } catch (error) {
    console.error('이벤트 업데이트 실패:', error)
    throw error
  }
}

// 이벤트 삭제
export const deleteEvent = async (eventId) => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.EVENTS, eventId))
  } catch (error) {
    console.error('이벤트 삭제 실패:', error)
    throw error
  }
}

// ==================== 모임 관련 함수 ====================

// 모든 모임 구독 (공개 모임)
export const subscribeToMeetings = (callback) => {
  try {
    // Firebase 설정 확인
    if (!db) {
      console.error('❌ Firestore 데이터베이스가 초기화되지 않았습니다.')
      callback([])
      return () => {}
    }

    // orderBy 없이 먼저 시도하고, 실패하면 클라이언트에서 정렬
    const q = query(collection(db, COLLECTIONS.MEETINGS))

    return onSnapshot(q, (snapshot) => {
      console.log('모임 데이터 변경 감지:', snapshot.docs.length, '개 모임')
      const meetings = snapshot.docs.map(doc => {
        const data = doc.data()
        console.log('모임 데이터:', { id: doc.id, title: data.title, createdAt: data.createdAt })
        return {
          id: doc.id,
          ...data
        }
      })
      
      // 클라이언트에서 생성일 기준으로 정렬
      meetings.sort((a, b) => {
        const aTime = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0)
        const bTime = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0)
        return bTime - aTime // 최신순
      })
      
      callback(meetings)
    }, (error) => {
      console.error('모임 구독 오류:', error)
      console.error('에러 상세:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      })
      
      // Firebase 설정 문제인지 확인
      if (error.code === 'permission-denied') {
        console.error('❌ Firestore 보안 규칙 문제입니다. Firebase Console에서 보안 규칙을 설정해주세요.')
      } else if (error.code === 'unavailable') {
        console.error('❌ Firebase 서비스에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.')
      } else if (error.message.includes('400')) {
        console.error('❌ Firebase 설정이 잘못되었습니다. 환경 변수를 확인해주세요.')
      }
      
      // 오류 발생 시 빈 배열 반환
      callback([])
    })
  } catch (error) {
    console.error('Firestore 구독 초기화 오류:', error)
    callback([])
    return () => {}
  }
}

// 모임 생성
export const createMeeting = async (meetingData, userId) => {
  try {
    console.log('모임 생성 시작:', { meetingData, userId })
    
    // 필수 필드 검증
    if (!userId) {
      throw new Error('사용자 ID가 필요합니다.')
    }
    
    if (!meetingData.title || !meetingData.description) {
      throw new Error('모임 제목과 설명은 필수입니다.')
    }
    
    const meetingDoc = {
      ...meetingData,
      owner: userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      participants: [{
        userId,
        status: 'owner',
        joinedAt: new Date().toISOString()
      }],
      availability: {},
      announcements: [],
      status: meetingData.status || 'open' // 기본 상태 추가
    }
    
    console.log('저장할 모임 데이터:', meetingDoc)
    
    // Firestore에 문서 추가
    const docRef = await addDoc(collection(db, COLLECTIONS.MEETINGS), meetingDoc)
    console.log('모임 생성 성공, ID:', docRef.id)
    
    // 생성된 문서 ID 반환
    return docRef.id
  } catch (error) {
    console.error('모임 생성 실패:', error)
    console.error('에러 상세:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    })
    throw error
  }
}

// 모임 업데이트
export const updateMeeting = async (meetingId, meetingData) => {
  try {
    const meetingRef = doc(db, COLLECTIONS.MEETINGS, meetingId)
    await updateDoc(meetingRef, {
      ...meetingData,
      updatedAt: serverTimestamp()
    })
  } catch (error) {
    console.error('모임 업데이트 실패:', error)
    throw error
  }
}

// 모임 삭제
export const deleteMeeting = async (meetingId) => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.MEETINGS, meetingId))
  } catch (error) {
    console.error('모임 삭제 실패:', error)
    throw error
  }
}

// 모임 참여
export const joinMeeting = async (meetingId, userId) => {
  try {
    const meetingRef = doc(db, COLLECTIONS.MEETINGS, meetingId)
    await updateDoc(meetingRef, {
      participants: arrayUnion({
        userId,
        status: 'pending',
        joinedAt: new Date().toISOString()
      }),
      updatedAt: serverTimestamp()
    })
  } catch (error) {
    console.error('모임 참여 실패:', error)
    throw error
  }
}

// 모임 참여자 상태 업데이트
export const updateParticipantStatus = async (meetingId, userId, newStatus) => {
  try {
    const meetingRef = doc(db, COLLECTIONS.MEETINGS, meetingId)
    
    // 먼저 현재 모임 데이터를 가져와서 참여자 상태를 업데이트
    // 이는 Firestore의 제한으로 인해 array 내부 요소를 직접 업데이트할 수 없기 때문
    const meetingDoc = await getDoc(meetingRef)
    if (!meetingDoc.exists()) {
      throw new Error('모임을 찾을 수 없습니다')
    }
    
    const meetingData = meetingDoc.data()
    const updatedParticipants = meetingData.participants.map(p => 
      p.userId === userId ? { ...p, status: newStatus } : p
    )
    
        await updateDoc(meetingRef, {
          participants: updatedParticipants,
          updatedAt: serverTimestamp()
        })
  } catch (error) {
    console.error('참여자 상태 업데이트 실패:', error)
    throw error
  }
}

// 가용성 업데이트
export const updateAvailability = async (meetingId, userId, timeSlotIds) => {
  try {
    // timeSlotIds가 배열인지 확인
    if (!Array.isArray(timeSlotIds)) {
      throw new Error('timeSlotIds는 배열이어야 합니다')
    }
    
    const meetingRef = doc(db, COLLECTIONS.MEETINGS, meetingId)
    await updateDoc(meetingRef, {
      [`availability.${userId}`]: timeSlotIds,
      updatedAt: serverTimestamp()
    })
  } catch (error) {
    console.error('가용성 업데이트 실패:', error)
    throw error
  }
}

// 공지사항 추가
export const addAnnouncement = async (meetingId, announcementData, userId) => {
  try {
    console.log('공지사항 추가 시작:', { meetingId, announcementData, userId })
    
    if (!db) {
      throw new Error('Firestore 데이터베이스가 초기화되지 않았습니다.')
    }
    
    const meetingRef = doc(db, COLLECTIONS.MEETINGS, meetingId)
    
    // 현재 모임 데이터를 가져와서 공지사항을 추가
    const meetingDoc = await getDoc(meetingRef)
    if (!meetingDoc.exists()) {
      throw new Error('모임을 찾을 수 없습니다')
    }
    
    const meetingData = meetingDoc.data()
    const newAnnouncement = {
      id: Date.now().toString(),
      ...announcementData,
      authorId: userId,
      createdAt: new Date().toISOString(),
      priority: announcementData.priority || 'normal'
    }
    
    const updatedAnnouncements = [...(meetingData.announcements || []), newAnnouncement]
    
    await updateDoc(meetingRef, {
      announcements: updatedAnnouncements,
      updatedAt: serverTimestamp()
    })
    
    // 중요 공지사항인 경우 모임원들에게 알림 생성
    if (newAnnouncement.priority === 'high' || newAnnouncement.priority === 'urgent') {
      await createAnnouncementNotifications(meetingId, newAnnouncement, meetingData.participants)
    }
    
    console.log('공지사항 추가 성공:', newAnnouncement)
  } catch (error) {
    console.error('공지사항 추가 실패:', error)
    throw error
  }
}

// 공지사항 삭제
export const deleteAnnouncement = async (meetingId, announcementId, userId) => {
  try {
    const meetingRef = doc(db, COLLECTIONS.MEETINGS, meetingId)
    
    // 현재 모임 데이터를 가져와서 공지사항을 제거
    const meetingDoc = await getDoc(meetingRef)
    if (!meetingDoc.exists()) {
      throw new Error('모임을 찾을 수 없습니다')
    }
    
    const meetingData = meetingDoc.data()
    const updatedAnnouncements = meetingData.announcements.filter(
      announcement => announcement.id !== announcementId
    )
    
        await updateDoc(meetingRef, {
          announcements: updatedAnnouncements,
          updatedAt: serverTimestamp()
        })
  } catch (error) {
    console.error('공지사항 삭제 실패:', error)
    throw error
  }
}

// ==================== 유틸리티 함수 ====================

// 특정 시간 슬롯에 가능한 참여자 수 계산
export const getParticipantsCountForSlot = (meeting, fullSlotId) => {
  let count = 0
  for (const userId in meeting.availability) {
    if (meeting.availability[userId].includes(fullSlotId)) {
      // 해당 유저가 모임의 승인된 참여자인지 확인
      const participant = meeting.participants.find(p => p.userId === userId)
      if (participant && (participant.status === 'approved' || participant.status === 'owner')) {
        count++
      }
    }
  }
  return count
}

// 모임 삭제
export const deleteMeetingInFirestore = async (meetingId) => {
  try {
    console.log('모임 삭제 시작:', meetingId)
    
    if (!db) {
      throw new Error('Firestore 데이터베이스가 초기화되지 않았습니다.')
    }
    
    const meetingRef = doc(db, COLLECTIONS.MEETINGS, meetingId)
    await deleteDoc(meetingRef)
    
    console.log('모임 삭제 성공:', meetingId)
  } catch (error) {
    console.error('모임 삭제 실패:', error)
    throw error
  }
}


// 참가 신청 보내기
export const sendJoinRequest = async (meetingId, userId, userInfo) => {
  try {
    console.log('참가 신청 보내기:', { meetingId, userId, userInfo })
    
    if (!db) {
      throw new Error('Firestore 데이터베이스가 초기화되지 않았습니다.')
    }
    
    const meetingRef = doc(db, COLLECTIONS.MEETINGS, meetingId)
    
    // 현재 모임 데이터를 가져와서 중복 확인
    const meetingDoc = await getDoc(meetingRef)
    if (!meetingDoc.exists()) {
      throw new Error('모임을 찾을 수 없습니다')
    }
    
    const meetingData = meetingDoc.data()
    
    // 이미 참가자이거나 신청한 경우 확인
    const existingParticipant = meetingData.participants.find(p => p.userId === userId)
    if (existingParticipant) {
      if (existingParticipant.status === 'owner' || existingParticipant.status === 'approved') {
        throw new Error('이미 모임에 참가하고 있습니다.')
      } else if (existingParticipant.status === 'pending') {
        throw new Error('이미 참가 신청을 보냈습니다.')
      }
    }
    
    // 참가 신청 추가
    const newRequest = {
      userId,
      status: 'pending',
      joinedAt: new Date().toISOString(),
      displayName: userInfo.displayName || '익명',
      email: userInfo.email || '',
      photoURL: userInfo.photoURL || ''
    }
    
    const updatedParticipants = [...meetingData.participants, newRequest]
    
    await updateDoc(meetingRef, {
      participants: updatedParticipants,
      updatedAt: serverTimestamp()
    })
    
    console.log('참가 신청 성공:', newRequest)
  } catch (error) {
    console.error('참가 신청 실패:', error)
    throw error
  }
}

// 참가 신청 승인/거부
export const handleJoinRequest = async (meetingId, userId, action) => {
  try {
    console.log('참가 신청 처리:', { meetingId, userId, action })
    
    if (!db) {
      throw new Error('Firestore 데이터베이스가 초기화되지 않았습니다.')
    }
    
    const meetingRef = doc(db, COLLECTIONS.MEETINGS, meetingId)
    
    // 현재 모임 데이터를 가져와서 참가자 상태 업데이트
    const meetingDoc = await getDoc(meetingRef)
    if (!meetingDoc.exists()) {
      throw new Error('모임을 찾을 수 없습니다')
    }
    
    const meetingData = meetingDoc.data()
    const updatedParticipants = meetingData.participants.map(p => {
      if (p.userId === userId && p.status === 'pending') {
        return {
          ...p,
          status: action === 'approve' ? 'approved' : 'rejected',
          processedAt: new Date().toISOString()
        }
      }
      return p
    })
    
    await updateDoc(meetingRef, {
      participants: updatedParticipants,
      updatedAt: serverTimestamp()
    })
    
    console.log('참가 신청 처리 성공:', { userId, action })
  } catch (error) {
    console.error('참가 신청 처리 실패:', error)
    throw error
  }
}

// 참가 신청 취소
export const cancelJoinRequest = async (meetingId, userId) => {
  try {
    console.log('참가 신청 취소:', { meetingId, userId })
    
    if (!db) {
      throw new Error('Firestore 데이터베이스가 초기화되지 않았습니다.')
    }
    
    const meetingRef = doc(db, COLLECTIONS.MEETINGS, meetingId)
    
    // 현재 모임 데이터를 가져와서 참가자 제거
    const meetingDoc = await getDoc(meetingRef)
    if (!meetingDoc.exists()) {
      throw new Error('모임을 찾을 수 없습니다')
    }
    
    const meetingData = meetingDoc.data()
    const updatedParticipants = meetingData.participants.filter(p => !(p.userId === userId && p.status === 'pending'))
    
    await updateDoc(meetingRef, {
      participants: updatedParticipants,
      updatedAt: serverTimestamp()
    })
    
    console.log('참가 신청 취소 성공:', userId)
  } catch (error) {
    console.error('참가 신청 취소 실패:', error)
    throw error
  }
}

// 출석 관리 관련 함수들

// 6자리 랜덤 번호 생성
export const generateAttendanceCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// 출석 확인 시작
export const startAttendanceCheck = async (meetingId, userId) => {
  try {
    if (!db) {
      throw new Error('Firebase가 초기화되지 않았습니다')
    }

    const meetingRef = doc(db, COLLECTIONS.MEETINGS, meetingId)
    
    // 현재 모임 데이터를 가져와서 소유자인지 확인
    const meetingDoc = await getDoc(meetingRef)
    if (!meetingDoc.exists()) {
      throw new Error('모임을 찾을 수 없습니다')
    }
    
    const meetingData = meetingDoc.data()
    if (meetingData.owner !== userId) {
      throw new Error('모임 소유자만 출석 확인을 시작할 수 있습니다')
    }
    
    const attendanceCode = generateAttendanceCode()
    const endTime = new Date(Date.now() + 3 * 60 * 1000) // 3분 후
    
    await updateDoc(meetingRef, {
      attendanceCheck: {
        isActive: true,
        code: attendanceCode,
        startTime: serverTimestamp(),
        endTime: endTime.toISOString(),
        attendees: []
      },
      updatedAt: serverTimestamp()
    })
    
    console.log('출석 확인 시작 성공:', attendanceCode)
    return attendanceCode
  } catch (error) {
    console.error('출석 확인 시작 실패:', error)
    throw error
  }
}

// 출석 확인 종료
export const endAttendanceCheck = async (meetingId, userId) => {
  try {
    if (!db) {
      throw new Error('Firebase가 초기화되지 않았습니다')
    }

    const meetingRef = doc(db, COLLECTIONS.MEETINGS, meetingId)
    
    // 현재 모임 데이터를 가져와서 소유자인지 확인
    const meetingDoc = await getDoc(meetingRef)
    if (!meetingDoc.exists()) {
      throw new Error('모임을 찾을 수 없습니다')
    }
    
    const meetingData = meetingDoc.data()
    if (meetingData.owner !== userId) {
      throw new Error('모임 소유자만 출석 확인을 종료할 수 있습니다')
    }
    
    await updateDoc(meetingRef, {
      attendanceCheck: {
        isActive: false,
        code: null,
        startTime: null,
        endTime: null,
        attendees: meetingData.attendanceCheck?.attendees || []
      },
      updatedAt: serverTimestamp()
    })
    
    console.log('출석 확인 종료 성공')
  } catch (error) {
    console.error('출석 확인 종료 실패:', error)
    throw error
  }
}

// 출석 코드 입력
export const submitAttendanceCode = async (meetingId, userId, code) => {
  try {
    if (!db) {
      throw new Error('Firebase가 초기화되지 않았습니다')
    }

    const meetingRef = doc(db, COLLECTIONS.MEETINGS, meetingId)
    
    // 현재 모임 데이터를 가져와서 출석 확인이 활성화되어 있는지 확인
    const meetingDoc = await getDoc(meetingRef)
    if (!meetingDoc.exists()) {
      throw new Error('모임을 찾을 수 없습니다')
    }
    
    const meetingData = meetingDoc.data()
    if (!meetingData.attendanceCheck?.isActive) {
      throw new Error('출석 확인이 진행 중이 아닙니다')
    }
    
    if (meetingData.attendanceCheck.code !== code) {
      throw new Error('잘못된 출석 코드입니다')
    }
    
    // 이미 출석한 사용자인지 확인
    const existingAttendee = meetingData.attendanceCheck.attendees?.find(
      attendee => attendee.userId === userId
    )
    
    if (existingAttendee) {
      throw new Error('이미 출석 확인을 완료했습니다')
    }
    
    // 출석자 목록에 추가
    const newAttendee = {
      userId: userId,
      timestamp: new Date().toISOString()
    }
    
    await updateDoc(meetingRef, {
      'attendanceCheck.attendees': arrayUnion(newAttendee),
      updatedAt: serverTimestamp()
    })
    
    console.log('출석 확인 성공:', userId)
    return true
  } catch (error) {
    console.error('출석 확인 실패:', error)
    throw error
  }
}

// 출석 현황 가져오기
export const getAttendanceStatus = (meeting) => {
  if (!meeting?.attendanceCheck) {
    return {
      isActive: false,
      attendees: [],
      totalParticipants: meeting?.participants?.length || 0,
      attendanceRate: 0
    }
  }
  
  const attendees = meeting.attendanceCheck.attendees || []
  // 모임장을 제외한 참여자 수 계산
  const participantsExcludingOwner = meeting?.participants?.filter(p => p.status !== 'owner') || []
  const totalParticipants = participantsExcludingOwner.length
  
  return {
    isActive: meeting.attendanceCheck.isActive,
    attendees: attendees,
    totalParticipants: totalParticipants,
    attendanceRate: totalParticipants > 0 ? Math.round((attendees.length / totalParticipants) * 100) : 0,
    code: meeting.attendanceCheck.code,
    endTime: meeting.attendanceCheck.endTime
  }
}

// 모임 소유자 확인
export const isMeetingOwner = (meeting, userId) => {
  if (!meeting || !userId) return false
  return meeting.owner === userId
}

// 모임 참여자 확인
export const isMeetingParticipant = (meeting, userId) => {
  if (!meeting || !userId) return false
  return meeting.participants?.some(p => p.userId === userId && p.status === 'approved')
}

// 대기 중인 참가 신청 확인
export const hasPendingRequest = (meeting, userId) => {
  if (!meeting || !userId) return false
  return meeting.participants?.some(p => p.userId === userId && p.status === 'pending')
}

// 모임원별 출석률 계산
export const getMemberAttendanceRates = (meeting) => {
  if (!meeting?.participants || !meeting?.attendanceCheck) {
    return []
  }

  const attendees = meeting.attendanceCheck.attendees || []
  const totalAttendanceChecks = meeting.attendanceCheck.totalChecks || 0

  return meeting.participants
    .filter(p => p.status !== 'owner') // 모임장 제외
    .map(participant => {
      const memberAttendances = attendees.filter(attendee => attendee.userId === participant.userId)
      const attendanceRate = totalAttendanceChecks > 0 
        ? Math.round((memberAttendances.length / totalAttendanceChecks) * 100)
        : 0

      return {
        userId: participant.userId,
        displayName: participant.displayName || `사용자 ${participant.userId}`,
        status: participant.status,
        attendanceCount: memberAttendances.length,
        totalChecks: totalAttendanceChecks,
        attendanceRate: attendanceRate
      }
    })
    .sort((a, b) => b.attendanceRate - a.attendanceRate) // 출석률 높은 순으로 정렬
}

// 최적의 모임 시간 제안
export const getOptimalMeetingTimes = (meeting) => {
  if (!meeting?.availability || !meeting?.participants) {
    return []
  }

  const participants = meeting.participants.filter(p => p.status === 'approved' || p.status === 'owner')
  const totalParticipants = participants.length
  
  if (totalParticipants === 0) {
    return []
  }

  const timeSlots = []
  const weekDays = ['월', '화', '수', '목', '금']
  
  // 시간 슬롯 생성 (9시부터 23시까지, 30분 단위)
  for (let hour = 9; hour <= 23; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      timeSlots.push(timeString)
    }
  }

  const optimalTimes = []

  // 각 요일별로 최적 시간 계산
  weekDays.forEach((day, dayIndex) => {
    timeSlots.forEach((time, timeIndex) => {
      const slotId = `${dayIndex}-${timeIndex}`
      let availableCount = 0

      // 각 참여자의 가용성 확인
      participants.forEach(participant => {
        const userSlots = meeting.availability[participant.userId] || []
        if (userSlots.includes(slotId)) {
          availableCount++
        }
      })

      const availabilityRate = totalParticipants > 0 ? (availableCount / totalParticipants) * 100 : 0

      if (availabilityRate >= 50) { // 50% 이상 가능한 시간만 제안
        optimalTimes.push({
          day: day,
          dayIndex: dayIndex,
          time: time,
          timeIndex: timeIndex,
          slotId: slotId,
          availableCount: availableCount,
          totalParticipants: totalParticipants,
          availabilityRate: Math.round(availabilityRate)
        })
      }
    })
  })

  // 가용률 높은 순으로 정렬하고 상위 10개만 반환
  return optimalTimes
    .sort((a, b) => b.availabilityRate - a.availabilityRate)
    .slice(0, 10)
}

// ==================== 알림 관련 함수 ====================

// 공지사항 알림 생성
export const createAnnouncementNotifications = async (meetingId, announcement, participants) => {
  try {
    if (!db) {
      throw new Error('Firestore 데이터베이스가 초기화되지 않았습니다.')
    }

    const notifications = []
    
    // 승인된 참여자들에게만 알림 전송
    const approvedParticipants = participants.filter(p => 
      p.status === 'approved' || p.status === 'owner'
    )

    for (const participant of approvedParticipants) {
      const notification = {
        userId: participant.userId,
        type: 'announcement',
        title: `새로운 중요 공지사항`,
        message: `${announcement.title}`,
        data: {
          meetingId: meetingId,
          announcementId: announcement.id,
          priority: announcement.priority
        },
        isRead: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
      
      notifications.push(notification)
    }

    // 배치로 알림 생성
    const batch = notifications.map(notification => 
      addDoc(collection(db, COLLECTIONS.NOTIFICATIONS), notification)
    )
    
    await Promise.all(batch)
    console.log('공지사항 알림 생성 완료:', notifications.length, '개')
  } catch (error) {
    console.error('공지사항 알림 생성 실패:', error)
    throw error
  }
}

// 사용자 알림 구독
export const subscribeToUserNotifications = (userId, callback) => {
  try {
    if (!userId) {
      console.log('사용자 ID가 없어서 알림 구독을 중단합니다.')
      callback([])
      return () => {}
    }

    if (!db) {
      console.error('❌ Firestore 데이터베이스가 초기화되지 않았습니다.')
      callback([])
      return () => {}
    }

    console.log('사용자 알림 구독 시작:', userId)

    const q = query(
      collection(db, COLLECTIONS.NOTIFICATIONS),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )

    return onSnapshot(q, (snapshot) => {
      console.log('사용자 알림 데이터 변경 감지:', snapshot.docs.length, '개 알림')
      const notifications = snapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt)
        }
      })
      callback(notifications)
    }, (error) => {
      console.error('사용자 알림 구독 오류:', error)
      callback([])
    })
  } catch (error) {
    console.error('사용자 알림 구독 초기화 오류:', error)
    callback([])
    return () => {}
  }
}

// 알림 읽음 처리
export const markNotificationAsRead = async (notificationId) => {
  try {
    if (!db) {
      throw new Error('Firestore 데이터베이스가 초기화되지 않았습니다.')
    }

    const notificationRef = doc(db, COLLECTIONS.NOTIFICATIONS, notificationId)
    await updateDoc(notificationRef, {
      isRead: true,
      updatedAt: serverTimestamp()
    })

    console.log('알림 읽음 처리 완료:', notificationId)
  } catch (error) {
    console.error('알림 읽음 처리 실패:', error)
    throw error
  }
}

// 모든 알림 읽음 처리
export const markAllNotificationsAsRead = async (userId) => {
  try {
    if (!db) {
      throw new Error('Firestore 데이터베이스가 초기화되지 않았습니다.')
    }

    const q = query(
      collection(db, COLLECTIONS.NOTIFICATIONS),
      where('userId', '==', userId),
      where('isRead', '==', false)
    )

    const snapshot = await getDocs(q)
    const batch = snapshot.docs.map(doc => 
      updateDoc(doc.ref, {
        isRead: true,
        updatedAt: serverTimestamp()
      })
    )

    await Promise.all(batch)
    console.log('모든 알림 읽음 처리 완료:', snapshot.docs.length, '개')
  } catch (error) {
    console.error('모든 알림 읽음 처리 실패:', error)
    throw error
  }
}

// 사용자 가용성 업데이트
export const updateUserAvailability = async (meetingId, userId, availability) => {
  if (!db) {
    throw new Error('Firebase가 초기화되지 않았습니다.')
  }

  try {
    const meetingRef = doc(db, 'meetings', meetingId)
    
    // 기존 가용성 데이터 가져오기
    const meetingDoc = await getDoc(meetingRef)
    if (!meetingDoc.exists()) {
      throw new Error('모임을 찾을 수 없습니다.')
    }

    const meetingData = meetingDoc.data()
    const currentAvailability = meetingData.availability || {}
    
    // 사용자의 가용성 업데이트
    currentAvailability[userId] = availability

    // 모임 문서 업데이트
    await updateDoc(meetingRef, {
      availability: currentAvailability,
      updatedAt: serverTimestamp()
    })

    console.log('가용성 업데이트 성공:', userId, availability.length, '개 슬롯')
  } catch (error) {
    console.error('가용성 업데이트 실패:', error)
    throw error
  }
}
