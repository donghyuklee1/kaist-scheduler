import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Header from './components/Header'
import Calendar from './components/Calendar'
import Dashboard from './components/Dashboard'
import EventModal from './components/EventModal'
import ScheduleGrid from './components/ScheduleGrid'
import MeetingList from './components/MeetingList'
import MeetingModal from './components/MeetingModal'
import TimeCoordination from './components/TimeCoordination'
import MeetingDetails from './components/MeetingDetails'
import LoginModal from './components/LoginModal'
import UserProfile from './components/UserProfile'
import ProfilePage from './components/ProfilePage'
import SettingsPage from './components/SettingsPage'
import Footer from './components/Footer'
import { Calendar as CalendarIcon, Grid, Users } from 'lucide-react'
import { getBuildingById } from './data/buildings'
import { useAuth } from './contexts/AuthContext'
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

function App() {
  const { user, loading } = useAuth()
  const [view, setView] = useState('calendar') // 'calendar', 'schedule', 'campus', 'meetings', 'profile', 'settings'
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [events, setEvents] = useState([])
  const [meetings, setMeetings] = useState([])
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [editingMeeting, setEditingMeeting] = useState(null)
  const [selectedMeeting, setSelectedMeeting] = useState(null)
  const [showMeetingDetails, setShowMeetingDetails] = useState(false)

  // Firestore 실시간 구독 설정
  useEffect(() => {
    if (!user) {
      setEvents([])
      setMeetings([])
      return
    }

    // 사용자 이벤트 구독
    const unsubscribeEvents = subscribeToUserEvents(user.uid, (eventsData) => {
      setEvents(eventsData)
    })

    // 모든 모임 구독
    const unsubscribeMeetings = subscribeToMeetings((meetingsData) => {
      setMeetings(meetingsData)
    })

    // 정리 함수
    return () => {
      unsubscribeEvents()
      unsubscribeMeetings()
    }
  }, [user])

  const addEvent = async (event) => {
    try {
      await createEventInFirestore(event, user.uid)
      closeEventModal()
    } catch (error) {
      console.error('이벤트 생성 실패:', error)
      alert('이벤트 생성에 실패했습니다.')
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
      const meetingId = await createMeetingInFirestore(meetingData, user.uid)
      console.log('App.jsx - 모임 생성 완료, ID:', meetingId)
      closeMeetingModal()
    } catch (error) {
      console.error('App.jsx - 모임 생성 실패:', error)
      alert('모임 생성에 실패했습니다: ' + error.message)
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:to-gray-800 flex flex-col">
          <Header
            view={view}
            setView={setView}
            onAddEvent={() => openEventModal()}
            onLogin={() => setIsLoginModalOpen(true)}
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
        </motion.div>
      </main>

      <Footer />

      {isEventModalOpen && (
        <EventModal
          event={editingEvent}
          onSave={editingEvent ? updateEvent : addEvent}
          onDelete={editingEvent ? () => deleteEvent(editingEvent.id) : null}
          onClose={closeEventModal}
        />
      )}

          {isMeetingModalOpen && (
            <MeetingModal
              meeting={editingMeeting}
              onSave={editingMeeting ? updateMeeting : addMeeting}
              onClose={closeMeetingModal}
              currentUser={user}
            />
          )}

      {isLoginModalOpen && (
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
        />
      )}
    </div>
  )
}

export default App