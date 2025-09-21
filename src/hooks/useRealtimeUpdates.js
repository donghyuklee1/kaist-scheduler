import { useEffect, useRef } from 'react'
import { useContext } from 'react'
import { ToastContext } from '../contexts/ToastContext'

export const useRealtimeUpdates = (data, dataType) => {
  const toastContext = useContext(ToastContext)
  const previousDataRef = useRef(null)
  const isInitialLoadRef = useRef(true)

  useEffect(() => {
    // ToastProvider가 없으면 토스트 기능을 비활성화
    if (!toastContext) {
      return
    }

    // 초기 로드 시에는 알림을 표시하지 않음
    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false
      previousDataRef.current = data
      return
    }

    if (!previousDataRef.current || !data) {
      previousDataRef.current = data
      return
    }

    // 데이터 변경 감지
    const previousData = previousDataRef.current
    const currentData = data

    // 이벤트 변경 감지
    if (dataType === 'events') {
      const previousEvents = previousData || []
      const currentEvents = currentData || []
      
      // 새 이벤트 추가 감지
      const newEvents = currentEvents.filter(currentEvent => 
        !previousEvents.some(prevEvent => prevEvent.id === currentEvent.id)
      )
      
      // 이벤트 삭제 감지
      const deletedEvents = previousEvents.filter(prevEvent => 
        !currentEvents.some(currentEvent => currentEvent.id === prevEvent.id)
      )

      if (newEvents.length > 0) {
        toastContext.showInfo(`${newEvents.length}개의 새 일정이 추가되었습니다`, '일정 업데이트')
      }
      
      if (deletedEvents.length > 0) {
        toastContext.showInfo(`${deletedEvents.length}개의 일정이 삭제되었습니다`, '일정 업데이트')
      }
    }

    // 모임 변경 감지
    if (dataType === 'meetings') {
      const previousMeetings = previousData || []
      const currentMeetings = currentData || []
      
      // 새 모임 추가 감지
      const newMeetings = currentMeetings.filter(currentMeeting => 
        !previousMeetings.some(prevMeeting => prevMeeting.id === currentMeeting.id)
      )
      
      // 모임 삭제 감지
      const deletedMeetings = previousMeetings.filter(prevMeeting => 
        !currentMeetings.some(currentMeeting => currentMeeting.id === prevMeeting.id)
      )

      // 모임 상태 변경 감지
      const statusChangedMeetings = currentMeetings.filter(currentMeeting => {
        const prevMeeting = previousMeetings.find(prev => prev.id === currentMeeting.id)
        return prevMeeting && prevMeeting.status !== currentMeeting.status
      })

      if (newMeetings.length > 0) {
        toastContext.showInfo(`${newMeetings.length}개의 새 모임이 생성되었습니다`, '모임 업데이트')
      }
      
      if (deletedMeetings.length > 0) {
        toastContext.showInfo(`${deletedMeetings.length}개의 모임이 삭제되었습니다`, '모임 업데이트')
      }

      if (statusChangedMeetings.length > 0) {
        statusChangedMeetings.forEach(meeting => {
          if (meeting.status === 'closed') {
            toastContext.showWarning(`"${meeting.title}" 모임의 모집이 마감되었습니다`, '모임 상태 변경')
          }
        })
      }
    }

    // 알림 변경 감지
    if (dataType === 'notifications') {
      const previousNotifications = previousData || []
      const currentNotifications = currentData || []
      
      // 새 알림 추가 감지
      const newNotifications = currentNotifications.filter(currentNotif => 
        !previousNotifications.some(prevNotif => prevNotif.id === currentNotif.id)
      )

      if (newNotifications.length > 0) {
        toastContext.showInfo(`${newNotifications.length}개의 새 알림이 있습니다`, '알림')
      }
    }

    previousDataRef.current = data
  }, [data, dataType, toastContext])
}

export const useOptimisticUpdates = () => {
  const toastContext = useContext(ToastContext)
  
  // ToastProvider가 없으면 빈 함수들을 반환
  if (!toastContext) {
    return {
      showOptimisticSuccess: () => {},
      showOptimisticError: () => {},
      showLoadingState: () => {}
    }
  }

  const showOptimisticSuccess = (action, itemName) => {
    toastContext.showSuccess(`${itemName} ${action}이 완료되었습니다`, '성공')
  }

  const showOptimisticError = (action, itemName, error) => {
    toastContext.showError(`${itemName} ${action}에 실패했습니다: ${error.message || error}`, '오류')
  }

  const showLoadingState = (action, itemName) => {
    toastContext.showInfo(`${itemName} ${action} 중...`, '처리 중')
  }

  return {
    showOptimisticSuccess,
    showOptimisticError,
    showLoadingState
  }
}
