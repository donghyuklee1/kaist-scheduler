import React, { createContext, useContext, useState, useEffect } from 'react'
import { onAuthStateChanged, updateProfile as updateFirebaseProfile } from 'firebase/auth'
import { auth, signInWithGoogle, signOutUser } from '../config/firebase'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isKaistUser, setIsKaistUser] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
      
      // KAIST 사용자 확인 (KAIST 이메일 또는 Gmail)
      if (user && user.email) {
        const isKaistEmail = user.email.endsWith('@kaist.ac.kr')
        const isGmail = user.email.endsWith('@gmail.com')
        setIsKaistUser(isKaistEmail || isGmail)
      } else {
        setIsKaistUser(false)
      }
    })

    return unsubscribe
  }, [])

  const login = async () => {
    try {
      const user = await signInWithGoogle()
      return user
    } catch (error) {
      console.error('로그인 실패:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await signOutUser()
    } catch (error) {
      console.error('로그아웃 실패:', error)
      throw error
    }
  }

  const updateProfile = async (profileData) => {
    try {
      if (!user) {
        throw new Error('로그인이 필요합니다')
      }

      console.log('프로필 업데이트 시작:', profileData)

      // Firebase Auth 프로필 업데이트
      await updateFirebaseProfile(user, {
        displayName: profileData.displayName,
        photoURL: profileData.photoURL
      })

      // 추가 정보는 로컬 스토리지에 저장 (Firebase Auth는 제한적)
      const userData = {
        ...profileData,
        uid: user.uid
      }
      localStorage.setItem(`user_${user.uid}`, JSON.stringify(userData))
      
      // 사용자 상태 강제 새로고침
      setUser(prevUser => ({
        ...prevUser,
        displayName: profileData.displayName,
        photoURL: profileData.photoURL
      }))
      
      console.log('프로필 업데이트 완료')
      
    } catch (error) {
      console.error('프로필 업데이트 실패:', error)
      throw error
    }
  }

  const value = {
    user,
    loading,
    isKaistUser,
    login,
    logout,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
