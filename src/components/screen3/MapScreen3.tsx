import React, { useState, useEffect } from 'react';
import {
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Sliders,
  AlertTriangle,
  Camera,
  CheckCircle2,
  Clock,
  Coins,
  ChevronRight,
  Sparkles,
  Info,
  X,
  ExternalLink,
  ImageIcon,
} from 'lucide-react';
import {
  BlockGisFeature,
  FilterProjectArea,
  FilterBlock,
  ProcessStep,
  Screen3Inspection,
} from '../../types/screen3Types';
import {
  SCREEN3_GIS_FEATURES,
  SCREEN3_PATROL_LINES,
} from '../../data/screen3Data';
import { DETAIL_IMAGES } from '../../data/projectDetailData';

interface MapScreen3Props {
  area: FilterProjectArea;
  block: FilterBlock;
  statusFilters: { completed: boolean; constructing: boolean; notStarted: boolean };
  showQualityAlarm: boolean;
  showMissingPhotos: boolean;
  showPlanningArea: boolean;
  showRefNames: boolean;
  selectedCategory: string;
  selectedJlTrack: string;
  selectedJgTrack: string;
  isRightDrawerOpen: boolean;
  selectedFeature: BlockGisFeature | null;
  onSelectFeature: (feature: BlockGisFeature | null) => void;
  onOpenQualityDetailModal: (record: Screen3Inspection, feature: BlockGisFeature) => void;
  onOpenProcessPhotosModal: (step: ProcessStep) => void;
  onOpenMissingPhotosModal: (feature: BlockGisFeature) => void;
}

export const MapScreen3: React.FC<MapScreen3Props> = ({
  area,
  block,
  statusFilters,
  showQualityAlarm,
  showMissingPhotos,
  showPlanningArea,
  showRefNames,
  selectedCategory,
  selectedJlTrack,
  selectedJgTrack,
  isRightDrawerOpen,
  selectedFeature,
  onSelectFeature,
  onOpenQualityDetailModal,
  onOpenProcessPhotosModal,
  onOpenMissingPhotosModal,
}) => {
  // 800ms Quality Alarm Pulse state (§3.2)
  const [alarmBlink, setAlarmBlink] = useState(false);

  useEffect(() => {
    if (!showQualityAlarm) return;
    const interval = setInterval(() => {
      setAlarmBlink((prev) => !prev);
    }, 800);
    return () => clearInterval(interval);
  }, [showQualityAlarm]);

  // Map Viewport (Pan & Zoom)
  const [viewBox, setViewBox] = useState({ x: 120, y: 100, width: 620, height: 420 });
  const [hoveredFeatureId, setHoveredFeatureId] = useState<string | null>(null);

  const resetView = () => {
    setViewBox({ x: 120, y: 100, width: 620, height: 420 });
  };

  // Status color mapper (§3.1)
  const getStatusColor = (status: 0 | 1 | 2) => {
    if (status === 2) return '#FF5CC4'; // 已完工 (粉)
    if (status === 1) return '#FDF652'; // 施工中 (黄)
    return '#F09035'; // 未进场 (橙)
  };

  // Filter features according to checkboxes and category
  const isFeatureVisible = (feat: BlockGisFeature) => {
    if (feat.constructionStatus === 2 && !statusFilters.completed) return false;
    if (feat.constructionStatus === 1 && !statusFilters.constructing) return false;
    if (feat.constructionStatus === 0 && !statusFilters.notStarted) return false;
    return true;
  };

  const getFeatureOpacity = (feat: BlockGisFeature) => {
    if (selectedCategory && selectedCategory !== '全部') {
      return feat.gclb === selectedCategory ? 1 : 0.2;
    }
    return 1;
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#02180d] flex items-center justify-center select-none">
      {/* High-tech Engineering Grid Background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 50%, rgba(26, 200, 140, 0.25) 0%, transparent 70%), linear-gradient(rgba(26, 200, 140, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(26, 200, 140, 0.15) 1px, transparent 1px)',
          backgroundSize: '100% 100%, 35px 35px, 35px 35px',
        }}
      />

      {/* SVG GIS Map Canvas */}
      <svg
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
        className="w-full h-full cursor-crosshair transition-all duration-700 ease-in-out"
        preserveAspectRatio="xMidYMid meet"
        onClick={() => onSelectFeature(null)}
      >
        {/* Defs for filters and gradients */}
        <defs>
          <filter id="alarmGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. areaGis (项目区规划区图层，#8ee683 绿，§3.4) */}
        {showPlanningArea && (
          <g className="area-gis-layer pointer-events-none">
            <path
              d={area.svgPath}
              fill="rgba(142, 230, 131, 0.08)"
              stroke="#8ee683"
              strokeWidth="2"
              strokeDasharray="6,4"
            />
            <text
              x={area.center[0]}
              y={area.center[1] - 120}
              textAnchor="middle"
              fill="#8ee683"
              fontSize="12"
              fontWeight="bold"
              className="drop-shadow"
            >
              [规划区边界] {area.name}
            </text>
          </g>
        )}

        {/* 2. blockGis WFS Vector Engineering Elements (§4.1) */}
        <g className="block-gis-layer">
          {SCREEN3_GIS_FEATURES.filter(isFeatureVisible).map((feat) => {
            const isHovered = hoveredFeatureId === feat.id;
            const isSelected = selectedFeature?.id === feat.id;
            const baseColor = getStatusColor(feat.constructionStatus);

            // 800ms Red alarm blink (§3.2)
            const isAlarming = showQualityAlarm && feat.hasQualityAlarm && alarmBlink;
            const strokeColor = isAlarming ? '#ef4444' : isSelected ? '#00FEFA' : baseColor;
            const strokeWidth = isHovered || isSelected ? 3.5 : isAlarming ? 4 : 2;
            const opacity = getFeatureOpacity(feat);

            return (
              <g
                key={feat.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectFeature(feat);
                }}
                onMouseEnter={() => setHoveredFeatureId(feat.id)}
                onMouseLeave={() => setHoveredFeatureId(null)}
                className="cursor-pointer group"
                style={{ opacity, transition: 'opacity 0.3s' }}
              >
                {/* Element Geometry */}
                {feat.coordType === 'polyline' ? (
                  <path
                    d={feat.svgPath}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    className="transition-all duration-200"
                  />
                ) : feat.coordType === 'point' ? (
                  <path
                    d={feat.svgPath}
                    fill={isAlarming ? 'rgba(239, 68, 68, 0.6)' : baseColor}
                    fillOpacity={0.7}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    className="transition-all duration-200"
                  />
                ) : (
                  <path
                    d={feat.svgPath}
                    fill={baseColor}
                    fillOpacity={isSelected ? 0.65 : 0.35}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    className="transition-all duration-200"
                  />
                )}

                {/* Center Node Marker */}
                <circle
                  cx={feat.center[0]}
                  cy={feat.center[1]}
                  r={isSelected ? 5 : 3.5}
                  fill={strokeColor}
                  stroke="#ffffff"
                  strokeWidth="1"
                />

                {/* 3.5 工程名称标注 (RefName 文字标注) */}
                {showRefNames && (
                  <text
                    x={feat.center[0]}
                    y={feat.center[1] - 8}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="7"
                    fontWeight="bold"
                    className="pointer-events-none drop-shadow tracking-wider"
                  >
                    {feat.RefName}
                  </text>
                )}

                {/* 3.2 质量巡查告警动态点 */}
                {showQualityAlarm && feat.hasQualityAlarm && (
                  <g className="alarm-marker">
                    <circle
                      cx={feat.center[0]}
                      cy={feat.center[1]}
                      r="12"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="1.5"
                      className="animate-ping"
                    />
                    <text
                      x={feat.center[0]}
                      y={feat.center[1] + 14}
                      textAnchor="middle"
                      fill="#ef4444"
                      fontSize="6"
                      fontWeight="bold"
                    >
                      ▲ 待整改
                    </text>
                  </g>
                )}

                {/* 3.3 拍照遗漏动态点 */}
                {showMissingPhotos && feat.hasMissingPhoto && (
                  <g
                    className="missing-photo-marker cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenMissingPhotosModal(feat);
                    }}
                  >
                    <circle
                      cx={feat.center[0] + 15}
                      cy={feat.center[1] - 15}
                      r="8"
                      fill="#f59e0b"
                      stroke="#ffffff"
                      strokeWidth="1"
                    />
                    <text
                      x={feat.center[0] + 15}
                      y={feat.center[1] - 12}
                      textAnchor="middle"
                      fill="#000000"
                      fontSize="7"
                      fontWeight="bold"
                    >
                      📷
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </g>

        {/* 3. lineLayer 巡查轨迹多段线 (§3.8) */}
        {selectedJlTrack === 'track-jl-01' && (
          <g className="track-jl-layer">
            <polyline
              points={SCREEN3_PATROL_LINES[0].points.map((p) => `${p[0]},${p[1]}`).join(' ')}
              fill="none"
              stroke="#06e1f2"
              strokeWidth="2.5"
              strokeDasharray="4,2"
            />
            {SCREEN3_PATROL_LINES[0].points.map(([px, py], i) => (
              <circle key={i} cx={px} cy={py} r="2" fill="#06e1f2" stroke="#ffffff" strokeWidth="0.5" />
            ))}
          </g>
        )}

        {selectedJgTrack === 'track-jg-01' && (
          <g className="track-jg-layer">
            <polyline
              points={SCREEN3_PATROL_LINES[1].points.map((p) => `${p[0]},${p[1]}`).join(' ')}
              fill="none"
              stroke="#fdf652"
              strokeWidth="2.5"
              strokeDasharray="4,2"
            />
            {SCREEN3_PATROL_LINES[1].points.map(([px, py], i) => (
              <circle key={i} cx={px} cy={py} r="2" fill="#fdf652" stroke="#ffffff" strokeWidth="0.5" />
            ))}
          </g>
        )}
      </svg>

      {/* 5. 标段单击浮层 Overlay（宽 363px，深绿底描边样式，§5） */}
      {selectedFeature && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute z-40 w-[363px] max-h-[520px] rounded-xl bg-[#032414]/95 border-2 border-[#00A565] shadow-[0_15px_45px_rgba(0,0,0,0.9)] backdrop-blur flex flex-col overflow-hidden text-slate-100 animate-in fade-in zoom-in-95"
          style={{
            top: '80px',
            left: '420px',
          }}
        >
          {/* 5.1 浮层标题 — 标段与工程名称 */}
          <div className="h-12 px-3.5 bg-gradient-to-r from-[#05321C] via-[#022112] to-[#05321C] border-b border-[#00A565]/80 flex items-center justify-between shrink-0">
            <div className="flex flex-col truncate pr-2">
              <span className="font-bold text-xs text-white truncate" title={selectedFeature.RefName}>
                {selectedFeature.RefName}
              </span>
              <span className="text-[9px] text-[#00FEFA] font-mono mt-0.5">
                唯一编码: {selectedFeature.WYBM} · {selectedFeature.gclb}
              </span>
            </div>
            <button
              onClick={() => onSelectFeature(null)}
              className="p-1 rounded text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4 text-[#1ac88c]" />
            </button>
          </div>

          {/* 浮层内容区 (可滚动) */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 text-xs">
            {/* 5.3 工序进度 (实际进度) */}
            <div className="p-2 rounded bg-[#05321C]/80 border border-[#00A565]/40 flex flex-col gap-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-300 font-semibold">5.3 施工实际进度</span>
                <span className="font-mono font-bold text-[#00FEFA] text-xs">
                  {selectedFeature.actualPercent}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#00A565] to-[#00FEFA] rounded-full"
                  style={{ width: `${selectedFeature.actualPercent}%` }}
                />
              </div>
            </div>

            {/* 5.5 投资进度 */}
            <div className="p-2 rounded bg-[#05321C]/80 border border-[#00A565]/40 flex items-center justify-between text-xs">
              <span className="text-slate-300 font-semibold">5.5 实际投入金额</span>
              <span className="font-mono font-bold text-amber-300">
                {selectedFeature.actualAmount.toLocaleString()} 元
              </span>
            </div>

            {/* 5.2 工序列表 (el-timeline 倒序) */}
            <div className="flex flex-col gap-1.5">
              <span className="font-bold text-xs text-[#00FEFA]">5.2 标段全工序流转清单:</span>
              <div className="relative pl-5 space-y-2 before:absolute before:left-2 before:top-1.5 before:bottom-1.5 before:w-0.5 before:bg-[#00A565]/40">
                {selectedFeature.processes.map((step) => {
                  const isUploaded = step.status === 'uploaded';
                  const isRisk = step.status === 'overdue_risk';

                  return (
                    <div key={step.id} className="relative flex flex-col">
                      <div
                        className={`absolute -left-5 top-1 w-2.5 h-2.5 rounded-full border ${
                          isUploaded
                            ? 'bg-[#06e1f2] border-white'
                            : isRisk
                            ? 'bg-[#ff9d1d] border-white animate-pulse'
                            : 'bg-slate-600 border-slate-400'
                        }`}
                      />
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-medium text-white truncate max-w-[190px]">
                          {step.name}
                        </span>
                        {isUploaded ? (
                          <span className="text-[9px] font-mono text-[#06e1f2]">已上传</span>
                        ) : isRisk ? (
                          <span className="text-[9px] font-mono text-[#ff9d1d] font-bold animate-pulse">
                            未上传 (超期风险)
                          </span>
                        ) : (
                          <span className="text-[9px] font-mono text-slate-500">未开始</span>
                        )}
                      </div>

                      {step.createTime && (
                        <div className="flex items-center justify-between text-[9px] text-slate-400 mt-0.5">
                          <span>{step.createTime}</span>
                          {step.photos && step.photos.length > 0 && (
                            <button
                              onClick={() => onOpenProcessPhotosModal(step)}
                              className="px-1.5 py-0.2 rounded bg-[#074728] hover:bg-[#00A565] text-[#00FEFA] border border-[#00A565] flex items-center gap-0.5"
                            >
                              <ImageIcon className="w-2.5 h-2.5" />
                              <span>展示图片</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 5.4 质量巡查记录列表 */}
            <div className="flex flex-col gap-1.5 pt-1 border-t border-[#00A565]/40">
              <span className="font-bold text-xs text-[#00FEFA]">5.4 质量巡查记录:</span>
              {selectedFeature.inspectionRecords.length > 0 ? (
                <div className="space-y-1.5">
                  {selectedFeature.inspectionRecords.map((ins) => (
                    <div
                      key={ins.id}
                      className="p-2 rounded bg-[#05321C] border border-[#00A565]/40 flex flex-col gap-1 text-[11px]"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-slate-400">{ins.createTime}</span>
                        <span
                          className={`px-1 rounded text-[9px] font-bold ${
                            ins.isStandard
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-rose-950 text-rose-400 border border-rose-800 animate-pulse'
                          }`}
                        >
                          {ins.isStandard ? '合格' : '不合格待整改'}
                        </span>
                      </div>
                      <div className="text-slate-200">{ins.evaluationCategory}</div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-slate-400">巡查人: {ins.inspectorName}</span>
                        <button
                          onClick={() => onOpenQualityDetailModal(ins, selectedFeature)}
                          className="text-[10px] text-[#00FEFA] hover:underline flex items-center gap-0.5"
                        >
                          <span>查看详细</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-2 rounded bg-[#05321C]/50 text-slate-400 text-center text-[10px]">
                  暂无质量巡查抽检不合格记录
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 7. 图例 (右侧偏移悬浮，随右面板展开自动向左平移避让，§7) */}
      <div
        style={{
          right: isRightDrawerOpen ? '420px' : '24px',
          bottom: '72px',
        }}
        className="absolute z-20 px-3.5 py-2 rounded-lg bg-[#032414]/90 border border-[#00A565]/80 shadow-xl backdrop-blur flex items-center gap-4 text-xs text-slate-200 transition-all duration-300"
      >
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-1 bg-[#00FEFA]" />
          <span>行政区边界</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#FF5CC4]" />
          <span>已完工</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#FDF652]" />
          <span>施工中</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#F09035]" />
          <span>未进场</span>
        </div>
      </div>
    </div>
  );
};
