# Firebase 설정 가이드

## 🚨 중요: Firebase 400 오류 해결

현재 Firestore에서 400 오류가 발생하고 있습니다. 이는 Firebase 설정이 완료되지 않았기 때문입니다.

## 1단계: Firebase 프로젝트 생성 및 설정

### 1. Firebase Console 접속
1. [Firebase Console](https://console.firebase.google.com/)에 접속
2. "프로젝트 추가" 클릭
3. 프로젝트 이름 입력 (예: "kaist-scheduler")
4. Google Analytics 활성화 (선택사항)
5. 프로젝트 생성 완료

### 2. 웹 앱 추가
1. 프로젝트 대시보드에서 "웹" 아이콘 클릭
2. 앱 닉네임 입력 (예: "kaist-scheduler-web")
3. Firebase Hosting 설정 (선택사항)
4. 앱 등록 완료

### 3. Firebase SDK 설정 복사
앱 등록 후 나타나는 설정 코드에서 다음 값들을 복사:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...", // 이 값 복사
  authDomain: "kaist-scheduler.firebaseapp.com", // 이 값 복사
  projectId: "kaist-scheduler", // 이 값 복사
  storageBucket: "kaist-scheduler.appspot.com", // 이 값 복사
  messagingSenderId: "123456789", // 이 값 복사
  appId: "1:123456789:web:abc123" // 이 값 복사
}
```

## 2단계: 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가:

```env
# Firebase 설정
VITE_FIREBASE_API_KEY=AIzaSyC... (위에서 복사한 값)
VITE_FIREBASE_AUTH_DOMAIN=kaist-scheduler.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=kaist-scheduler
VITE_FIREBASE_STORAGE_BUCKET=kaist-scheduler.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

## 3단계: Firestore 보안 규칙 설정

모임 생성과 실시간 동기화가 제대로 작동하려면 Firebase Console에서 Firestore 보안 규칙을 설정해야 합니다.

### 1. Firebase Console 접속
1. [Firebase Console](https://console.firebase.google.com/)에 접속
2. 프로젝트 선택
3. 왼쪽 메뉴에서 "Firestore Database" 클릭
4. "규칙" 탭 클릭

### 2. 보안 규칙 설정
다음 규칙을 복사하여 붙여넣기:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 이벤트 컬렉션 - 사용자는 자신의 이벤트만 읽고 쓸 수 있음
    match /events/{eventId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    // 모임 컬렉션 - 모든 인증된 사용자가 읽을 수 있고, 작성자는 쓸 수 있음
    match /meetings/{meetingId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.owner;
      allow update: if request.auth != null && (
        request.auth.uid == resource.data.owner ||
        request.auth.uid in resource.data.participants[].userId
      );
      allow delete: if request.auth != null && request.auth.uid == resource.data.owner;
    }
  }
}
```

### 3. 규칙 게시
1. "게시" 버튼 클릭
2. 확인 대화상자에서 "게시" 클릭

### 4. 인덱스 설정 (선택사항)
만약 `orderBy` 쿼리를 사용하려면 복합 인덱스가 필요할 수 있습니다:

1. Firestore Database > "인덱스" 탭
2. "복합" 인덱스 생성
3. 컬렉션: `meetings`
4. 필드: `createdAt` (내림차순)

### 5. 환경 변수 확인
`.env.local` 파일에 다음 변수들이 설정되어 있는지 확인:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 6. 테스트 방법
1. 웹사이트에서 로그인
2. 모임 생성 시도
3. 브라우저 개발자 도구 콘솔에서 로그 확인
4. 다른 기기/브라우저에서 모임 목록 확인

### 문제 해결

#### 모임이 생성되지 않는 경우:
1. Firebase Console > Authentication > 사용자 탭에서 사용자가 등록되어 있는지 확인
2. Firestore > 데이터 탭에서 `meetings` 컬렉션이 생성되는지 확인
3. 브라우저 콘솔에서 에러 메시지 확인

#### 실시간 동기화가 안 되는 경우:
1. 네트워크 연결 확인
2. Firebase 프로젝트의 결제 계정 설정 확인 (무료 플랜도 가능)
3. 브라우저에서 Firebase 연결 상태 확인

#### 권한 오류가 발생하는 경우:
1. 보안 규칙이 올바르게 설정되었는지 확인
2. 사용자가 로그인되어 있는지 확인
3. 사용자 ID가 올바르게 전달되는지 확인
