// KAIST 캠퍼스 건물 데이터 (공식 KAIST 캠퍼스맵 기준)
export const buildings = {
  // 북측 건물 (공식 KAIST 캠퍼스맵 기준)
  north: [
    { id: 'N0', name: '동문', englishName: 'East Gate', type: 'gate', x: 85, y: 12 },
    { id: 'N1', name: '김병호·김상열 융합 빌딩', englishName: 'Kim Beang Ho & Kim Sam-Youl TC Building', type: 'academic', x: 82, y: 18 },
    { id: 'N2', name: '행정분관', englishName: 'Branch Administration B/D', type: 'administration', x: 78, y: 22 },
    { id: 'N3', name: '스포츠 컴플렉스', englishName: 'Sports Complex', type: 'sports', x: 50, y: 25 },
    { id: 'N4', name: '인문사회과학부동', englishName: 'School of Humanities & Social Science B/D', type: 'academic', x: 45, y: 30 },
    { id: 'N5', name: '기초실험연구동', englishName: 'Basic Experiment & Research B/D', type: 'research', x: 40, y: 35 },
    { id: 'N6', name: '교수회관', englishName: 'Faculty Hall', type: 'faculty', x: 35, y: 40 },
    { id: 'N7', name: '기계공학동', englishName: 'Mechanical Engineering B/D', type: 'academic', x: 15, y: 15 },
    { id: 'N9', name: '실습동', englishName: 'Practice B/D', type: 'academic', x: 30, y: 45 },
    { id: 'N10', name: '교양분관', englishName: 'Undergraduate Branch Library', type: 'library', x: 25, y: 50 },
    { id: 'N11', name: '학생식당', englishName: 'Cafeteria', type: 'dining', x: 20, y: 55 },
    { id: 'N12', name: '학생회관-2', englishName: 'Student Center-2', type: 'student', x: 15, y: 60 },
    { id: 'N13', name: '태울관', englishName: 'Tae Wul Gwan', type: 'dormitory', x: 10, y: 65 },
    { id: 'N14', name: '사랑관', englishName: 'Sarang Hall', type: 'dormitory', x: 5, y: 70 },
    { id: 'N15', name: '교직원 숙소', englishName: 'Staff Accommodation', type: 'staff', x: 0, y: 75 },
    { id: 'N16', name: '소망관', englishName: 'Somang Hall', type: 'dormitory', x: 90, y: 8 },
    { id: 'N17', name: '성실관', englishName: 'Seongsil Hall', type: 'dormitory', x: 95, y: 3 },
    { id: 'N18', name: '진리관', englishName: 'Jilli Hall', type: 'dormitory', x: 100, y: 0 },
    { id: 'N19', name: '아름관', englishName: 'Areum Hall', type: 'dormitory', x: 105, y: 3 },
    { id: 'N20', name: '신뢰관', englishName: 'Siltoe Hall', type: 'dormitory', x: 110, y: 8 },
    { id: 'N21', name: '지혜관', englishName: 'Jihye Hall', type: 'dormitory', x: 115, y: 12 },
    { id: 'N22', name: '동문창업관', englishName: 'Alumni Venture Hall', type: 'venture', x: 120, y: 16 },
    { id: 'N23', name: 'IMR 센터', englishName: 'IMRI Center', type: 'research', x: 125, y: 20 },
    { id: 'N24', name: 'L0 이노베이션홀', englishName: 'L0 Innovation Hall', type: 'innovation', x: 130, y: 24 },
    { id: 'N25', name: '산업디자인학과동', englishName: 'Dept. of Industrial Design B/D', type: 'academic', x: 135, y: 28 },
    { id: 'N26', name: '고성능집적시스템연구센터', englishName: 'Center for High-Performance Integrated Systems', type: 'research', x: 140, y: 32 },
    { id: 'N27', name: '유레카관', englishName: 'Eureka Hall', type: 'innovation', x: 145, y: 36 },
    { id: 'N28', name: '에너지환경연구센터', englishName: 'Energy & Environment Research Center', type: 'research', x: 150, y: 40 }
  ],
  
  // 동측 건물 (실제 지도 위치 기준 - 이미지에서 보이는 위치)
  east: [
    { id: 'E1', name: '정문', englishName: 'Main Gate', type: 'gate', x: 50, y: 88 },
    { id: 'E2', name: '산업경영학동', englishName: 'Industrial Engineering & Management B/D', type: 'academic', x: 55, y: 83 },
    { id: 'E3', name: '정보전자공학동', englishName: 'Information & Electronics B/D', type: 'academic', x: 60, y: 78 },
    { id: 'E4', name: 'KI빌딩', englishName: 'KAIST Institutes B/D', type: 'research', x: 50, y: 50 },
    { id: 'E5', name: '교직원회관', englishName: 'Faculty Club', type: 'faculty', x: 65, y: 73 },
    { id: 'E6', name: '자연과학동', englishName: 'Natural Science B/D', type: 'academic', x: 70, y: 68 },
    { id: 'E7', name: '의과학연구센터', englishName: 'Biomedical Research Center', type: 'research', x: 75, y: 63 },
    { id: 'E8', name: '세종관', englishName: 'Sejong Hall', type: 'dormitory', x: 80, y: 58 },
    { id: 'E9', name: '학술문화관', englishName: 'Academic Cultural Complex', type: 'cultural', x: 85, y: 53 },
    { id: 'E10', name: '중앙창고', englishName: 'Storehouse', type: 'facility', x: 90, y: 48 },
    { id: 'E11', name: '창의학습관', englishName: 'Creative Learning B/D', type: 'academic', x: 95, y: 43 },
    { id: 'E12', name: '중앙기계실', englishName: 'Energy Plant', type: 'facility', x: 100, y: 38 },
    { id: 'E13', name: '인공위성연구센터', englishName: 'Satellite Technology Research Center', type: 'research', x: 105, y: 33 },
    { id: 'E14', name: '본관', englishName: 'Main Administration B/D', type: 'administration', x: 110, y: 28 },
    { id: 'E15', name: '대강당', englishName: 'Auditorium', type: 'cultural', x: 115, y: 23 },
    { id: 'E16', name: '정문술빌딩', englishName: 'ChungMoonSoul Building', type: 'academic', x: 120, y: 18 },
    { id: 'E17', name: '운동장', englishName: 'Stadium', type: 'sports', x: 85, y: 83 },
    { id: 'E18', name: '대전질환모델동물센터', englishName: 'Daejeon Disease-model Animal Center', type: 'research', x: 90, y: 78 },
    { id: 'E19', name: 'KAIST 부설 나노종합기술원', englishName: 'National Nano Fab Center', type: 'research', x: 95, y: 73 },
    { id: 'E20', name: '계룡관', englishName: 'Kyeryong Hall', type: 'academic', x: 100, y: 68 },
    { id: 'E21', name: '카이스트 클리닉', englishName: 'KAIST Clinic', type: 'medical', x: 105, y: 63 }
  ],
  
  // 서측 건물 (실제 지도 위치 기준 - 이미지에서 보이는 위치)
  west: [
    { id: 'W1', name: '응용공학동', englishName: 'Applied Engineering B/D', type: 'academic', x: 20, y: 63 },
    { id: 'W2', name: '학생회관-1', englishName: 'Student Center-1', type: 'student', x: 15, y: 68 },
    { id: 'W3', name: '갈릴레이관', englishName: 'Galilei Hall', type: 'dormitory', x: 10, y: 73 },
    { id: 'W4', name: '여울관, 나들관, 다솜관, 희망관', englishName: 'Yeoul, Nadeul, Dasom, Huimang Hall', type: 'dormitory', x: 5, y: 78 },
    { id: 'W5', name: '기혼자기숙사, 스타트업빌리지', englishName: 'Married Student Housing, Startup Village', type: 'dormitory', x: 0, y: 83 },
    { id: 'W6', name: '미르관, 나래관', englishName: 'Mir Hall, Narae Hall', type: 'dormitory', x: 25, y: 58 },
    { id: 'W7', name: '나눔관', englishName: 'Nanum Hall', type: 'dormitory', x: 30, y: 53 },
    { id: 'W8', name: '교육지원동', englishName: 'Educational Support B/D', type: 'academic', x: 35, y: 48 },
    { id: 'W9', name: '노천극장', englishName: 'Outdoor Theater', type: 'cultural', x: 40, y: 43 },
    { id: 'W10', name: '풍동실험실', englishName: 'Wind Tunnel Laboratory', type: 'research', x: 45, y: 38 },
    { id: 'W11', name: '외국인교수 아파트', englishName: 'International Faculty Apartment', type: 'staff', x: 50, y: 33 },
    { id: 'W12', name: '서측기계실', englishName: 'West Energy Plant', type: 'facility', x: 55, y: 28 },
    { id: 'W16', name: '지오센트리퓨지 실험동', englishName: 'Geotechnical Centrifuge Testing Center', type: 'research', x: 60, y: 23 }
  ]
}


// 건물 타입 정의
export const buildingTypes = {
  academic: { label: '학술', color: '#3B82F6' },
  research: { label: '연구', color: '#10B981' },
  dormitory: { label: '기숙사', color: '#F59E0B' },
  administration: { label: '행정', color: '#EF4444' },
  sports: { label: '체육', color: '#8B5CF6' },
  dining: { label: '식당', color: '#06B6D4' },
  library: { label: '도서관', color: '#84CC16' },
  faculty: { label: '교수', color: '#F97316' },
  student: { label: '학생', color: '#EC4899' },
  staff: { label: '교직원', color: '#6366F1' },
  gate: { label: '출입구', color: '#64748B' },
  cultural: { label: '문화', color: '#A855F7' },
  facility: { label: '시설', color: '#6B7280' },
  medical: { label: '의료', color: '#DC2626' },
  venture: { label: '창업', color: '#059669' },
  innovation: { label: '혁신', color: '#7C3AED' }
}

// 모든 건물을 하나의 배열로 합치기
export const allBuildings = [
  ...buildings.north,
  ...buildings.east,
  ...buildings.west
]

// 건물 ID로 건물 찾기
export const getBuildingById = (id) => {
  return allBuildings.find(building => building.id === id)
}

// 건물 타입별 필터링
export const getBuildingsByType = (type) => {
  return allBuildings.filter(building => building.type === type)
}
