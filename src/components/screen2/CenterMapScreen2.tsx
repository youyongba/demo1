import React, { useState, useEffect } from 'react';
import {
  RotateCcw,
  Eye,
  EyeOff,
  Video,
  Layers,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  Info,
  ExternalLink,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { ProjectBlock } from '../../types/dashboard';
import {
  PROJECT_PARCELS,
  SUB_ENGINEERING_ITEMS,
  SURVEILLANCE_CAMERAS,
  MILESTONE_NODES,
  GANTT_PERIOD,
  DETAIL_IMAGES,
} from '../../data/projectDetailData';
import {
  ProjectParcel,
  SubEngineeringItem,
  SurveillanceCamera,
  MilestoneNode,
} from '../../types/projectDetail';

interface CenterMapScreen2Props {
  project: ProjectBlock;
  highlightedSubEngineering: string | null;
  onOpenParcelModal: (parcel: ProjectParcel) => void;
  onOpenCctvModal: (camera: SurveillanceCamera) => void;
  onOpenMilestoneModal: (milestone: MilestoneNode) => void;
  isFlashingParcels?: boolean;
}

export const CenterMapScreen2: React.FC<CenterMapScreen2Props> = ({
  project,
  highlightedSubEngineering,
  onOpenParcelModal,
  onOpenCctvModal,
  onOpenMilestoneModal,
  isFlashingParcels,
}) => {
  // Layer switches
  const [showParcels, setShowParcels] = useState(true);
  const [showLeveling, setShowLeveling] = useState(true);
  const [showIrrigation, setShowIrrigation] = useState(true);
  const [showRoads, setShowRoads] = useState(true);
  const [showShelterbelts, setShowShelterbelts] = useState(true);
  const [showCameras, setShowCameras] = useState(true);
  const [isSatellite, setIsSatellite] = useState(true);

  // Selection & Zoom
  const [selectedParcel, setSelectedParcel] = useState<ProjectParcel | null>(null);
  const [hoveredElement, setHoveredElement] = useState<{
    title: string;
    desc: string;
    x: number;
    y: number;
  } | null>(null);

  // Gantt zoom (months view)
  const [ganttZoom, setGanttZoom] = useState(12); // 6, 12, 18, 24 months

  // Map ViewBox
  const [viewBox, setViewBox] = useState({ x: 160, y: 150, width: 400, height: 320 });

  const resetView = () => {
    setSelectedParcel(null);
    setViewBox({ x: 160, y: 150, width: 400, height: 320 });
  };

  const zoomToParcel = (parcel: ProjectParcel) => {
    setSelectedParcel(parcel);
    setViewBox({
      x: parcel.center[0] - 80,
      y: parcel.center[1] - 65,
      width: 160,
      height: 130,
    });
  };

  // Helper for parcel status colors
  const getParcelColor = (status: ProjectParcel['status']) => {
    if (status === 'completed') return '#10b981'; // Green
    if (status === 'constructing') return '#38bdf8'; // Blue
    return '#64748b'; // Gray
  };

  // Opacity for sub-engineering layers when one is focused
  const getSubEngineeringOpacity = (type: string) => {
    if (!highlightedSubEngineering) return 1;
    return highlightedSubEngineering === type ? 1 : 0.25;
  };

  return (
    <main className="flex-1 h-full relative flex flex-col bg-[#070e24] overflow-hidden select-none border-x border-sky-950/60">
      {/* 5.1 上部：项目地块地图（图斑级） */}
      <div className="relative flex-1 w-full overflow-hidden flex flex-col">
        {/* Top Control Bar: Layer toggles & Basemap switch */}
        <div className="h-10 px-4 flex items-center justify-between z-20 bg-gradient-to-b from-[#07132e]/95 to-transparent">
          {/* Left Layer Toggles */}
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="text-slate-400 font-medium mr-1">图层控制:</span>

            <button
              onClick={() => setShowParcels(!showParcels)}
              className={`px-2 py-0.5 rounded border transition-colors ${
                showParcels
                  ? 'bg-cyan-950/90 text-cyan-300 border-cyan-700'
                  : 'bg-slate-900/60 text-slate-500 border-slate-800'
              }`}
            >
              图斑({PROJECT_PARCELS.length})
            </button>

            <button
              onClick={() => setShowLeveling(!showLeveling)}
              className={`px-2 py-0.5 rounded border transition-colors ${
                showLeveling
                  ? 'bg-amber-950/90 text-amber-300 border-amber-700'
                  : 'bg-slate-900/60 text-slate-500 border-slate-800'
              }`}
            >
              土地平整
            </button>

            <button
              onClick={() => setShowIrrigation(!showIrrigation)}
              className={`px-2 py-0.5 rounded border transition-colors ${
                showIrrigation
                  ? 'bg-blue-950/90 text-sky-300 border-blue-700'
                  : 'bg-slate-900/60 text-slate-500 border-slate-800'
              }`}
            >
              灌溉排水
            </button>

            <button
              onClick={() => setShowRoads(!showRoads)}
              className={`px-2 py-0.5 rounded border transition-colors ${
                showRoads
                  ? 'bg-stone-900/90 text-amber-200 border-stone-600'
                  : 'bg-slate-900/60 text-slate-500 border-slate-800'
              }`}
            >
              田间道路
            </button>

            <button
              onClick={() => setShowShelterbelts(!showShelterbelts)}
              className={`px-2 py-0.5 rounded border transition-colors ${
                showShelterbelts
                  ? 'bg-emerald-950/90 text-emerald-300 border-emerald-700'
                  : 'bg-slate-900/60 text-slate-500 border-slate-800'
              }`}
            >
              防护林网
            </button>

            <button
              onClick={() => setShowCameras(!showCameras)}
              className={`px-2 py-0.5 rounded border transition-colors ${
                showCameras
                  ? 'bg-teal-950/90 text-teal-300 border-teal-700'
                  : 'bg-slate-900/60 text-slate-500 border-slate-800'
              }`}
            >
              现场监控({SURVEILLANCE_CAMERAS.length})
            </button>
          </div>

          {/* Right Tools: Basemap switch & Reset */}
          <div className="flex items-center gap-2 text-xs">
            {highlightedSubEngineering && (
              <span className="text-[10px] text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-700 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                已联动高亮当前分项工程
              </span>
            )}

            <button
              onClick={() => setIsSatellite(!isSatellite)}
              className={`px-2 py-0.5 rounded text-[11px] border transition-colors ${
                isSatellite
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                  : 'bg-slate-900 text-slate-400 border-slate-700'
              }`}
            >
              {isSatellite ? '高分卫星影像' : '工程矢量底图'}
            </button>

            <button
              onClick={resetView}
              className="p-1 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="复位到全项目图斑视角"
            >
              <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            </button>
          </div>
        </div>

        {/* Map SVG Canvas */}
        <div className="relative flex-1 w-full h-full flex items-center justify-center overflow-hidden">
          {/* Satellite Backdrop Image if enabled */}
          {isSatellite && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-45">
              <img
                src={DETAIL_IMAGES.droneInspection}
                alt="高分影像底图"
                className="w-full h-full object-cover filter contrast-125 saturate-110"
              />
            </div>
          )}

          <svg
            viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
            className="w-full h-full transition-all duration-700 ease-in-out cursor-crosshair"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Defs */}
            <defs>
              <pattern id="roadPattern" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 0 5 L 10 5" stroke="#d97706" strokeWidth="2" strokeDasharray="3,2" />
              </pattern>
            </defs>

            {/* 1. Sub-engineering Layers */}
            {/* 1A. 土地平整面 (Yellow overlay) */}
            {showLeveling && (
              <g
                className="leveling-layer transition-opacity duration-300"
                style={{ opacity: getSubEngineeringOpacity('leveling') }}
              >
                <polygon
                  points="215,182 320,188 310,268 208,262"
                  fill="rgba(245, 158, 11, 0.25)"
                  stroke="#f59e0b"
                  strokeWidth="0.8"
                />
                <polygon
                  points="328,186 428,192 418,272 318,268"
                  fill="rgba(245, 158, 11, 0.22)"
                  stroke="#f59e0b"
                  strokeWidth="0.8"
                />
              </g>
            )}

            {/* 1B. 灌溉排水渠道 (Blue Polyline Lines) */}
            {showIrrigation && (
              <g
                className="irrigation-layer transition-opacity duration-300"
                style={{ opacity: getSubEngineeringOpacity('irrigation') }}
              >
                {/* Main East Canal */}
                <polyline
                  points="180,185 330,190 440,195 550,200"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                {/* Branch canal */}
                <polyline
                  points="320,190 310,365 300,450"
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <polyline
                  points="430,195 420,368"
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </g>
            )}

            {/* 1C. 田间机耕道路 (Brown Lines) */}
            {showRoads && (
              <g
                className="roads-layer transition-opacity duration-300"
                style={{ opacity: getSubEngineeringOpacity('roads') }}
              >
                {/* Main 4.5m Tractor Road */}
                <line
                  x1="200"
                  y1="265"
                  x2="540"
                  y2="285"
                  stroke="#f59e0b"
                  strokeWidth="2.8"
                  strokeDasharray="4,2"
                />
                <line
                  x1="210"
                  y1="355"
                  x2="530"
                  y2="368"
                  stroke="#f59e0b"
                  strokeWidth="2.5"
                />
              </g>
            )}

            {/* 1D. 农田林网防护带 (Green Trees) */}
            {showShelterbelts && (
              <g
                className="shelterbelts-layer transition-opacity duration-300"
                style={{ opacity: getSubEngineeringOpacity('shelterbelts') }}
              >
                {[
                  [205, 260],
                  [265, 263],
                  [325, 266],
                  [385, 269],
                  [445, 272],
                  [505, 275],
                ].map(([tx, ty], idx) => (
                  <circle
                    key={idx}
                    cx={tx}
                    cy={ty}
                    r="2.5"
                    fill="#10b981"
                    stroke="#ffffff"
                    strokeWidth="0.5"
                  />
                ))}
              </g>
            )}

            {/* 2. Project Parcels (图斑层) */}
            {showParcels && (
              <g className="parcels-layer">
                {PROJECT_PARCELS.map((parcel) => {
                  const isSelected = selectedParcel?.id === parcel.id;
                  const color = getParcelColor(parcel.status);

                  return (
                    <g
                      key={parcel.id}
                      onClick={() => setSelectedParcel(parcel)}
                      onDoubleClick={() => zoomToParcel(parcel)}
                      onMouseEnter={(e) => {
                        setHoveredElement({
                          title: `${parcel.code} · ${parcel.name}`,
                          desc: `${parcel.cropType} · 面积 ${parcel.area} 亩 · 完成度 ${parcel.progress}%`,
                          x: e.clientX,
                          y: e.clientY,
                        });
                      }}
                      onMouseLeave={() => setHoveredElement(null)}
                      className="cursor-pointer group"
                    >
                      <path
                        d={parcel.svgPolygon}
                        fill={color}
                        fillOpacity={isSelected ? 0.65 : 0.3}
                        stroke={isSelected ? '#ffffff' : color}
                        strokeWidth={isSelected ? 2 : 1}
                        className={`transition-all duration-300 ${
                          isFlashingParcels ? 'animate-pulse' : ''
                        }`}
                      />

                      {/* Parcel Code & Area Text */}
                      <text
                        x={parcel.center[0]}
                        y={parcel.center[1] - 4}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="6"
                        fontWeight="bold"
                        className="pointer-events-none drop-shadow"
                      >
                        {parcel.code}
                      </text>
                      <text
                        x={parcel.center[0]}
                        y={parcel.center[1] + 6}
                        textAnchor="middle"
                        fill={color}
                        fontSize="5"
                        fontFamily="monospace"
                        fontWeight="600"
                        className="pointer-events-none drop-shadow"
                      >
                        {parcel.area}亩 ({parcel.progress}%)
                      </text>
                    </g>
                  );
                })}
              </g>
            )}

            {/* 3. Field CCTV Cameras Layer (5.1 & 8.1) */}
            {showCameras && (
              <g className="cameras-layer">
                {SURVEILLANCE_CAMERAS.map((cam) => {
                  const isOnline = cam.status === 'online';
                  return (
                    <g
                      key={cam.id}
                      onClick={() => onOpenCctvModal(cam)}
                      onMouseEnter={(e) => {
                        setHoveredElement({
                          title: cam.name,
                          desc: `${cam.location} (${isOnline ? '实时在线' : '离线'}) - 点击拉取监控视频`,
                          x: e.clientX,
                          y: e.clientY,
                        });
                      }}
                      onMouseLeave={() => setHoveredElement(null)}
                      className="cursor-pointer"
                    >
                      {/* Pulse halo if online */}
                      {isOnline && (
                        <circle
                          cx={cam.coord[0]}
                          cy={cam.coord[1]}
                          r="6"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="0.8"
                          className="animate-ping"
                        />
                      )}
                      <circle
                        cx={cam.coord[0]}
                        cy={cam.coord[1]}
                        r="3.5"
                        fill={isOnline ? '#10b981' : '#64748b'}
                        stroke="#ffffff"
                        strokeWidth="1"
                      />
                      <circle cx={cam.coord[0]} cy={cam.coord[1]} r="1" fill="#000000" />
                    </g>
                  );
                })}
              </g>
            )}
          </svg>

          {/* Hover Tooltip */}
          {hoveredElement && (
            <div
              className="absolute z-40 pointer-events-none transform -translate-x-1/2 -translate-y-full px-2.5 py-1.5 rounded-lg bg-[#0a1838]/95 border border-cyan-400/60 shadow-xl text-xs backdrop-blur"
              style={{
                left: `${Math.min(Math.max(hoveredElement.x - 300, 80), 800)}px`,
                top: `${Math.min(Math.max(hoveredElement.y - 120, 60), 380)}px`,
              }}
            >
              <div className="font-bold text-white whitespace-nowrap">{hoveredElement.title}</div>
              <div className="text-[11px] text-cyan-300 mt-0.5 whitespace-nowrap">
                {hoveredElement.desc}
              </div>
            </div>
          )}

          {/* Clicked Parcel Popup Info Bubble (§5.1) */}
          {selectedParcel && (
            <div className="absolute top-12 right-4 w-76 p-3.5 rounded-xl bg-[#091738]/95 border border-cyan-500/70 shadow-2xl backdrop-blur z-30 flex flex-col gap-2">
              <div className="flex items-center justify-between border-b border-sky-800/60 pb-1.5">
                <div className="flex items-center gap-1.5 truncate">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: getParcelColor(selectedParcel.status) }}
                  />
                  <h3 className="text-xs font-bold text-white truncate">
                    {selectedParcel.code} · {selectedParcel.name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedParcel(null)}
                  className="text-slate-400 hover:text-white text-xs px-1"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-1.5 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400">图斑面积:</span>
                  <div className="font-mono font-bold text-slate-100">{selectedParcel.area} 亩</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">主要作物:</span>
                  <div className="text-slate-200 truncate">{selectedParcel.cropType}</div>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] text-slate-400">分项工程综合完成度:</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyan-400 rounded-full"
                        style={{ width: `${selectedParcel.progress}%` }}
                      />
                    </div>
                    <span className="font-mono font-bold text-cyan-300 text-[11px]">
                      {selectedParcel.progress}%
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onOpenParcelModal(selectedParcel)}
                className="w-full mt-1 py-1.5 px-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium flex items-center justify-center gap-1.5 shadow transition-colors"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>查看图斑详情 (整治前后对比)</span>
              </button>
            </div>
          )}

          {/* Map Legend (Bottom Right of Map Area) */}
          <div className="absolute bottom-3 right-4 z-20 flex items-center gap-3 px-3 py-1.5 rounded-lg bg-[#0a183b]/90 border border-sky-800/40 text-[11px] text-slate-300 shadow backdrop-blur">
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
              <span>已完工</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-sky-400" />
              <span>施工中</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-slate-500" />
              <span>未开工</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-teal-400" />
              <span>监控球机</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5.2 下部：建设历程时间轴 / 甘特图（高约 200px） */}
      <section className="h-[210px] border-t border-sky-900/60 bg-[#081530]/95 p-3 flex flex-col justify-between shrink-0 z-10 backdrop-blur">
        {/* Gantt Header */}
        <div className="flex items-center justify-between border-b border-sky-900/40 pb-1.5 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-3 bg-cyan-400 rounded-full" />
            <h3 className="text-xs font-bold text-white tracking-wide">建设历程与工期甘特</h3>
            <span className="text-[10px] text-slate-400">里程碑时序推进</span>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded bg-sky-500" /> 计划工期
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded bg-emerald-500" /> 实际执行
            </span>
            <span className="text-slate-600">|</span>
            <span>按月视窗:</span>
            {[6, 12, 18, 24].map((m) => (
              <button
                key={m}
                onClick={() => setGanttZoom(m)}
                className={`px-1.5 py-0.5 rounded font-mono ${
                  ganttZoom === m
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {m}M
              </button>
            ))}
          </div>
        </div>

        {/* Upper Row: Milestone Nodes Pipeline (§5.2) */}
        <div className="relative py-2 px-6 flex items-center justify-between">
          {/* Connecting line */}
          <div className="absolute top-1/2 left-12 right-12 h-0.5 bg-sky-900 -translate-y-1/2 z-0" />

          {MILESTONE_NODES.map((node, idx) => {
            const isCompleted = node.status === 'completed';
            const isInProgress = node.status === 'in_progress';
            const isDelayed = node.status === 'delayed';

            return (
              <div
                key={node.id}
                onClick={() => onOpenMilestoneModal(node)}
                className="relative z-10 flex flex-col items-center cursor-pointer group"
                title="点击查看里程碑阶段详情、文号与批复资料"
              >
                {/* Node icon */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-transform group-hover:scale-110 ${
                    isCompleted
                      ? 'bg-emerald-950 border-emerald-400 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                      : isInProgress
                      ? 'bg-sky-950 border-sky-400 text-cyan-300 animate-pulse shadow-[0_0_10px_rgba(56,189,248,0.5)]'
                      : isDelayed
                      ? 'bg-rose-950 border-rose-500 text-rose-400'
                      : 'bg-slate-900 border-slate-700 text-slate-500'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : isInProgress ? (
                    <Clock className="w-4 h-4" />
                  ) : (
                    <span className="font-mono text-[10px] font-bold">{idx + 1}</span>
                  )}
                </div>

                {/* Node Label */}
                <span className="text-[11px] font-bold text-slate-200 mt-1 whitespace-nowrap group-hover:text-cyan-300 transition-colors">
                  {node.name}
                </span>
                <span className="text-[9px] font-mono text-slate-400 mt-0.5">
                  {node.actualDate || node.planDate}
                </span>
              </div>
            );
          })}
        </div>

        {/* Lower Row: Planned vs Actual Gantt Bar Strip (§5.2) */}
        <div className="p-2 rounded bg-[#071329] border border-sky-950 flex flex-col gap-1.5">
          {/* Plan Bar */}
          <div className="flex items-center gap-2 text-[10px]">
            <span className="w-14 text-slate-400 shrink-0 font-medium">计划工期:</span>
            <div className="flex-1 h-3 bg-slate-900 rounded relative overflow-hidden">
              <div
                className="absolute top-0 bottom-0 left-[10%] right-[15%] bg-gradient-to-r from-sky-600 to-sky-400 rounded flex items-center justify-between px-2 text-[8px] font-mono text-white"
              >
                <span>2024-11 (开工)</span>
                <span>2025-11 (竣工计划)</span>
              </div>
            </div>
            <span className="font-mono text-slate-400 text-[10px] w-14 text-right">12 个月</span>
          </div>

          {/* Actual Bar */}
          <div className="flex items-center gap-2 text-[10px]">
            <span className="w-14 text-slate-400 shrink-0 font-medium">实际执行:</span>
            <div className="flex-1 h-3 bg-slate-900 rounded relative overflow-hidden">
              <div
                className="absolute top-0 bottom-0 left-[10%] w-[58%] bg-gradient-to-r from-emerald-600 to-cyan-400 rounded flex items-center justify-between px-2 text-[8px] font-mono text-white shadow"
              >
                <span>实际按期推进中 (进度74%)</span>
                <span>当前时序</span>
              </div>
            </div>
            <span className="font-mono text-emerald-400 font-bold text-[10px] w-14 text-right">
              正常履约
            </span>
          </div>
        </div>
      </section>
    </main>
  );
};
