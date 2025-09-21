import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'

const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    if (toast.autoClose !== false) {
      const timer = setTimeout(() => {
        onClose(toast.id)
      }, toast.duration || 5000)
      
      return () => clearTimeout(timer)
    }
  }, [toast.id, toast.duration, toast.autoClose, onClose])

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  const getBackgroundColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700'
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700'
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700'
      case 'info':
      default:
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className={`relative flex items-start space-x-3 p-4 rounded-xl border shadow-lg max-w-sm w-full ${getBackgroundColor()}`}
    >
      <div className="flex-shrink-0">
        {getIcon()}
      </div>
      
      <div className="flex-1 min-w-0">
        {toast.title && (
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
            {toast.title}
          </h4>
        )}
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {toast.message}
        </p>
      </div>
      
      <button
        onClick={() => onClose(toast.id)}
        className="flex-shrink-0 p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        <X className="w-4 h-4 text-gray-500" />
      </button>
    </motion.div>
  )
}

const ToastContainer = ({ toasts, onClose }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            toast={toast}
            onClose={onClose}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

export default ToastContainer

