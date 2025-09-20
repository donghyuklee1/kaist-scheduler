import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, Users, Clock, MapPin, ArrowRight, Star, CheckCircle, Sparkles, Moon, Sun } from 'lucide-react'
import { useDarkMode } from '../hooks/useDarkMode'

const LandingPage = ({ onGetStarted }) => {
  const [isDarkMode, toggleDarkMode] = useDarkMode()
  const features = [
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "스마트 일정 관리",
      description: "개인 일정을 체계적으로 관리하고 효율적인 시간 계획을 세워보세요."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "모임 및 스터디",
      description: "다양한 주제의 모임에 참여하고 새로운 사람들과 함께 성장하세요."
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "시간 조율",
      description: "Scroll & Select 스타일의 직관적인 방식으로 최적의 모임 시간을 찾아보세요."
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "캠퍼스맵 연동",
      description: "KAIST 캠퍼스맵과 연동하여 정확한 위치 정보로 일정을 관리하세요."
    }
  ]

  const benefits = [
    "무료로 사용 가능",
    "실시간 동기화",
    "다크모드 지원",
    "모바일 친화적",
    "간편한 로그인",
    "안전한 데이터 보호"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Radial Particles */}
        <div className="absolute inset-0">
          {[...Array(80)].map((_, i) => {
            const angle = (i / 80) * Math.PI * 2; // 360도 분할
            const distance = 150 + Math.random() * 400; // 중앙에서의 거리
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            
            // 다양한 파티클 크기와 색상
            const sizes = ['w-1 h-1', 'w-1.5 h-1.5', 'w-2 h-2', 'w-1 h-1', 'w-1.5 h-1.5'];
            const colors = [
              'bg-blue-400/40 dark:bg-blue-300/30',
              'bg-purple-400/40 dark:bg-purple-300/30', 
              'bg-pink-400/40 dark:bg-pink-300/30',
              'bg-cyan-400/40 dark:bg-cyan-300/30',
              'bg-indigo-400/40 dark:bg-indigo-300/30'
            ];
            
            const sizeClass = sizes[i % sizes.length];
            const colorClass = colors[i % colors.length];
            
            return (
              <motion.div
                key={i}
                className={`absolute ${sizeClass} ${colorClass} rounded-full`}
                initial={{
                  x: centerX,
                  y: centerY,
                  scale: 0,
                  opacity: 0,
                }}
                animate={{
                  x: centerX + Math.cos(angle) * distance,
                  y: centerY + Math.sin(angle) * distance,
                  scale: [0, 1.2, 0.6],
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  duration: 2.5 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                  ease: "easeOut",
                }}
              />
            );
          })}
        </div>
        
        {/* Additional Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(40)].map((_, i) => {
            const startX = Math.random() * window.innerWidth;
            const startY = Math.random() * window.innerHeight;
            const endX = startX + (Math.random() - 0.5) * 200;
            const endY = startY + (Math.random() - 0.5) * 200;
            
            const colors = [
              'bg-blue-300/20 dark:bg-blue-400/15',
              'bg-purple-300/20 dark:bg-purple-400/15',
              'bg-pink-300/20 dark:bg-pink-400/15',
              'bg-cyan-300/20 dark:bg-cyan-400/15'
            ];
            
            return (
              <motion.div
                key={`floating-${i}`}
                className={`absolute w-1 h-1 ${colors[i % colors.length]} rounded-full`}
                initial={{
                  x: startX,
                  y: startY,
                  scale: 0,
                  opacity: 0,
                }}
                animate={{
                  x: endX,
                  y: endY,
                  scale: [0, 1, 0],
                  opacity: [0, 0.6, 0],
                }}
                transition={{
                  duration: 4 + Math.random() * 4,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                  ease: "easeInOut",
                }}
              />
            );
          })}
        </div>
        
        {/* Gradient Orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/15 to-purple-400/15 dark:from-blue-500/8 dark:to-purple-500/8 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 0.8, 1],
            opacity: [0.3, 0.7, 0.2, 0.3],
            x: [0, 50, -30, 0],
            y: [0, -30, 40, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-400/15 to-pink-400/15 dark:from-purple-500/8 dark:to-pink-500/8 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 0.9, 1.4, 1.2],
            opacity: [0.4, 0.8, 0.2, 0.4],
            x: [0, -40, 60, 0],
            y: [0, 50, -20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-cyan-400/12 to-blue-400/12 dark:from-cyan-500/6 dark:to-blue-500/6 rounded-full blur-3xl"
          animate={{
            scale: [0.8, 1.2, 1, 0.8],
            opacity: [0.2, 0.6, 0.3, 0.2],
            x: [0, 30, -50, 0],
            y: [0, -40, 30, 0],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/3 left-1/2 w-72 h-72 bg-gradient-to-r from-pink-400/12 to-purple-400/12 dark:from-pink-500/6 dark:to-purple-500/6 rounded-full blur-3xl"
          animate={{
            scale: [1, 0.7, 1.3, 1],
            opacity: [0.3, 0.7, 0.2, 0.3],
            x: [0, -60, 40, 0],
            y: [0, 30, -50, 0],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10"></div>
      </div>

      {/* Header */}
      <header className="relative z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10">
                <img 
                  src="/Adobe Express - file.png" 
                  alt="Compendium Logo" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextElementSibling.style.display = 'flex'
                  }}
                />
                <div className="w-full h-full bg-gradient-to-br from-kaist-blue to-kaist-lightblue rounded-xl flex items-center justify-center hidden">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="text-left">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Compendium<span className="text-green-500 text-xs align-super">β</span>
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">간편한 일정 관리</p>
              </div>
            </div>

            {/* Dark Mode Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleDarkMode}
              className="p-3 rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </motion.button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative">
        <div className="relative container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Logo and Title */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <div className="w-40 h-40 mx-auto mb-4">
                <img 
                  src="/Adobe Express - file.png" 
                  alt="Compendium Logo" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // 로고 로드 실패 시 기본 아이콘 표시
                    e.target.style.display = 'none'
                    e.target.nextElementSibling.style.display = 'flex'
                  }}
                />
                <div className="w-full h-full bg-gradient-to-br from-kaist-blue to-kaist-lightblue rounded-2xl flex items-center justify-center hidden">
                  <Calendar className="w-10 h-10 text-white" />
                </div>
              </div>
              <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
                Compendium<span className="text-green-500 text-2xl align-super">β</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
                간편한 일정 관리
              </p>
              <p className="text-lg text-gray-500 dark:text-gray-400">
                KAIST 구성원을 위한 스마트한 일정 관리 플랫폼
              </p>
            </motion.div>

            {/* Contact Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-16"
            >
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 text-center shadow-2xl border border-gray-100 dark:border-gray-700">
                <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">지금 바로 시작해보세요!</h2>
                <p className="text-lg mb-6 text-gray-600 dark:text-gray-300">
                  간편한 로그인으로 모든 기능을 무료로 이용하실 수 있습니다
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onGetStarted}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg flex items-center space-x-3 mx-auto shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>간편하게 시작하기</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white/50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              주요 기능
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Compendium이 제공하는 강력한 기능들을 만나보세요
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-effect rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-kaist-blue to-kaist-lightblue rounded-xl flex items-center justify-center mx-auto mb-6 text-white">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              왜 Compendium을 선택해야 할까요?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              KAIST 구성원을 위해 특별히 설계된 기능들
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center space-x-3 glass-effect rounded-xl p-4"
              >
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  {benefit}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-20 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              문의사항이 있으신가요?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              서비스 개선이나 버그 신고, 새로운 기능 제안 등 언제든지 연락주세요
            </p>
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 max-w-md mx-auto">
              <div className="flex items-center justify-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">이메일</p>
                  <a 
                    href="mailto:dhlee4832@kaist.ac.kr"
                    className="text-lg font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    dhlee4832@kaist.ac.kr
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <div className="py-8 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Made by 💙 with Donghyuk
          </p>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
