import { useState, useEffect } from 'react'

export const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // 로컬 스토리지에서 다크모드 설정 확인
    const saved = localStorage.getItem('darkMode')
    if (saved !== null) {
      return JSON.parse(saved)
    }
    
    // 시스템 설정 확인
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    // 로컬 스토리지에 저장
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode))
    
    // HTML 클래스 업데이트
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  return [isDarkMode, toggleDarkMode]
}
