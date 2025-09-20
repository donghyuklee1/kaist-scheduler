import React, { useState, useEffect, Suspense, lazy } from 'react'
import { motion } from 'framer-motion'
import Header from './components/Header'
import Footer from './components/Footer'
import LandingPage from './components/LandingPage'

// 동적 import를 사용한 지연 로딩
const Calendar = lazy(() => import('./components/Calendar'))
const Dashboard = lazy(() => import('./components/Dashboard'))
const EventModal = lazy(() => import('./components/EventModal'))
const ScheduleGrid = lazy(() => import('./components/ScheduleGrid'))
const MeetingList = lazy(() => import('./components/MeetingList'))
const MeetingModal = lazy(() => import('./components/MeetingModal'))
const TimeCoordination = lazy(() => import('./components/TimeCoordination'))
const MeetingDetails = lazy(() => import('./components/MeetingDetails'))
const LoginPage = lazy(() => import('./components/LoginPage'))
const ProfilePage = lazy(() => import('./components/ProfilePage'))
const SettingsPage = lazy(() => import('./components/SettingsPage'))
import { Calendar as CalendarIcon, Grid, Users } from 'lucide-react'
import { getBuildingById } from './data/buildings'
import { useAuth } from './contexts/AuthContext'
import { checkFirebaseConnection } from './config/firebase'
import FirebaseSetupAlert from './components/FirebaseSetupAlert'
import { 
  subscribeToUserEvents, 
  subscribeToMeetings, 
  createEvent as createEventInFirestore, 
  updateEvent as updateEventInFirestore, 
  deleteEvent as deleteEventInFirestore, 
  createMeeting as createMeetingInFirestore, 
  updateMeeting as updateMeetingInFirestore, 
  joinMeeting as joinMeetingInFirestore, 
  updateAvailability as updateAvailabilityInFirestore, 
  addAnnouncement as addAnnouncementInFirestore, 
  deleteAnnouncement as deleteAnnouncementInFirestore, 
  getParticipantsCountForSlot, 
  isMeetingOwner 
} from './services/firestoreService'

// 로딩 컴포넌트
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-64">
    <div className="w-8 h-8 border-4 border-kaist-blue border-t-transparent rounded-full animate-spin"></div>
  </div>
)

function App() {
  const { user, loading } = useAuth()
  const [view, setView] = useState('calendar') // 'calendar', 'schedule', 'campus', 'meetings', 'profile', 'settings'
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [events, setEvents] = useState([])
  const [meetings, setMeetings] = useState([])
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false)
  const [showLoginPage, setShowLoginPage] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [editingMeeting, setEditingMeeting] = useState(null)
  const [selectedMeeting, setSelectedMeeting] = useState(null)
  const [showMeetingDetails, setShowMeetingDetails] = useState(false)
  const [showFirebaseSetupAlert, setShowFirebaseSetupAlert] = useState(false)

  // 사용자 로그인 상태에 따른 로그인 페이지 관리
  useEffect(() => {
    if (user && showLoginPage) {
      setShowLoginPage(false)
    }
  }, [user, showLoginPage])

  // Firestore 실시간 구독 설정
  useEffect(() => {
    // Firebase 연결 상태 확인
    const isFirebaseConfigured = checkFirebaseConnection()
    
    if (!isFirebaseConfigured) {
      setShowFirebaseSetupAlert(true)
    }
    
    // 모든 모임 구독 (로그인 여부와 관계없이)
    const unsubscribeMeetings = subscribeToMeetings((meetingsData) => {
      console.log('App.jsx - 모임 데이터 업데이트:', meetingsData.length, '개')
      setMeetings(meetingsData)
    })

    // 사용자 이벤트 구독 (로그인한 사용자만)
    let unsubscribeEvents = null
    if (user) {
      unsubscribeEvents = subscribeToUserEvents(user.uid, (eventsData) => {
        setEvents(eventsData)
      })
    } else {
      setEvents([])
    }

    // 정리 함수
    return () => {
      if (unsubscribeEvents) {
        unsubscribeEvents()
      }
      unsubscribeMeetings()
    }
  }, [user])

  const addEvent = async (event) => {
    try {
      console.log('일정 추가 시도:', event)
      
      // Firebase 설정 확인
      const isFirebaseConfigured = checkFirebaseConnection()
      if (!isFirebaseConfigured) {
        // Firebase가 설정되지 않은 경우 로컬 상태에만 저장
        console.log('Firebase 미설정 - 로컬 상태에 저장')
        const newEvent = {
          ...event,
          id: Date.now().toString(), // 임시 ID
          userId: user.uid,
          createdAt: new Date()
        }
        setEvents(prev => [...prev, newEvent])
        closeEventModal()
        alert('일정이 임시로 저장되었습니다. Firebase 설정 후 새로고침하면 데이터가 사라질 수 있습니다.')
        return
      }
      
      await createEventInFirestore(event, user.uid)
      closeEventModal()
      console.log('일정 생성 성공')
    } catch (error) {
      console.error('이벤트 생성 실패:', error)
      
      // Firebase 오류인 경우 로컬 상태에 저장
      if (error.message.includes('Firestore') || error.message.includes('Firebase')) {
        console.log('Firebase 오류 - 로컬 상태에 저장')
        const newEvent = {
          ...event,
          id: Date.now().toString(),
          userId: user.uid,
          createdAt: new Date()
        }
        setEvents(prev => [...prev, newEvent])
        closeEventModal()
        alert('일정이 임시로 저장되었습니다. Firebase 설정을 확인해주세요.')
      } else {
        alert('이벤트 생성에 실패했습니다: ' + error.message)
      }
    }
  }

  const updateEvent = async (updatedEvent) => {
    try {
      await updateEventInFirestore(updatedEvent.id, updatedEvent)
      closeEventModal()
    } catch (error) {
      console.error('이벤트 업데이트 실패:', error)
      alert('이벤트 업데이트에 실패했습니다.')
    }
  }

  const deleteEvent = async (eventId) => {
    try {
      await deleteEventInFirestore(eventId)
    } catch (error) {
      console.error('이벤트 삭제 실패:', error)
      alert('이벤트 삭제에 실패했습니다.')
    }
  }

  const openEventModal = (event = null) => {
    setEditingEvent(event)
    setIsEventModalOpen(true)
  }

  const handleBuildingClick = (building) => {
    // 건물 정보와 함께 새 이벤트 모달 열기
    openEventModal({ 
      buildingId: building.id,
      location: building.name,
      date: selectedDate
    })
  }

  const closeEventModal = () => {
    setIsEventModalOpen(false)
    setEditingEvent(null)
  }

  // 모임 관련 함수들
  const addMeeting = async (meetingData) => {
    try {
      console.log('App.jsx - 모임 생성 시작:', { meetingData, userId: user.uid })
      
      // 사용자 인증 확인
      if (!user || !user.uid) {
        throw new Error('로그인이 필요합니다.')
      }
      
      // 모임 데이터 검증
      if (!meetingData.title || !meetingData.description) {
        throw new Error('모임 제목과 설명을 입력해주세요.')
      }
      
      const meetingId = await createMeetingInFirestore(meetingData, user.uid)
      console.log('App.jsx - 모임 생성 완료, ID:', meetingId)
      
      // 성공 메시지
      alert('모임이 성공적으로 생성되었습니다!')
      closeMeetingModal()
    } catch (error) {
      console.error('App.jsx - 모임 생성 실패:', error)
      console.error('에러 상세:', error)
      
      // 사용자 친화적인 에러 메시지
      let errorMessage = '모임 생성에 실패했습니다.'
      if (error.message.includes('permission')) {
        errorMessage = '권한이 없습니다. 다시 로그인해주세요.'
      } else if (error.message.includes('network')) {
        errorMessage = '네트워크 연결을 확인해주세요.'
      } else if (error.message) {
        errorMessage = error.message
      }
      
      alert(errorMessage)
    }
  }

  const updateMeeting = async (updatedMeeting) => {
    try {
      await updateMeetingInFirestore(updatedMeeting.id, updatedMeeting)
      closeMeetingModal()
    } catch (error) {
      console.error('모임 업데이트 실패:', error)
      alert('모임 업데이트에 실패했습니다.')
    }
  }

  const openMeetingModal = (meeting = null) => {
    // 로그인하지 않은 사용자는 모임 생성 불가
    if (!meeting && (!user || !user.uid)) {
      alert('모임을 생성하려면 로그인이 필요합니다.')
      return
    }
    
    setEditingMeeting(meeting)
    setIsMeetingModalOpen(true)
  }

  const closeMeetingModal = () => {
    setIsMeetingModalOpen(false)
    setEditingMeeting(null)
  }

  const joinMeeting = async (meeting) => {
    // 로그인하지 않은 사용자는 모임 참여 불가
    if (!user || !user.uid) {
      alert('모임에 참여하려면 로그인이 필요합니다.')
      return
    }
    
    try {
      await joinMeetingInFirestore(meeting.id, user.uid)
    } catch (error) {
      console.error('모임 참여 실패:', error)
      alert('모임 참여에 실패했습니다.')
    }
  }

  const handleAvailabilityChange = async (timeSlotIds) => {
    // 로그인하지 않은 사용자는 시간 조율 불가
    if (!user || !user.uid) {
      alert('시간 조율을 하려면 로그인이 필요합니다.')
      return
    }
    
    // timeSlotIds가 배열인지 확인
    if (!Array.isArray(timeSlotIds)) {
      console.error('timeSlotIds는 배열이어야 합니다:', timeSlotIds)
      return
    }
    
    if (selectedMeeting) {
      try {
        await updateAvailabilityInFirestore(selectedMeeting.id, user.uid, timeSlotIds)
        // selectedMeeting 상태는 실시간 구독을 통해 자동으로 업데이트됨
      } catch (error) {
        console.error('가용성 업데이트 실패:', error)
        alert('가용성 업데이트에 실패했습니다.')
      }
    }
  }

  // 로딩 중일 때 표시할 컴포넌트
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-kaist-blue rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">K</span>
          </div>
          <div className="w-8 h-8 border-4 border-kaist-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">로딩 중...</p>
        </motion.div>
      </div>
    )
  }

  // 로그인하지 않은 사용자에게는 랜딩 페이지 표시
  if (!user) {
    return (
      <>
        {showLoginPage ? (
          <Suspense fallback={<LoadingSpinner />}>
            <LoginPage
              onBack={() => setShowLoginPage(false)}
            />
          </Suspense>
        ) : (
          <LandingPage 
            onGetStarted={() => setShowLoginPage(true)} 
          />
        )}
        
        {/* Firebase 설정 알림 */}
        <FirebaseSetupAlert
          isVisible={showFirebaseSetupAlert}
          onClose={() => setShowFirebaseSetupAlert(false)}
        />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:to-gray-800 flex flex-col">
          <Header
            view={view}
            setView={setView}
            onAddEvent={() => openEventModal()}
            onLogin={() => setShowLoginPage(true)}
            meetings={meetings}
            onNavigateToProfile={() => setView('profile')}
            onNavigateToSettings={() => setView('settings')}
          />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-effect rounded-2xl p-6 shadow-xl"
        >
          <Suspense fallback={<LoadingSpinner />}>
            {view === 'calendar' ? (
              <Dashboard
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                events={events}
                meetings={meetings}
                onEventClick={openEventModal}
                onDateClick={(date) => {
                  setSelectedDate(date)
                  openEventModal({ date })
                }}
                onViewChange={setView}
                currentUser={user}
              />
            ) : view === 'schedule' ? (
              <ScheduleGrid
                events={events}
                onEventClick={openEventModal}
                onAddEvent={() => openEventModal()}
              />
            ) : view === 'meetings' ? (
              showMeetingDetails ? (
                <MeetingDetails
                  meeting={selectedMeeting}
                  currentUser={user}
                  onBack={() => setShowMeetingDetails(false)}
                />
              ) : selectedMeeting ? (
                <TimeCoordination
                  meeting={selectedMeeting}
                  currentUser={user}
                  onAvailabilityChange={handleAvailabilityChange}
                  onBack={() => setSelectedMeeting(null)}
                  onComplete={() => setShowMeetingDetails(true)}
                />
              ) : (
                <MeetingList
                  meetings={meetings}
                  currentUser={user}
                  onMeetingClick={(meeting) => setSelectedMeeting(meeting)}
                  onCreateMeeting={() => openMeetingModal()}
                  onJoinMeeting={joinMeeting}
                />
              )
            ) : view === 'profile' ? (
              <ProfilePage onBack={() => setView('calendar')} />
            ) : view === 'settings' ? (
              <SettingsPage onBack={() => setView('calendar')} />
            ) : null}
          </Suspense>
        </motion.div>
      </main>

      <Footer />

      {isEventModalOpen && (
        <Suspense fallback={<LoadingSpinner />}>
          <EventModal
            event={editingEvent}
            onSave={editingEvent ? updateEvent : addEvent}
            onDelete={editingEvent ? () => deleteEvent(editingEvent.id) : null}
            onClose={closeEventModal}
          />
        </Suspense>
      )}

      {isMeetingModalOpen && (
        <Suspense fallback={<LoadingSpinner />}>
          <MeetingModal
            meeting={editingMeeting}
            onSave={editingMeeting ? updateMeeting : addMeeting}
            onClose={closeMeetingModal}
            currentUser={user}
          />
        </Suspense>
      )}

      {showLoginPage && !user && (
        <Suspense fallback={<LoadingSpinner />}>
          <LoginPage
            onBack={() => setShowLoginPage(false)}
          />
        </Suspense>
      )}

      {/* Firebase 설정 알림 */}
      <FirebaseSetupAlert
        isVisible={showFirebaseSetupAlert}
        onClose={() => setShowFirebaseSetupAlert(false)}
      />
    </div>
  )
}

export default App