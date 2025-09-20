import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, Users, Clock, MapPin, ArrowRight, Star, CheckCircle, Sparkles } from 'lucide-react'

const LandingPage = ({ onGetStarted }) => {
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
      description: "when2meet 스타일의 시간 조율로 모든 참여자가 만족하는 시간을 찾아보세요."
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
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
              <div className="w-20 h-20 bg-gradient-to-br from-kaist-blue to-kaist-lightblue rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                <Calendar className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
                KAIST Scheduler
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
                간편한 일정 관리
              </p>
              <p className="text-lg text-gray-500 dark:text-gray-400">
                KAIST 구성원을 위한 스마트한 일정 관리 플랫폼
              </p>
            </motion.div>

            {/* Main CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-16"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onGetStarted}
                className="btn-primary text-xl px-12 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 mx-auto"
              >
                <Sparkles className="w-6 h-6" />
                <span>간편하게 시작하기</span>
                <ArrowRight className="w-6 h-6" />
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-kaist-blue dark:text-kaist-lightblue mb-2">
                  100+
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  활성 사용자
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-kaist-blue dark:text-kaist-lightblue mb-2">
                  50+
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  진행된 모임
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-kaist-blue dark:text-kaist-lightblue mb-2">
                  24/7
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  실시간 동기화
                </div>
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
              KAIST Scheduler가 제공하는 강력한 기능들을 만나보세요
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
              왜 KAIST Scheduler를 선택해야 할까요?
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

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-kaist-blue to-kaist-lightblue">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              지금 바로 시작해보세요!
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              간편한 로그인으로 모든 기능을 무료로 이용하실 수 있습니다
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onGetStarted}
              className="bg-white text-kaist-blue text-xl px-12 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 mx-auto hover:bg-gray-50 transition-colors"
            >
              <Sparkles className="w-6 h-6" />
              <span>간편하게 시작하기</span>
              <ArrowRight className="w-6 h-6" />
            </motion.button>
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
