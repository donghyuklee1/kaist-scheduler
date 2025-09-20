# KAIST Scheduler 🎓

KAIST 학생들을 위한 모임 및 일정 관리 플랫폼입니다. when2meet과 유사한 기능을 제공하며, 더욱 세련된 UI와 인터랙티브한 기능을 포함합니다.

## ✨ 주요 기능

### 🎯 모임 관리
- **모임 생성**: 세미나, 스터디, 프로젝트, 모임, 워크샵, 컨퍼런스 등 다양한 타입
- **참여 신청**: 다른 사용자가 모임에 참여 신청 가능
- **승인 시스템**: 모임장이 참여자를 승인/거절할 수 있는 시스템
- **모임 상태 관리**: 초안, 참여 신청 중, 신청 마감, 확정, 취소

### ⏰ 시간 조율 (when2meet 스타일)
- **드래그 선택**: 마우스로 시간대를 드래그하여 선택
- **가용성 표시**: 많은 사람이 가능한 시간대는 진하게 표시
- **실시간 업데이트**: 참여자별 가능한 시간 실시간 반영
- **시각적 피드백**: 색상으로 가용성 레벨 표시

### 🏢 캠퍼스맵
- **인터랙티브 맵**: KAIST 캠퍼스맵에서 건물 클릭으로 모임 생성
- **건물별 필터링**: 특정 건물의 모임만 필터링 가능
- **실시간 이벤트 표시**: 각 건물에 예정된 이벤트 수 표시

### 👥 사용자 관리
- **Google 로그인**: KAIST 이메일 또는 Gmail로 로그인
- **사용자 프로필**: 개인 정보 및 참여 모임 관리
- **역할 관리**: 학생, 교수, 직원, 관리자 역할 구분

### 🌙 다크모드
- **토글 버튼**: 헤더에 다크모드 전환 버튼
- **시스템 설정 연동**: OS 다크모드 설정 자동 감지
- **전체 UI 지원**: 모든 컴포넌트 다크모드 지원

## 🚀 시작하기

### 1. 프로젝트 클론
```bash
git clone <repository-url>
cd kaist-scheduler
```

### 2. 의존성 설치
```bash
npm install
```

### 3. Firebase 설정

#### 3.1 Firebase 프로젝트 생성
1. [Firebase Console](https://console.firebase.google.com/)에 접속
2. 새 프로젝트 생성
3. Authentication 활성화
4. Google 로그인 제공업체 활성화
5. 도메인 설정 (localhost:3001, 배포 도메인)

#### 3.2 환경 변수 설정
프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
# Firebase 설정
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# 개발 환경
VITE_APP_ENV=development
VITE_APP_URL=http://localhost:3001
```

### 4. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 `http://localhost:3001`로 접속하세요.

## 🌐 배포

### Vercel 배포 (권장)

#### 1. Vercel CLI 설치
```bash
npm install -g vercel
```

#### 2. Vercel 로그인
```bash
vercel login
```

#### 3. 프로젝트 배포
```bash
vercel
```

#### 4. 환경 변수 설정
Vercel 대시보드에서 환경 변수를 설정하세요:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

### 다른 플랫폼 배포

#### Netlify
```bash
npm run build
# dist 폴더를 Netlify에 업로드
```

#### GitHub Pages
```bash
npm run build
# dist 폴더를 gh-pages 브랜치에 푸시
```

## 🛠️ 기술 스택

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS, Framer Motion
- **Authentication**: Firebase Auth
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Deployment**: Vercel

## 📱 반응형 디자인

- **데스크톱**: 전체 기능 지원
- **태블릿**: 최적화된 레이아웃
- **모바일**: 터치 친화적 인터페이스

## 🔒 보안

- **Firebase Auth**: 안전한 인증 시스템
- **이메일 도메인 제한**: @kaist.ac.kr 또는 @gmail.com 이메일 허용
- **HTTPS**: 모든 통신 암호화
- **CSP**: Content Security Policy 적용

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 지원

문제가 발생하거나 질문이 있으시면 이슈를 생성해주세요.

---

**KAIST Scheduler** - KAIST 학생들의 효율적인 모임과 일정 관리를 위한 플랫폼 🎓✨