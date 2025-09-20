
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Building, Users, Calendar, Clock } from 'lucide-react'
import { allBuildings, buildingTypes, getBuildingById } from '../data/buildings'

const CampusMap = ({ onBuildingClick, selectedBuilding, events = [] }) => {
  const [hoveredBuilding, setHoveredBuilding] = useState(null)
  const [showBuildingList, setShowBuildingList] = useState(false)
  const [filterType, setFilterType] = useState('all')

  // 건물별 이벤트 개수 계산
  const getEventCount = (buildingId) => {
    return events.filter(event => event.location === buildingId).length
  }

  // 필터링된 건물 목록
  const filteredBuildings = filterType === 'all' 
    ? allBuildings 
    : allBuildings.filter(building => building.type === filterType)

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-kaist-blue to-kaist-lightblue rounded-xl flex items-center justify-center">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-kaist-blue">KAIST 캠퍼스맵</h2>
            <p className="text-sm text-gray-600">건물을 클릭하여 모임을 개설하세요</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowBuildingList(!showBuildingList)}
            className="btn-secondary flex items-center space-x-2"
          >
            <Building className="w-4 h-4" />
            <span>건물 목록</span>
          </motion.button>
        </div>
      </div>

      {/* 필터 */}
      <div className="flex items-center space-x-2 flex-wrap gap-2">
        <span className="text-sm font-medium text-gray-600">건물 타입:</span>
        {Object.entries(buildingTypes).map(([type, info]) => (
          <motion.button
            key={type}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilterType(filterType === type ? 'all' : type)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-1 ${
              filterType === type
                ? 'bg-kaist-blue text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span>{info.icon}</span>
            <span>{info.label}</span>
          </motion.button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 캠퍼스맵 */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-effect rounded-2xl p-6 relative overflow-hidden"
          >
            <div className="relative w-full h-[600px] rounded-xl overflow-hidden bg-gradient-to-br from-blue-50 via-green-50 to-purple-50">
              {/* 캠퍼스맵 배경 디자인 */}
              <div className="absolute inset-0">
                {/* 주요 도로 (가로) */}
                <div className="absolute top-1/2 left-0 right-0 h-4 bg-gray-400/70 transform -translate-y-1/2"></div>
                <div className="absolute top-1/4 left-0 right-0 h-2 bg-gray-300/50"></div>
                <div className="absolute top-3/4 left-0 right-0 h-2 bg-gray-300/50"></div>
                
                {/* 주요 도로 (세로) */}
                <div className="absolute left-1/2 top-0 bottom-0 w-4 bg-gray-400/70 transform -translate-x-1/2"></div>
                <div className="absolute left-1/4 top-0 bottom-0 w-2 bg-gray-300/50"></div>
                <div className="absolute left-3/4 top-0 bottom-0 w-2 bg-gray-300/50"></div>
                
                {/* 보조 도로들 */}
                <div className="absolute top-1/6 left-0 right-0 h-1 bg-gray-200/40"></div>
                <div className="absolute top-5/6 left-0 right-0 h-1 bg-gray-200/40"></div>
                <div className="absolute left-1/6 top-0 bottom-0 w-1 bg-gray-200/40"></div>
                <div className="absolute left-5/6 top-0 bottom-0 w-1 bg-gray-200/40"></div>
                
                {/* 녹지 공간들 */}
                <div className="absolute top-8 left-8 w-24 h-24 bg-green-300/40 rounded-full"></div>
                <div className="absolute top-16 right-16 w-20 h-20 bg-green-300/40 rounded-full"></div>
                <div className="absolute bottom-16 left-16 w-28 h-28 bg-green-300/40 rounded-full"></div>
                <div className="absolute bottom-8 right-8 w-22 h-22 bg-green-300/40 rounded-full"></div>
                
                {/* 중앙 연못/광장 */}
                <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-blue-300/50 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                
                {/* 건물 구역 배경 */}
                <div className="absolute top-0 left-0 w-full h-1/3 bg-red-100/30"></div>
                <div className="absolute top-1/3 left-0 w-full h-1/3 bg-blue-100/30"></div>
                <div className="absolute bottom-0 left-0 w-full h-1/3 bg-green-100/30"></div>
                
                {/* 그리드 패턴 */}
                <div className="absolute inset-0 opacity-20" style={{
                  backgroundImage: `
                    linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px'
                }}></div>
              </div>
              
              {/* 건물들 */}
              {filteredBuildings.map((building) => {
                const eventCount = getEventCount(building.id)
                const isSelected = selectedBuilding?.id === building.id
                const isHovered = hoveredBuilding?.id === building.id
                const typeInfo = buildingTypes[building.type]
                
                return (
                  <motion.div
                    key={building.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: Math.random() * 0.5 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`absolute cursor-pointer transition-all duration-300 ${
                      isSelected ? 'z-20' : 'z-10'
                    }`}
                    style={{
                      left: `${building.x}%`,
                      top: `${building.y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    onClick={() => onBuildingClick(building)}
                    onMouseEnter={() => setHoveredBuilding(building)}
                    onMouseLeave={() => setHoveredBuilding(null)}
                  >
                    {/* 건물 마커 */}
                    <div className={`relative transition-all duration-300 ${
                      isSelected 
                        ? 'scale-125 z-20' 
                        : isHovered 
                          ? 'scale-110 z-15' 
                          : 'z-10'
                    }`}>
                      {/* 메인 버튼 */}
                      <div className={`w-12 h-12 rounded-full border-4 transition-all duration-300 ${
                        isSelected 
                          ? 'border-white shadow-2xl' 
                          : isHovered 
                            ? 'border-white shadow-xl' 
                            : 'border-white shadow-lg'
                      }`}
                      style={{ backgroundColor: typeInfo.color }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center text-white text-sm font-bold">
                          {building.id}
                        </div>
                      </div>
                      
                      {/* 펄스 효과 (선택된 건물) */}
                      {isSelected && (
                        <motion.div
                          animate={{ scale: [1, 1.5, 1], opacity: [0.7, 0, 0.7] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute inset-0 rounded-full border-2 border-white"
                          style={{ backgroundColor: typeInfo.color }}
                        />
                      )}
                      
                      {/* 이벤트 개수 표시 */}
                      {eventCount > 0 && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-3 -right-3 w-7 h-7 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-xl border-3 border-white"
                        >
                          {eventCount}
                        </motion.div>
                      )}
                      
                      {/* 건물명 툴팁 */}
                      {isHovered && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-30"
                        >
                          {building.name}
                          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black/80 rotate-45"></div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )
              })}
              
              {/* 범례 */}
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-white/20">
                <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                  <span>🏢</span>
                  <span>건물 타입</span>
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(buildingTypes).slice(0, 8).map(([type, info]) => (
                    <div key={type} className="flex items-center space-x-2 text-xs">
                      <div 
                        className="w-4 h-4 rounded-full border border-gray-300" 
                        style={{ backgroundColor: info.color }}
                      ></div>
                      <span className="text-gray-700 font-medium">{info.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* 나침반 */}
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-xl border border-white/20">
                <div className="text-center">
                  <div className="w-8 h-8 mx-auto mb-1 flex items-center justify-center">
                    <span className="text-lg">🧭</span>
                  </div>
                  <div className="text-xs font-semibold text-gray-700">N</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 건물 정보 및 목록 */}
        <div className="space-y-4">
          {/* 선택된 건물 정보 */}
          {selectedBuilding && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-effect rounded-xl p-4"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: buildingTypes[selectedBuilding.type].color }}
                >
                  {selectedBuilding.id}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedBuilding.name}</h3>
                  <p className="text-sm text-gray-600">{selectedBuilding.englishName}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-sm">{buildingTypes[selectedBuilding.type].icon}</span>
                <span className="text-sm text-gray-600">{buildingTypes[selectedBuilding.type].label}</span>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{getEventCount(selectedBuilding.id)}개 모임</span>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onBuildingClick(selectedBuilding)}
                className="w-full btn-primary"
              >
                이 건물에서 모임 개설
              </motion.button>
            </motion.div>
          )}

          {/* 건물 목록 */}
          {showBuildingList && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-effect rounded-xl p-4 max-h-96 overflow-y-auto"
            >
              <h3 className="font-semibold text-gray-900 mb-3">건물 목록</h3>
              <div className="space-y-2">
                {filteredBuildings.map((building) => {
                  const eventCount = getEventCount(building.id)
                  const typeInfo = buildingTypes[building.type]
                  
                  return (
                    <motion.div
                      key={building.id}
                      whileHover={{ scale: 1.02 }}
                      className={`p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                        selectedBuilding?.id === building.id 
                          ? 'bg-kaist-blue/10 border border-kaist-blue' 
                          : 'bg-white hover:bg-gray-50 border border-gray-200'
                      }`}
                      onClick={() => onBuildingClick(building)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                            style={{ backgroundColor: typeInfo.color }}
                          >
                            {building.id}
                          </div>
                          <div>
                            <div className="font-medium text-sm text-gray-900">{building.name}</div>
                            <div className="text-xs text-gray-500">{typeInfo.label}</div>
                          </div>
                        </div>
                        
                        {eventCount > 0 && (
                          <div className="flex items-center space-x-1">
                            <Users className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{eventCount}</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CampusMap
