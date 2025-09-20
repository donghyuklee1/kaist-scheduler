import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Firebase 설정 (환경 변수에서 가져옴)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig)

// Auth 인스턴스
export const auth = getAuth(app)

// Firestore 인스턴스
export const db = getFirestore(app)

// Firebase 연결 상태 확인
export const checkFirebaseConnection = () => {
  console.log('Firebase 설정 확인:')
  console.log('- Project ID:', firebaseConfig.projectId)
  console.log('- Auth Domain:', firebaseConfig.authDomain)
  console.log('- API Key:', firebaseConfig.apiKey ? '설정됨' : '누락')
  console.log('- App ID:', firebaseConfig.appId ? '설정됨' : '누락')
}

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider()
// KAIST 도메인 제한 제거 - 모든 Gmail 계정 허용

// 인증 함수들
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    return result.user
  } catch (error) {
    console.error('Google 로그인 오류:', error)
    throw error
  }
}

export const signOutUser = async () => {
  try {
    await signOut(auth)
  } catch (error) {
    console.error('로그아웃 오류:', error)
    throw error
  }
}

export default app
