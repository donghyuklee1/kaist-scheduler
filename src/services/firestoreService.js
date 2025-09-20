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
  MEETINGS: 'meetings'
}

// ==================== 이벤트 관련 함수 ====================

// 사용자별 이벤트 구독
export const subscribeToUserEvents = (userId, callback) => {
  if (!userId) {
    callback([])
    return () => {}
  }

  const q = query(
    collection(db, COLLECTIONS.EVENTS),
    where('userId', '==', userId),
    orderBy('date', 'asc')
  )

  return onSnapshot(q, (snapshot) => {
    const events = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    callback(events)
  })
}

// 이벤트 생성
export const createEvent = async (eventData, userId) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.EVENTS), {
      ...eventData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    return docRef.id
  } catch (error) {
    console.error('이벤트 생성 실패:', error)
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
        joinedAt: serverTimestamp()
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
        joinedAt: serverTimestamp()
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
    const meetingRef = doc(db, COLLECTIONS.MEETINGS, meetingId)
    const newAnnouncement = {
      id: Date.now().toString(),
      ...announcementData,
      authorId: userId,
      createdAt: serverTimestamp(),
      priority: announcementData.priority || 'normal'
    }

    await updateDoc(meetingRef, {
      announcements: arrayUnion(newAnnouncement),
      updatedAt: serverTimestamp()
    })
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

// 사용자가 모임장인지 확인
export const isMeetingOwner = (meeting, userId) => {
  return meeting.participants.some(p => p.userId === userId && p.status === 'owner')
}
