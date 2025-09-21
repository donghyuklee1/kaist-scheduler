import React, { createContext, useContext, useState, useCallback } from 'react'
import ToastContainer from '../components/Toast'

const ToastContext = createContext()

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((toast) => {
    const id = Date.now().toString()
    const newToast = {
      id,
      type: 'info',
      duration: 5000,
      autoClose: true,
      ...toast
    }
    
    setToasts(prev => [...prev, newToast])
    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const clearToasts = useCallback(() => {
    setToasts([])
  }, [])

  // 편의 메서드들
  const showSuccess = useCallback((message, title = '성공') => {
    return addToast({ type: 'success', message, title })
  }, [addToast])

  const showError = useCallback((message, title = '오류') => {
    return addToast({ type: 'error', message, title, duration: 7000 })
  }, [addToast])

  const showWarning = useCallback((message, title = '경고') => {
    return addToast({ type: 'warning', message, title })
  }, [addToast])

  const showInfo = useCallback((message, title = '알림') => {
    return addToast({ type: 'info', message, title })
  }, [addToast])

  const value = {
    toasts,
    addToast,
    removeToast,
    clearToasts,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  )
}
