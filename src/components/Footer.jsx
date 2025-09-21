import React from 'react'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mt-auto py-8 px-4"
    >
      <div className="container mx-auto">
        <div className="glass-effect rounded-2xl p-6 shadow-xl border-t border-white/20">
          <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400">
            <span className="text-sm font-medium">Made by</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-blue-500"
            >
              💙
            </motion.div>
            <span className="text-sm font-medium">with</span>
            <span className="text-sm font-bold text-kaist-blue dark:text-blue-400">Donghyuk</span>
          </div>
          
          <div className="mt-2 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-500">
              KAIST Student Scheduler - 캠퍼스 일정 관리 시스템
            </p>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}

export default Footer

