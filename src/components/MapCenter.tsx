import React, { useState, useEffect, useRef } from 'react';
import {
  RotateCcw,
  Search,
  Eye,
  EyeOff,
  Navigation,
  Compass,
  Sparkles,
  Play,
  Pause,
  MapPin,
  Maximize,
  Info,
  Calendar,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import {
  DrillLevel,
  ProjectBlock,
  InspectionRecord,
  InspectorPersonnel,
  InspectionTrackPoint,
} from '../types/dashboard';
import {
  CITY_REGIONS,
  JINAN_COUNTIES,
  PROJECT_BLOCKS,
  INSPECTION_RECORDS,
  PERSONNEL_DUTY_LIST,
  INSPECTION_TRACK_POINTS,
} from '../data/mockData';

interface MapCenterProps {
  drillLevel: DrillLevel;
  selectedCity: string | null;
  selectedCounty: string | null;
  selectedBlockId: string | null;
  highlightedBlockId: string | null;
  activeTrackId: string | null;
  activeCallingPersonnel: InspectorPersonnel | null;
  onDrillChange: (level: DrillLevel, city?: string | null, county?: string | null, blockId?: string | null) => void;
  onSelectBlock: (block: ProjectBlock) => void;
  onOpenBlockDetail: (block: ProjectBlock) => void;
  onOpenInspectionDetail: (record: InspectionRecord) => void;
  onCloseTrackPlayback?: () => void;
}

export const MapCenter: React.FC<MapCenterProps> = ({
  drillLevel,
  selectedCity,
  selectedCounty,
  selectedBlockId,
  highlightedBlockId,
  activeTrackId,
  activeCallingPersonnel,
  onDrillChange,
  onSelectBlock,
  onOpenBlockDetail,
  onOpenInspectionDetail,
  onCloseTrackPlayback,
}) => {
  // Layer visibility toggles
  const [showBlocksLayer, setShowBlocksLayer] = useState(true);
  const [showInspectionLayer, setShowInspectionLayer] = useState(true);
  const [showGridsLayer, setShowGridsLayer] = useState(false);
  const [satelliteBg, setSatelliteBg] = useState(false);

  // Search input
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ProjectBlock[]>([]);

  // Auto Tour
  const [isAutoTouring, setIsAutoTouring] = useState(false);
  const tourIndexRef = useRef(0);

  // Track playback state (when activeTrackId is set)
  const [playbackTimeIndex, setPlaybackTimeIndex] = useState(0);
  const [isPlayingTrack, setIsPlayingTrack] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [selectedCheckin, setSelectedCheckin] = useState<InspectionTrackPoint | null>(null);

  // Hover Tooltip
  const [hoveredEntity, setHoveredEntity] = useState<{
    type: 'block' | 'city' | 'county' | 'inspection';
    title: string;
    subtitle?: string;
    x: number;
    y: number;
  } | null>(null);

  // Map viewport transform (Pan & Zoom)
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, width: 900, height: 600 });
  const svgRef = useRef<SVGSVGElement>(null);

  // Dynamic ViewBox based on Drill Level (Jilin Province & Siping / Lishu)
  useEffect(() => {
    if (drillLevel === 'province') {
      setViewBox({ x: 80, y: 120, width: 760, height: 480 });
    } else if (drillLevel === 'city') {
      if (selectedCity === '四平市') {
        setViewBox({ x: 250, y: 295, width: 180, height: 140 });
      } else if (selectedCity === '长春市') {
        setViewBox({ x: 340, y: 180, width: 170, height: 150 });
      } else {
        setViewBox({ x: 180, y: 150, width: 360, height: 280 });
      }
    } else if (drillLevel === 'county') {
      if (selectedCounty === '梨树县') {
        setViewBox({ x: 280, y: 305, width: 95, height: 85 });
      } else if (selectedCounty === '农安县') {
        setViewBox({ x: 380, y: 210, width: 90, height: 80 });
      } else {
        setViewBox({ x: 270, y: 290, width: 120, height: 110 });
      }
    } else if (drillLevel === 'project') {
      const blk = PROJECT_BLOCKS.find((b) => b.id === selectedBlockId);
      if (blk) {
        setViewBox({ x: blk.center[0] - 30, y: blk.center[1] - 25, width: 60, height: 50 });
      }
    }
  }, [drillLevel, selectedCity, selectedCounty, selectedBlockId]);

  // Handle Search Input
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const q = searchQuery.toLowerCase();
    const matched = PROJECT_BLOCKS.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.countyName.toLowerCase().includes(q) ||
        b.cityName.toLowerCase().includes(q) ||
        b.code.toLowerCase().includes(q)
    );
    setSearchResults(matched);
  }, [searchQuery]);

  // Auto Tour Timer
  useEffect(() => {
    if (!isAutoTouring) return;
    const tourInterval = setInterval(() => {
      const cityList = CITY_REGIONS;
      tourIndexRef.current = (tourIndexRef.current + 1) % cityList.length;
      const targetCity = cityList[tourIndexRef.current];
      onDrillChange('city', targetCity.name, null, null);
    }, 7000);

    return () => clearInterval(tourInterval);
  }, [isAutoTouring, onDrillChange]);

  // Track Playback Timer
  useEffect(() => {
    if (!activeTrackId || !isPlayingTrack) return;
    const interval = setInterval(() => {
      setPlaybackTimeIndex((prev) => {
        if (prev >= INSPECTION_TRACK_POINTS.length - 1) {
          setIsPlayingTrack(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1800 / playbackSpeed);

    return () => clearInterval(interval);
  }, [activeTrackId, isPlayingTrack, playbackSpeed]);

  // Reset to Province View
  const handleResetView = () => {
    setIsAutoTouring(false);
    onDrillChange('province', null, null, null);
  };

  // Status color helper
  const getStatusColor = (status: ProjectBlock['status']) => {
    switch (status) {
      case 'completed':
        return '#10b981'; // Green
      case 'constructing':
        return '#38bdf8'; // Blue
      case 'pending_acceptance':
        return '#f59e0b'; // Amber
      case 'overdue':
        return '#f43f5e'; // Red
      default:
        return '#38bdf8';
    }
  };

  const currentTrackPoint = INSPECTION_TRACK_POINTS[playbackTimeIndex] || INSPECTION_TRACK_POINTS[0];
  const selectedBlock = PROJECT_BLOCKS.find((b) => b.id === (selectedBlockId || highlightedBlockId));

  return (
    <main className="flex-1 h-full relative flex flex-col bg-[#070e24] overflow-hidden select-none border-x border-sky-950/60">
      {/* Background Grid Pattern or Satellite effect */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${
          satelliteBg ? 'opacity-30' : 'opacity-10'
        }`}
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.15) 0%, transparent 60%), linear-gradient(rgba(56, 189, 248, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 189, 248, 0.1) 1px, transparent 1px)',
          backgroundSize: '100% 100%, 40px 40px, 40px 40px',
        }}
      />

      {/* Top Map Control Bar: Breadcrumbs & Search & Auto Tour */}
      <div className="h-12 w-full px-5 flex items-center justify-between z-20 bg-gradient-to-b from-[#07132e]/90 to-transparent">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-medium">
          <button
            onClick={() => onDrillChange('province', null, null, null)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${
              drillLevel === 'province'
                ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <span>全省总览</span>
          </button>

          {selectedCity && (
            <>
              <span className="text-slate-600">/</span>
              <button
                onClick={() => onDrillChange('city', selectedCity, null, null)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  drillLevel === 'city'
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                {selectedCity}
              </button>
            </>
          )}

          {selectedCounty && (
            <>
              <span className="text-slate-600">/</span>
              <button
                onClick={() => onDrillChange('county', selectedCity, selectedCounty, null)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  drillLevel === 'county'
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                {selectedCounty}
              </button>
            </>
          )}

          {selectedBlockId && selectedBlock && (
            <>
              <span className="text-slate-600">/</span>
              <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/40 truncate max-w-[180px]">
                {selectedBlock.name}
              </span>
            </>
          )}
        </div>

        {/* Search Box & Auto Tour & Satellite toggle */}
        <div className="flex items-center gap-3">
          {/* Quick County / Project Search */}
          <div className="relative">
            <div className="flex items-center bg-[#0d1e44]/90 border border-sky-700/40 focus-within:border-cyan-400 rounded-lg px-2.5 py-1 text-xs">
              <Search className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
              <input
                type="text"
                placeholder="快速检索县区/项目..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-white placeholder-slate-400 focus:outline-none w-36 text-xs"
              />
            </div>

            {/* Search Dropdown Results */}
            {searchResults.length > 0 && (
              <div className="absolute right-0 top-8 w-72 max-h-56 overflow-y-auto bg-[#0a1838] border border-cyan-500/50 rounded-lg shadow-2xl p-1 z-50">
                {searchResults.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => {
                      setSearchQuery('');
                      onDrillChange('project', b.cityName, b.countyName, b.id);
                      onSelectBlock(b);
                    }}
                    className="p-2 hover:bg-cyan-950/80 rounded cursor-pointer text-xs flex flex-col transition-colors border-b border-sky-950/50 last:border-none"
                  >
                    <div className="flex items-center justify-between text-slate-100 font-medium">
                      <span className="truncate">{b.name}</span>
                      <span
                        className="text-[10px] px-1 py-0.5 rounded"
                        style={{ color: getStatusColor(b.status) }}
                      >
                        {b.progress}%
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-0.5">
                      {b.cityName} · {b.countyName} ({b.area.toLocaleString()} 亩)
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Auto Tour Toggle */}
          <button
            onClick={() => setIsAutoTouring(!isAutoTouring)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors ${
              isAutoTouring
                ? 'bg-amber-600/30 text-amber-300 border border-amber-500/50'
                : 'bg-[#0d1e44]/90 text-slate-300 hover:text-white border border-sky-800/40'
            }`}
            title="自动巡展全省地市"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>{isAutoTouring ? '停止巡展' : '自动巡展'}</span>
          </button>

          {/* Vector / Satellite texture toggle */}
          <button
            onClick={() => setSatelliteBg(!satelliteBg)}
            className={`px-2 py-1 rounded text-xs border transition-colors ${
              satelliteBg
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
                : 'bg-[#0d1e44]/80 text-slate-400 border-sky-900/40'
            }`}
            title="底图风格切换"
          >
            {satelliteBg ? '卫星影像' : '科技矢量'}
          </button>
        </div>
      </div>

      {/* Main Interactive Map Canvas */}
      <div className="relative flex-1 w-full h-full overflow-hidden flex items-center justify-center">
        <svg
          ref={svgRef}
          viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
          className="w-full h-full cursor-crosshair transition-all duration-700 ease-in-out"
          preserveAspectRatio="xMidYMid meet"
          onDoubleClick={() => {
            if (drillLevel === 'province') {
              onDrillChange('city', '四平市', null, null);
            } else if (drillLevel === 'city') {
              onDrillChange('county', selectedCity, '梨树县', null);
            }
          }}
        >
          {/* Defs for gradients, patterns and glow filters */}
          <defs>
            <radialGradient id="cityGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#07193f" stopOpacity="0.1" />
            </radialGradient>
            <linearGradient id="trackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#f43f5e" />
            </linearGradient>
            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* 1. Administrative Boundaries based on Level */}
          {drillLevel === 'province' && (
            <g className="cities-layer transition-opacity duration-500">
              {CITY_REGIONS.map((city) => {
                const isHovered = hoveredEntity?.type === 'city' && hoveredEntity.title === city.name;
                return (
                  <g
                    key={city.id}
                    onClick={() => onDrillChange('city', city.name, null, null)}
                    onMouseEnter={(e) => {
                      setHoveredEntity({
                        type: 'city',
                        title: city.name,
                        subtitle: `高标准农田: ${city.completedArea}万亩 · ${city.projectCount}个项目`,
                        x: e.clientX,
                        y: e.clientY,
                      });
                    }}
                    onMouseLeave={() => setHoveredEntity(null)}
                    className="cursor-pointer group"
                  >
                    {/* City polygon area */}
                    <path
                      d={city.svgPath}
                      fill={isHovered ? 'rgba(14, 116, 144, 0.45)' : 'rgba(12, 40, 92, 0.5)'}
                      stroke={isHovered ? '#38bdf8' : '#1e40af'}
                      strokeWidth={isHovered ? 2.5 : 1.2}
                      className="transition-all duration-300"
                    />

                    {/* City Center Node */}
                    <circle
                      cx={city.center[0]}
                      cy={city.center[1]}
                      r={isHovered ? 7 : 5}
                      fill="#38bdf8"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                      className="filter drop-shadow"
                    />

                    {/* City Label */}
                    <text
                      x={city.center[0]}
                      y={city.center[1] + 16}
                      textAnchor="middle"
                      fill="#e2e8f0"
                      fontSize="11"
                      fontWeight="bold"
                      className="pointer-events-none tracking-wide"
                    >
                      {city.name}
                    </text>

                    {/* Metric badge under label */}
                    <text
                      x={city.center[0]}
                      y={city.center[1] + 28}
                      textAnchor="middle"
                      fill="#38bdf8"
                      fontSize="9"
                      fontFamily="monospace"
                      className="pointer-events-none"
                    >
                      {city.completedArea}万亩
                    </text>
                  </g>
                );
              })}
            </g>
          )}

          {/* 2. City Level: County divisions */}
          {(drillLevel === 'city' || drillLevel === 'county' || drillLevel === 'project') && (
            <g className="counties-layer">
              {JINAN_COUNTIES.map((county) => {
                const isSelected = selectedCounty === county.name;
                return (
                  <g
                    key={county.id}
                    onClick={() => onDrillChange('county', selectedCity, county.name, null)}
                    className="cursor-pointer"
                  >
                    <path
                      d={county.svgPath}
                      fill={
                        isSelected
                          ? 'rgba(14, 116, 144, 0.35)'
                          : 'rgba(12, 35, 80, 0.45)'
                      }
                      stroke={isSelected ? '#06b6d4' : '#1e3a8a'}
                      strokeWidth={isSelected ? 1.5 : 0.8}
                      strokeDasharray={isSelected ? undefined : '3,2'}
                      className="transition-colors duration-300"
                    />
                    {drillLevel === 'city' && (
                      <text
                        x={county.center[0]}
                        y={county.center[1]}
                        textAnchor="middle"
                        fill="#cbd5e1"
                        fontSize="9"
                        fontWeight="600"
                        className="pointer-events-none"
                      >
                        {county.name}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          )}

          {/* 3. Duty Grids Layer (if enabled) */}
          {showGridsLayer && (
            <g className="grids-layer pointer-events-none opacity-60">
              {PERSONNEL_DUTY_LIST.filter((p) => p.gridPolygon).map((p) => (
                <path
                  key={p.id}
                  d={p.gridPolygon}
                  fill="rgba(6, 182, 212, 0.12)"
                  stroke="#06b6d4"
                  strokeWidth="0.8"
                  strokeDasharray="2,2"
                />
              ))}
            </g>
          )}

          {/* 4. Project Farm Blocks Layer (blockGis polygons) */}
          {showBlocksLayer && (
            <g className="farm-blocks-layer">
              {PROJECT_BLOCKS.map((block) => {
                const isSelected = selectedBlockId === block.id || highlightedBlockId === block.id;
                const statusColor = getStatusColor(block.status);
                const isOverdue = block.status === 'overdue';

                return (
                  <g
                    key={block.id}
                    onClick={() => {
                      onDrillChange('project', block.cityName, block.countyName, block.id);
                      onSelectBlock(block);
                    }}
                    onMouseEnter={(e) => {
                      setHoveredEntity({
                        type: 'block',
                        title: block.name,
                        subtitle: `${block.townName} · ${block.area}亩 · 进度 ${block.progress}%`,
                        x: e.clientX,
                        y: e.clientY,
                      });
                    }}
                    onMouseLeave={() => setHoveredEntity(null)}
                    className="cursor-pointer"
                  >
                    {/* Farm Parcel Polygon */}
                    <path
                      d={block.svgPolygon}
                      fill={statusColor}
                      fillOpacity={isSelected ? 0.85 : 0.45}
                      stroke={isSelected ? '#ffffff' : statusColor}
                      strokeWidth={isSelected ? 2 : 1}
                      className={`transition-all duration-300 ${isOverdue ? 'animate-pulse' : ''}`}
                    />

                    {/* Pulse halo if selected or overdue */}
                    {(isSelected || isOverdue) && (
                      <circle
                        cx={block.center[0]}
                        cy={block.center[1]}
                        r="12"
                        fill="none"
                        stroke={isOverdue ? '#f43f5e' : '#38bdf8'}
                        strokeWidth="1"
                        className="animate-radar"
                      />
                    )}

                    {/* Block Center Marker */}
                    <circle
                      cx={block.center[0]}
                      cy={block.center[1]}
                      r={isSelected ? 4 : 2.5}
                      fill={statusColor}
                      stroke="#ffffff"
                      strokeWidth="1"
                    />

                    {/* Label at county or project level */}
                    {(drillLevel === 'county' || drillLevel === 'project') && (
                      <text
                        x={block.center[0]}
                        y={block.center[1] - 5}
                        textAnchor="middle"
                        fill="#f8fafc"
                        fontSize={drillLevel === 'project' ? 2.5 : 3.5}
                        fontWeight="bold"
                        className="pointer-events-none drop-shadow"
                      >
                        {block.name.replace('梨树县', '')}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          )}

          {/* 5. Inspection Points Layer */}
          {showInspectionLayer && (
            <g className="inspection-points-layer">
              {INSPECTION_RECORDS.map((record) => {
                const isSelected = record.projectId === selectedBlockId;
                const isClosed = record.status === 'closed';

                return (
                  <g
                    key={record.id}
                    onClick={() => onOpenInspectionDetail(record)}
                    onMouseEnter={(e) => {
                      setHoveredEntity({
                        type: 'inspection',
                        title: record.issueType,
                        subtitle: `${record.inspectorName} (${record.status === 'closed' ? '已闭环' : '待整改'})`,
                        x: e.clientX,
                        y: e.clientY,
                      });
                    }}
                    onMouseLeave={() => setHoveredEntity(null)}
                    className="cursor-pointer"
                  >
                    <circle
                      cx={record.coordinate[0]}
                      cy={record.coordinate[1]}
                      r={isSelected ? 5 : 3.5}
                      fill={isClosed ? '#10b981' : '#f59e0b'}
                      stroke="#ffffff"
                      strokeWidth="1"
                      className={!isClosed ? 'animate-bounce' : ''}
                    />
                    <circle
                      cx={record.coordinate[0]}
                      cy={record.coordinate[1]}
                      r="1"
                      fill="#000000"
                    />
                  </g>
                );
              })}
            </g>
          )}

          {/* 6. Active Bodycam Officer Live GPS Beacon on Map (§7.2) */}
          {activeCallingPersonnel && (
            <g className="live-officer-beacon">
              <circle
                cx={activeCallingPersonnel.currentMapCoord[0]}
                cy={activeCallingPersonnel.currentMapCoord[1]}
                r="16"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="1.5"
                className="animate-radar"
              />
              <circle
                cx={activeCallingPersonnel.currentMapCoord[0]}
                cy={activeCallingPersonnel.currentMapCoord[1]}
                r="6"
                fill="#0284c7"
                stroke="#ffffff"
                strokeWidth="2"
              />
              <text
                x={activeCallingPersonnel.currentMapCoord[0]}
                y={activeCallingPersonnel.currentMapCoord[1] - 8}
                textAnchor="middle"
                fill="#38bdf8"
                fontSize="4"
                fontWeight="bold"
                className="drop-shadow"
              >
                ● 巡查员 {activeCallingPersonnel.name} (实时通话中)
              </text>
            </g>
          )}

          {/* 7. Inspection Trajectory Playback Overlay (§7.1) */}
          {activeTrackId && (
            <g className="trajectory-layer">
              {/* Connected Track Polyline */}
              <polyline
                points={INSPECTION_TRACK_POINTS.map((pt) => `${pt.x},${pt.y}`).join(' ')}
                fill="none"
                stroke="url(#trackGrad)"
                strokeWidth="2"
                strokeDasharray="4,2"
              />

              {/* Check-in Waypoints */}
              {INSPECTION_TRACK_POINTS.filter((pt) => pt.isCheckin).map((pt) => {
                const isStart = pt.id === 1;
                const isEnd = pt.id === INSPECTION_TRACK_POINTS.length;
                const ptColor = isStart ? '#10b981' : isEnd ? '#ef4444' : '#38bdf8';

                return (
                  <g
                    key={pt.id}
                    onClick={() => setSelectedCheckin(pt)}
                    className="cursor-pointer"
                  >
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="3.5"
                      fill={ptColor}
                      stroke="#ffffff"
                      strokeWidth="1"
                    />
                    <text
                      x={pt.x}
                      y={pt.y + 6}
                      textAnchor="middle"
                      fill="#e2e8f0"
                      fontSize="2.5"
                      fontWeight="bold"
                    >
                      {isStart ? '起' : isEnd ? '终' : `桩${pt.id}`}
                    </text>
                  </g>
                );
              })}

              {/* Moving Live Inspector Beacon on Track */}
              <circle
                cx={currentTrackPoint.x}
                cy={currentTrackPoint.y}
                r="8"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="1.2"
                className="animate-ping"
              />
              <circle
                cx={currentTrackPoint.x}
                cy={currentTrackPoint.y}
                r="4.5"
                fill="#0ea5e9"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
            </g>
          )}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredEntity && (
          <div
            className="absolute z-40 pointer-events-none transform -translate-x-1/2 -translate-y-full px-2.5 py-1.5 rounded-lg bg-[#0a1838]/95 border border-cyan-400/60 shadow-xl text-xs backdrop-blur text-left"
            style={{
              left: `${Math.min(Math.max(hoveredEntity.x - 300, 80), 800)}px`,
              top: `${Math.min(Math.max(hoveredEntity.y - 120, 60), 500)}px`,
            }}
          >
            <div className="font-bold text-white whitespace-nowrap">{hoveredEntity.title}</div>
            {hoveredEntity.subtitle && (
              <div className="text-[11px] text-cyan-300 mt-0.5 whitespace-nowrap">
                {hoveredEntity.subtitle}
              </div>
            )}
          </div>
        )}

        {/* Map Click Info Bubble (Popup on selected block) */}
        {selectedBlock && drillLevel === 'project' && (
          <div className="absolute top-16 right-5 w-80 p-3.5 rounded-xl bg-[#091738]/95 border border-cyan-500/60 shadow-2xl backdrop-blur z-30 flex flex-col gap-2">
            <div className="flex items-center justify-between border-b border-sky-800/60 pb-2">
              <div className="flex items-center gap-1.5 truncate">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: getStatusColor(selectedBlock.status) }}
                />
                <h3 className="text-xs font-bold text-white truncate">{selectedBlock.name}</h3>
              </div>
              <button
                onClick={() => onDrillChange('county', selectedCity, selectedCounty, null)}
                className="text-slate-400 hover:text-white text-xs px-1"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs py-1">
              <div>
                <span className="text-[11px] text-slate-400">建设面积: </span>
                <span className="font-mono font-semibold text-slate-100">
                  {selectedBlock.area.toLocaleString()} 亩
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400">投资概算: </span>
                <span className="font-mono font-semibold text-amber-300">
                  {selectedBlock.investment} 万元
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-[11px] text-slate-400">施工单位: </span>
                <span className="text-slate-200 truncate">{selectedBlock.contractor}</span>
              </div>
              <div className="col-span-2">
                <div className="flex items-center justify-between text-[11px] text-slate-300 mb-1">
                  <span>总体工期进度</span>
                  <span className="font-mono font-bold text-cyan-300">{selectedBlock.progress}%</span>
                </div>
                <div className="w-full h-2 rounded bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded"
                    style={{ width: `${selectedBlock.progress}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-sky-800/50">
              <button
                onClick={() => onOpenBlockDetail(selectedBlock)}
                className="flex-1 py-1.5 px-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium flex items-center justify-center gap-1.5 shadow transition-colors"
              >
                <Info className="w-3.5 h-3.5" />
                <span>查看完整详情</span>
              </button>
            </div>
          </div>
        )}

        {/* Check-in Waypoint Popup during Trajectory Playback */}
        {selectedCheckin && (
          <div className="absolute top-16 left-5 w-72 p-3 rounded-xl bg-[#0a183b]/95 border border-cyan-400/80 shadow-2xl backdrop-blur z-30 flex flex-col gap-1.5">
            <div className="flex items-center justify-between border-b border-sky-800/60 pb-1.5">
              <span className="text-xs font-bold text-cyan-300">{selectedCheckin.checkinTitle}</span>
              <button
                onClick={() => setSelectedCheckin(null)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>
            <div className="text-xs text-slate-300">{selectedCheckin.checkinDesc}</div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-cyan-400" />
              <span>打卡时间: {selectedCheckin.time}</span>
            </div>
            {selectedCheckin.checkinPhoto && (
              <img
                src={selectedCheckin.checkinPhoto}
                alt="打卡实景"
                className="w-full h-28 object-cover rounded mt-1 border border-sky-800"
              />
            )}
          </div>
        )}

        {/* Bottom Floating Return Button (Visible when drilled down) */}
        {drillLevel !== 'province' && (
          <button
            onClick={() => {
              if (drillLevel === 'project') {
                onDrillChange('county', selectedCity, selectedCounty, null);
              } else if (drillLevel === 'county') {
                onDrillChange('city', selectedCity, null, null);
              } else {
                onDrillChange('province', null, null, null);
              }
            }}
            className="absolute bottom-5 left-5 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-950/90 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-300 text-xs font-medium shadow-lg transition-all"
            title="返回上一级区划"
          >
            <Navigation className="w-3.5 h-3.5 -rotate-90 text-cyan-400" />
            <span>返回上一级</span>
          </button>
        )}

        {/* Bottom-Center: Trajectory Playback Controller (§7.1) */}
        {activeTrackId && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 w-[540px] p-3 rounded-xl bg-[#091530]/95 border border-cyan-500/70 shadow-2xl backdrop-blur flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="font-bold text-white">巡查轨迹回放</span>
                <span className="text-slate-400 text-[11px]">
                  (刘伟 · 梨树县孤家子万亩示范区)
                </span>
              </div>
              <button
                onClick={onCloseTrackPlayback}
                className="text-slate-400 hover:text-white text-xs px-1"
                title="关闭轨迹回放"
              >
                ✕
              </button>
            </div>

            {/* Playback Slider */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlayingTrack(!isPlayingTrack)}
                className="w-7 h-7 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 flex items-center justify-center font-bold shrink-0 transition-transform active:scale-95"
              >
                {isPlayingTrack ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
              </button>

              <input
                type="range"
                min="0"
                max={INSPECTION_TRACK_POINTS.length - 1}
                value={playbackTimeIndex}
                onChange={(e) => setPlaybackTimeIndex(Number(e.target.value))}
                className="flex-1 accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />

              <span className="font-mono text-xs text-cyan-300 tabular-nums w-12 text-right">
                {currentTrackPoint.time}
              </span>

              {/* Speed Buttons */}
              <div className="flex items-center gap-1 bg-slate-900/80 p-0.5 rounded border border-sky-900">
                {[0.5, 1, 2, 4].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setPlaybackSpeed(spd)}
                    className={`px-1.5 py-0.5 text-[10px] rounded font-mono ${
                      playbackSpeed === spd
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Bottom Right: Map Controls, Legend & Scale */}
        <div className="absolute bottom-5 right-5 z-20 flex flex-col items-end gap-2.5">
          {/* Layer toggles */}
          <div className="p-2 rounded-lg bg-[#0a183b]/90 border border-sky-800/40 shadow-lg backdrop-blur flex items-center gap-2 text-xs">
            <button
              onClick={() => setShowBlocksLayer(!showBlocksLayer)}
              className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
                showBlocksLayer ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-slate-500'
              }`}
            >
              {showBlocksLayer ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>项目斑块</span>
            </button>

            <button
              onClick={() => setShowInspectionLayer(!showInspectionLayer)}
              className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
                showInspectionLayer ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-slate-500'
              }`}
            >
              {showInspectionLayer ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>巡查点位</span>
            </button>

            <button
              onClick={() => setShowGridsLayer(!showGridsLayer)}
              className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
                showGridsLayer ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-slate-500'
              }`}
            >
              {showGridsLayer ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>网格边界</span>
            </button>

            <button
              onClick={handleResetView}
              className="p-1 rounded text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors ml-1"
              title="复位至全省视角"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Status Color Legend */}
          <div className="px-3 py-1.5 rounded-lg bg-[#0a183b]/90 border border-sky-800/40 shadow-lg backdrop-blur flex items-center gap-3 text-[11px] text-slate-300">
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
              <span>已建成</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-sky-400" />
              <span>在建</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
              <span>待验收</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 animate-pulse" />
              <span>逾期预警</span>
            </div>
          </div>

          {/* Scale Bar */}
          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
            <div className="flex flex-col items-center">
              <div className="w-16 h-1 border-b-2 border-l-2 border-r-2 border-cyan-400" />
              <span className="mt-0.5">
                {drillLevel === 'province'
                  ? '50 km'
                  : drillLevel === 'city'
                  ? '15 km'
                  : drillLevel === 'county'
                  ? '3 km'
                  : '500 m'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
