import { useState, useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import axios from 'axios'
import 'leaflet/dist/leaflet.css'
import './App.css'

// 💡 교육용 주석: 백엔드 API의 주소입니다. (도커 백엔드가 8000번 포트에서 실행 중)
const API_BASE = 'http://localhost:8000'

// 💡 교육용 주석: 엘리베이터 데이터의 TypeScript 타입 정의 (데이터의 설계도)
interface Elevator {
  id: string
  station_name: string
  line: string
  source: string
  elevator_id: string
  exit_number: string
  location_detail: string
  location_type: string
  start_floor: string
  end_floor: string
  capacity_persons: string
  capacity_kg: string
  status: string
  lat: number | null
  lng: number | null
  has_coordinates: boolean
}

interface Stats {
  total: number
  with_coordinates: number
  without_coordinates: number
  seoul_count: number
  gyeonggi_count: number
}

// 💡 교육용 주석: 지도 마커 아이콘을 커스터마이징합니다.
const createIcon = (type: string) => {
  const color = type === '지상' ? '#10b981' : '#6366f1'
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: 12px; height: 12px;
      background: ${color};
      border: 2px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 6px rgba(0,0,0,0.4);
    "></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  })
}

// 💡 교육용 주석: 지도 중심을 이동시키는 헬퍼 컴포넌트
function FlyToMarker({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap()
  useEffect(() => {
    map.flyTo([lat, lng], 16, { duration: 1.2 })
  }, [lat, lng, map])
  return null
}

function App() {
  // 💡 교육용 주석: React의 '상태(State)'들 - 앱이 기억하고 있어야 할 정보들입니다.
  const [elevators, setElevators] = useState<Elevator[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLine, setSelectedLine] = useState<string | null>(null)
  const [flyTo, setFlyTo] = useState<{ lat: number; lng: number } | null>(null)

  // 💡 교육용 주석: 앱이 처음 켜질 때 백엔드에서 데이터를 가져옵니다.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [elevRes, statsRes] = await Promise.all([
          axios.get(`${API_BASE}/api/elevators?has_coordinates=true`),
          axios.get(`${API_BASE}/api/elevators/stats`),
        ])
        setElevators(elevRes.data)
        setStats(statsRes.data)
      } catch (error) {
        console.error('데이터 로드 실패:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // 💡 교육용 주석: 호선 목록을 데이터에서 자동 추출합니다.
  const lines = useMemo(() => {
    const lineSet = new Set(elevators.map(e => e.line).filter(Boolean))
    return Array.from(lineSet).sort()
  }, [elevators])

  // 💡 교육용 주석: 검색어와 호선 필터를 적용합니다.
  const filtered = useMemo(() => {
    return elevators.filter(e => {
      const matchSearch = !searchTerm || e.station_name.includes(searchTerm)
      const matchLine = !selectedLine || e.line === selectedLine
      return matchSearch && matchLine
    })
  }, [elevators, searchTerm, selectedLine])

  // 역 단위로 그룹핑하여 사이드바에 표시 (같은 역 엘리베이터 묶기)
  const groupedByStation = useMemo(() => {
    const groups: Record<string, Elevator[]> = {}
    filtered.forEach(e => {
      const key = e.station_name
      if (!groups[key]) groups[key] = []
      groups[key].push(e)
    })
    return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]))
  }, [filtered])

  if (loading) {
    return (
      <div className="loading">
        <div className="loading__spinner" />
        <div className="loading__text">수도권 엘리베이터 데이터를 불러오는 중...</div>
      </div>
    )
  }

  return (
    <>
      {/* 상단 헤더 */}
      <header className="header">
        <div className="header__logo">
          <span className="header__logo-icon">🚇</span>
          <div>
            <div className="header__title">MetroLift</div>
            <div className="header__subtitle">수도권 지하철 엘리베이터 안내</div>
          </div>
        </div>
        <div className="header__stats">
          <div className="stat-badge">
            🏢 전체 <span className="stat-badge__number">{stats?.total.toLocaleString()}</span>
          </div>
          <div className="stat-badge">
            📍 지도표시 <span className="stat-badge__number">{stats?.with_coordinates.toLocaleString()}</span>
          </div>
          <div className="stat-badge">
            🔍 검색결과 <span className="stat-badge__number">{filtered.length.toLocaleString()}</span>
          </div>
        </div>
      </header>

      {/* 메인 영역 */}
      <div className="main">
        {/* 사이드바 */}
        <aside className="sidebar">
          <div className="sidebar__search">
            <div className="search-wrapper">
              <span className="search-icon">🔍</span>
              <input
                className="search-input"
                type="text"
                placeholder="역 이름으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="filter-group">
            <button
              className={`filter-btn ${!selectedLine ? 'filter-btn--active' : ''}`}
              onClick={() => setSelectedLine(null)}
            >
              전체
            </button>
            {lines.map(line => (
              <button
                key={line}
                className={`filter-btn ${selectedLine === line ? 'filter-btn--active' : ''}`}
                onClick={() => setSelectedLine(selectedLine === line ? null : line)}
              >
                {line}
              </button>
            ))}
          </div>

          <div className="elevator-list">
            {groupedByStation.map(([stationName, elevs]) => (
              <div
                key={stationName}
                className="elevator-card"
                onClick={() => {
                  const e = elevs[0]
                  if (e.lat && e.lng) setFlyTo({ lat: e.lat, lng: e.lng })
                }}
              >
                <div className="elevator-card__header">
                  <span className="elevator-card__station">{stationName}</span>
                  <span className="elevator-card__line">{elevs[0].line}</span>
                </div>
                <div className="elevator-card__detail">
                  엘리베이터 {elevs.length}대 | {elevs[0].source}
                </div>
                <div className="elevator-card__tags">
                  {elevs.some(e => e.location_type === '지상') && (
                    <span className="tag tag--ground">지상</span>
                  )}
                  {elevs.some(e => e.location_type === '지하') && (
                    <span className="tag tag--underground">지하</span>
                  )}
                  <span className="tag tag--status-normal">● 정상</span>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* 지도 */}
        <div className="map-container">
          <MapContainer
            center={[37.5665, 126.978]}
            zoom={12}
            style={{ width: '100%', height: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {flyTo && <FlyToMarker lat={flyTo.lat} lng={flyTo.lng} />}
            {filtered.map(elevator => (
              elevator.lat && elevator.lng ? (
                <Marker
                  key={elevator.id}
                  position={[elevator.lat, elevator.lng]}
                  icon={createIcon(elevator.location_type)}
                >
                  <Popup>
                    <div className="popup-content">
                      <h3>🛗 {elevator.station_name}</h3>
                      <p><strong>호선:</strong> {elevator.line}</p>
                      <p><strong>출입구:</strong> {elevator.exit_number || '정보 없음'}</p>
                      <p><strong>위치:</strong> {elevator.location_detail || '정보 없음'}</p>
                      <p><strong>정원:</strong> {elevator.capacity_persons}명 / {elevator.capacity_kg}kg</p>
                      <span className={`popup-tag ${elevator.location_type === '지상' ? 'tag--ground' : 'tag--underground'}`}>
                        {elevator.location_type}
                      </span>
                      <span className="popup-tag tag--status-normal">● {elevator.status}</span>
                    </div>
                  </Popup>
                </Marker>
              ) : null
            ))}
          </MapContainer>
        </div>
      </div>
    </>
  )
}

export default App
