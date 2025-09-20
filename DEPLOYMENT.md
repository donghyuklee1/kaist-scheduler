# KAIST Scheduler 배포 가이드

## 🚀 Vercel 배포 방법

### 1. Firebase 프로젝트 설정

1. [Firebase Console](https://console.firebase.google.com/)에 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. **Authentication** 활성화:
   - Sign-in method에서 Google 활성화
   - 승인된 도메인에 배포 URL 추가
4. **Firestore Database** 활성화:
   - 테스트 모드로 시작 (나중에 보안 규칙 설정)

### 2. Firebase 설정 정보 복사

Firebase 프로젝트 설정에서 웹 앱 설정 정보를 복사:
- API Key
- Auth Domain
- Project ID
- Storage Bucket
- Messaging Sender ID
- App ID

### 3. Vercel 배포

#### 방법 1: Vercel CLI 사용
```bash
# Vercel CLI 설치
npm i -g vercel

# 프로젝트 디렉토리에서 배포
vercel

# 환경변수 설정
vercel env add VITE_FIREBASE_API_KEY
vercel env add VITE_FIREBASE_AUTH_DOMAIN
vercel env add VITE_FIREBASE_PROJECT_ID
vercel env add VITE_FIREBASE_STORAGE_BUCKET
vercel env add VITE_FIREBASE_MESSAGING_SENDER_ID
vercel env add VITE_FIREBASE_APP_ID
```

#### 방법 2: Vercel 웹사이트 사용
1. [Vercel](https://vercel.com)에 GitHub 계정으로 로그인
2. "New Project" 클릭
3. GitHub 저장소 연결
4. 환경변수 설정:
   - `VITE_FIREBASE_API_KEY`: Firebase API Key
   - `VITE_FIREBASE_AUTH_DOMAIN`: Firebase Auth Domain
   - `VITE_FIREBASE_PROJECT_ID`: Firebase Project ID
   - `VITE_FIREBASE_STORAGE_BUCKET`: Firebase Storage Bucket
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`: Firebase Messaging Sender ID
   - `VITE_FIREBASE_APP_ID`: Firebase App ID
5. "Deploy" 클릭

### 4. Firebase 보안 규칙 설정

Firestore 보안 규칙을 다음과 같이 설정:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 사용자별 이벤트 (개인 데이터)
    match /events/{eventId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    // 공개 모임 데이터
    match /meetings/{meetingId} {
      allow read: if true; // 모든 사용자가 읽기 가능
      allow create: if request.auth != null;
      allow update: if request.auth != null && (
        // 모임장이거나 참여자인 경우
        request.auth.uid == resource.data.owner ||
        request.auth.uid in resource.data.participants[].userId
      );
      allow delete: if request.auth != null && request.auth.uid == resource.data.owner;
    }
  }
}
```

### 5. 도메인 설정 (선택사항)

1. Vercel 대시보드에서 프로젝트 선택
2. Settings > Domains에서 커스텀 도메인 추가
3. Firebase Authentication의 승인된 도메인에 새 도메인 추가

## 🔧 로컬 개발 환경 설정

### 1. 환경변수 파일 생성
`.env.local` 파일을 생성하고 Firebase 설정 정보를 입력:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 2. 개발 서버 실행
```bash
npm install
npm run dev
```

## 📱 기능 설명

### 실시간 동기화
- **개인 일정**: 사용자별로 분리되어 저장, 실시간 동기화
- **공유 모임**: 모든 사용자가 접근 가능, 실시간 업데이트
- **다중 기기 지원**: 로그인한 모든 기기에서 동일한 데이터 접근

### 데이터 구조
- **Events**: 개인 일정 (userId로 분리)
- **Meetings**: 공개 모임 (모든 사용자 접근 가능)

### 보안
- Firebase Authentication으로 사용자 인증
- Firestore 보안 규칙으로 데이터 접근 제어
- 사용자별 데이터 격리

## 🚨 주의사항

1. **환경변수 보안**: `.env.local` 파일을 Git에 커밋하지 마세요
2. **Firebase 보안 규칙**: 프로덕션 환경에서는 적절한 보안 규칙을 설정하세요
3. **도메인 설정**: Firebase Authentication에 배포 도메인을 추가하세요
4. **데이터 백업**: 중요한 데이터는 정기적으로 백업하세요

## 🆘 문제 해결

### 일반적인 문제들:

1. **로그인 실패**: Firebase Authentication 설정 확인
2. **데이터 로드 실패**: Firestore 보안 규칙 확인
3. **배포 실패**: 환경변수 설정 확인
4. **빌드 오류**: Node.js 버전 확인 (18+ 권장)

### 지원
문제가 발생하면 GitHub Issues에 문의하세요.
