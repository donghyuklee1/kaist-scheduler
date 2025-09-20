// 사용자 관련 데이터 구조 및 유틸리티 함수

// 사용자 역할 정의
export const userRoles = {
  student: 'student',
  professor: 'professor',
  staff: 'staff',
  admin: 'admin'
}

// 사용자 생성 함수
export const createUser = (userData) => {
  return {
    id: userData.id || Date.now(),
    name: userData.name,
    email: userData.email,
    studentId: userData.studentId || null,
    department: userData.department || null,
    role: userData.role || userRoles.student,
    avatar: userData.avatar || null,
    preferences: {
      theme: 'light', // 'light' or 'dark'
      notifications: true,
      language: 'ko'
    },
    createdAt: new Date(),
    lastActive: new Date()
  }
}

// 기본 사용자 데이터 (데모용)
export const defaultUsers = [
  createUser({
    id: 1,
    name: '김학생',
    email: 'student1@kaist.ac.kr',
    studentId: '20241234',
    department: '전산학부',
    role: userRoles.student
  }),
  createUser({
    id: 2,
    name: '이교수',
    email: 'professor1@kaist.ac.kr',
    department: '전산학부',
    role: userRoles.professor
  }),
  createUser({
    id: 3,
    name: '박학생',
    email: 'student2@kaist.ac.kr',
    studentId: '20245678',
    department: '전기및전자공학부',
    role: userRoles.student
  }),
  createUser({
    id: 4,
    name: '최학생',
    email: 'student3@kaist.ac.kr',
    studentId: '20249012',
    department: '기계공학과',
    role: userRoles.student
  })
]

// 현재 사용자 (데모용)
export const currentUser = defaultUsers[0]

// 사용자 검색 함수
export const searchUsers = (users, query) => {
  if (!query) return users
  
  const lowercaseQuery = query.toLowerCase()
  return users.filter(user => 
    user.name.toLowerCase().includes(lowercaseQuery) ||
    user.email.toLowerCase().includes(lowercaseQuery) ||
    (user.studentId && user.studentId.includes(query)) ||
    (user.department && user.department.toLowerCase().includes(lowercaseQuery))
  )
}

// 사용자별 참여 모임 수 계산
export const getUserMeetingCount = (userId, meetings) => {
  return meetings.filter(meeting => 
    meeting.participants.some(p => p.userId === userId && p.status !== 'rejected')
  ).length
}

// 사용자별 생성 모임 수 계산
export const getUserCreatedMeetingCount = (userId, meetings) => {
  return meetings.filter(meeting => meeting.owner === userId).length
}
