import React from 'react'

function TestApp() {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <h1 style={{ color: '#004191', fontSize: '2rem', marginBottom: '20px' }}>
        KAIST Scheduler 테스트
      </h1>
      <p style={{ fontSize: '1.2rem', color: '#333' }}>
        React가 정상적으로 작동하고 있습니다! 🎉
      </p>
      <div style={{ 
        marginTop: '20px', 
        padding: '20px', 
        backgroundColor: 'white', 
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h2>기능 테스트</h2>
        <ul>
          <li>✅ React 컴포넌트 렌더링</li>
          <li>✅ CSS 스타일링</li>
          <li>✅ JavaScript 실행</li>
        </ul>
      </div>
    </div>
  )
}

export default TestApp
