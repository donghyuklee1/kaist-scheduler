import React, { createContext, useContext, useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
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

  const value = {
    user,
    loading,
    isKaistUser,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
