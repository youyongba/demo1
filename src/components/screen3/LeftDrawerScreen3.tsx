import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  AlertOctagon,
  Eye,
  Camera,
  Layers,
  MapPin,
  UserCheck,
  Video,
  Route,
  Phone,
  ShieldCheck,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { ManagementPersonnel } from '../../types/screen3Types';
import { SCREEN3_MANAGEMENT_PERSONNEL } from '../../data/screen3Data';

interface LeftDrawerScreen3Props {
  isOpen: boolean;
  // Status filter checkboxes
  statusFilters: { completed: boolean; constructing: boolean; notStarted: boolean };
  onToggleStatusFilter: (key: 'completed' | 'constructing' | 'notStarted') => void;
  onToggleAllStatus: (selectAll: boolean) => void;

  // Quality alarm & Missing photos
  showQualityAlarm: boolean;
  onToggleQualityAlarm: () => void;
  showMissingPhotos: boolean;
  onToggleMissingPhotos: () => void;

  // Layers
  showPlanningArea: boolean;
  onTogglePlanningArea: () => void;
  showRefNames: boolean;
  onToggleRefNames: () => void;

  // Engineering Category
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;

  // Management Personnel actions
  onStartVideoCall: (person: ManagementPersonnel) => void;
  onViewTrajectory: (person: ManagementPersonnel) => void;
  onOpenLiveVideo: (person: ManagementPersonnel) => void;

  // Trajectory Layer selections
  selectedJlTrack: string;
  onSelectJlTrack: (id: string) => void;
  selectedJgTrack: string;
  onSelectJgTrack: (id: string) => void;
}

export const LeftDrawerScreen3: React.FC<LeftDrawerScreen3Props> = ({
  isOpen,
  statusFilters,
  onToggleStatusFilter,
  onToggleAllStatus,
  showQualityAlarm,
  onToggleQualityAlarm,
  showMissingPhotos,
  onToggleMissingPhotos,
  showPlanningArea,
  onTogglePlanningArea,
  showRefNames,
  onToggleRefNames,
  selectedCategory,
  onSelectCategory,
  onStartVideoCall,
  onViewTrajectory,
  onOpenLiveVideo,
  selectedJlTrack,
  onSelectJlTrack,
  selectedJgTrack,
  onSelectJgTrack,
}) => {
  // Accordion open states
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    types: true,
    quality: true,
    warnings: true,
    planning: true,
    names: true,
    categories: true,
    personnel: true,
    trajectories: true,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isAllSelected = statusFilters.completed && statusFilters.constructing && statusFilters.notStarted;
  const isPartiallySelected =
    (statusFilters.completed || statusFilters.constructing || statusFilters.notStarted) && !isAllSelected;

  const categories = ['全部', '土地平整', '灌排渠道', '节水喷灌', '田间道路', '泵站涵闸'];

  if (!isOpen) return null;

  return (
    <aside className="absolute left-4 top-16 bottom-18 w-[380px] bg-[#05321C]/95 border border-[#00A565]/80 rounded-xl shadow-[0_10px_35px_rgba(0,0,0,0.85)] z-30 flex flex-col overflow-hidden backdrop-blur select-none transition-all duration-300 animate-in fade-in slide-in-from-left">
      {/* Drawer Title Header */}
      <div className="h-10 px-4 bg-gradient-to-r from-[#032414] via-[#05321C] to-[#032414] border-b border-[#00A565]/60 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00FEFA]" />
          <h2 className="text-xs font-bold text-white tracking-wider uppercase">
            图层要素与标段管控面板
          </h2>
        </div>
        <span className="text-[10px] text-[#1ac88c] font-mono">WFS/WMS CONTROL</span>
      </div>

      {/* Accordion List Body */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 text-xs">
        {/* 3.1 农田建设类型 */}
        <div className="rounded-lg bg-[#032414]/90 border border-[#00A565]/40 overflow-hidden">
          <div
            onClick={() => toggleSection('types')}
            className="p-2.5 flex items-center justify-between cursor-pointer hover:bg-[#074728]/50 transition-colors"
          >
            <div className="flex items-center gap-1.5 font-bold text-[#00FEFA]">
              <Layers className="w-3.5 h-3.5" />
              <span>3.1 农田建设类型状态</span>
            </div>
            {openSections.types ? <ChevronDown className="w-3.5 h-3.5 text-[#1ac88c]" /> : <ChevronRight className="w-3.5 h-3.5 text-[#1ac88c]" />}
          </div>

          {openSections.types && (
            <div className="px-3 pb-3 pt-1 flex flex-col gap-2 border-t border-[#00A565]/30">
              <div className="flex items-center justify-between pb-1 border-b border-[#00A565]/20">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300 text-[11px]">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = isPartiallySelected;
                    }}
                    onChange={(e) => onToggleAllStatus(e.target.checked)}
                    className="accent-[#00FEFA] cursor-pointer"
                  />
                  <span>点击展示全部图层状态</span>
                </label>
              </div>

              <div className="grid grid-cols-3 gap-1 pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer text-[11px]">
                  <input
                    type="checkbox"
                    checked={statusFilters.completed}
                    onChange={() => onToggleStatusFilter('completed')}
                    className="accent-[#FF5CC4] cursor-pointer"
                  />
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#FF5CC4]" />
                  <span className="text-slate-200">已完工</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer text-[11px]">
                  <input
                    type="checkbox"
                    checked={statusFilters.constructing}
                    onChange={() => onToggleStatusFilter('constructing')}
                    className="accent-[#FDF652] cursor-pointer"
                  />
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#FDF652]" />
                  <span className="text-slate-200">施工中</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer text-[11px]">
                  <input
                    type="checkbox"
                    checked={statusFilters.notStarted}
                    onChange={() => onToggleStatusFilter('notStarted')}
                    className="accent-[#F09035] cursor-pointer"
                  />
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#F09035]" />
                  <span className="text-slate-200">未进场</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* 3.2 质量巡查告警 */}
        <div className="rounded-lg bg-[#032414]/90 border border-[#00A565]/40 overflow-hidden">
          <div
            onClick={() => toggleSection('quality')}
            className="p-2.5 flex items-center justify-between cursor-pointer hover:bg-[#074728]/50 transition-colors"
          >
            <div className="flex items-center gap-1.5 font-bold text-rose-400">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>3.2 质量巡查告警闪动</span>
            </div>
            {openSections.quality ? <ChevronDown className="w-3.5 h-3.5 text-[#1ac88c]" /> : <ChevronRight className="w-3.5 h-3.5 text-[#1ac88c]" />}
          </div>

          {openSections.quality && (
            <div className="px-3 pb-3 pt-1 flex flex-col gap-2 border-t border-[#00A565]/30">
              <label className="flex items-center gap-2 cursor-pointer text-slate-200 text-xs">
                <input
                  type="checkbox"
                  checked={showQualityAlarm}
                  onChange={onToggleQualityAlarm}
                  className="accent-rose-500 cursor-pointer"
                />
                <span className="font-semibold text-rose-300">
                  展示质量巡查待整改工程告警（800ms红光闪动）
                </span>
              </label>
              <span className="text-[10px] text-slate-400 leading-relaxed">
                筛选出 isExistsPz==='N' 的工程要素并高频闪动，地图标注预警动态点。
              </span>
            </div>
          )}
        </div>

        {/* 3.3 预警信息 (拍照遗漏) */}
        <div className="rounded-lg bg-[#032414]/90 border border-[#00A565]/40 overflow-hidden">
          <div
            onClick={() => toggleSection('warnings')}
            className="p-2.5 flex items-center justify-between cursor-pointer hover:bg-[#074728]/50 transition-colors"
          >
            <div className="flex items-center gap-1.5 font-bold text-amber-400">
              <Camera className="w-3.5 h-3.5" />
              <span>3.3 现场拍照漏项预警</span>
            </div>
            {openSections.warnings ? <ChevronDown className="w-3.5 h-3.5 text-[#1ac88c]" /> : <ChevronRight className="w-3.5 h-3.5 text-[#1ac88c]" />}
          </div>

          {openSections.warnings && (
            <div className="px-3 pb-3 pt-1 flex flex-col gap-2 border-t border-[#00A565]/30">
              <label className="flex items-center gap-2 cursor-pointer text-slate-200 text-xs">
                <input
                  type="checkbox"
                  checked={showMissingPhotos}
                  onChange={onToggleMissingPhotos}
                  className="accent-amber-500 cursor-pointer"
                />
                <span className="font-semibold text-amber-300">
                  标注现场工序拍照遗漏项（可点击弹提醒）
                </span>
              </label>
              <span className="text-[10px] text-slate-400 leading-relaxed">
                在地图上渲染预警动态点，点击可弹出未拍照片清单（missingPzList）。
              </span>
            </div>
          )}
        </div>

        {/* 3.4 & 3.5 规划区与工程名称标注 */}
        <div className="grid grid-cols-2 gap-2">
          {/* 3.4 规划区 */}
          <div className="p-2.5 rounded-lg bg-[#032414]/90 border border-[#00A565]/40 flex flex-col justify-between">
            <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-[#8ee683]">
              <input
                type="checkbox"
                checked={showPlanningArea}
                onChange={onTogglePlanningArea}
                className="accent-[#8ee683] cursor-pointer"
              />
              <span>农田建设规划区</span>
            </label>
            <span className="text-[9px] text-slate-400 mt-1">控制 areaGis 规划面</span>
          </div>

          {/* 3.5 工程名称 */}
          <div className="p-2.5 rounded-lg bg-[#032414]/90 border border-[#00A565]/40 flex flex-col justify-between">
            <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-[#00FEFA]">
              <input
                type="checkbox"
                checked={showRefNames}
                onChange={onToggleRefNames}
                className="accent-[#00FEFA] cursor-pointer"
              />
              <span>展示工程名称</span>
            </label>
            <span className="text-[9px] text-slate-400 mt-1">RefName 文本注记</span>
          </div>
        </div>

        {/* 3.6 工程类别 */}
        <div className="rounded-lg bg-[#032414]/90 border border-[#00A565]/40 overflow-hidden">
          <div
            onClick={() => toggleSection('categories')}
            className="p-2.5 flex items-center justify-between cursor-pointer hover:bg-[#074728]/50 transition-colors"
          >
            <div className="flex items-center gap-1.5 font-bold text-[#1ac88c]">
              <Eye className="w-3.5 h-3.5" />
              <span>3.6 工程类别高亮过滤</span>
            </div>
            {openSections.categories ? <ChevronDown className="w-3.5 h-3.5 text-[#1ac88c]" /> : <ChevronRight className="w-3.5 h-3.5 text-[#1ac88c]" />}
          </div>

          {openSections.categories && (
            <div className="px-3 pb-3 pt-1 border-t border-[#00A565]/30">
              <select
                value={selectedCategory}
                onChange={(e) => onSelectCategory(e.target.value)}
                className="w-full bg-[#05321C] border border-[#00A565] rounded p-1.5 text-xs text-white cursor-pointer focus:outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="bg-[#05321C] text-white">
                    {cat === '全部' ? '全部工程类别' : `仅高亮: ${cat}`}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* 3.7 管理人员（监理/管理人员） */}
        <div className="rounded-lg bg-[#032414]/90 border border-[#00A565]/40 overflow-hidden">
          <div
            onClick={() => toggleSection('personnel')}
            className="p-2.5 flex items-center justify-between cursor-pointer hover:bg-[#074728]/50 transition-colors"
          >
            <div className="flex items-center gap-1.5 font-bold text-[#1ac88c]">
              <UserCheck className="w-3.5 h-3.5" />
              <span>3.7 标段管理与监理人员</span>
            </div>
            {openSections.personnel ? <ChevronDown className="w-3.5 h-3.5 text-[#1ac88c]" /> : <ChevronRight className="w-3.5 h-3.5 text-[#1ac88c]" />}
          </div>

          {openSections.personnel && (
            <div className="px-2 pb-2 pt-1 border-t border-[#00A565]/30 space-y-1.5">
              {SCREEN3_MANAGEMENT_PERSONNEL.map((person) => (
                <div
                  key={person.id}
                  className="p-2 rounded bg-[#05321C]/80 border border-[#00A565]/30 flex items-center justify-between text-xs hover:bg-[#074728] transition-colors group"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        person.isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
                      }`}
                      title={person.isOnline ? 'MCS8 设备在线' : '设备离线'}
                    />
                    <div className="flex flex-col truncate">
                      <span className="font-bold text-white truncate">{person.name}</span>
                      <span className="text-[10px] text-slate-400 truncate">{person.roleTitle}</span>
                    </div>
                  </div>

                  {/* Action buttons (hover expand) */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => onStartVideoCall(person)}
                      disabled={!person.isOnline}
                      className="p-1 rounded bg-[#074728] hover:bg-[#00A565] text-[#00FEFA] border border-[#00A565]/60 disabled:opacity-30 disabled:pointer-events-none"
                      title="发起视频通话"
                    >
                      <Video className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onViewTrajectory(person)}
                      className="p-1 rounded bg-[#074728] hover:bg-[#00A565] text-[#1ac88c] border border-[#00A565]/60"
                      title="查看巡查轨迹"
                    >
                      <Route className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onOpenLiveVideo(person)}
                      disabled={!person.isOnline}
                      className="p-1 rounded bg-[#074728] hover:bg-[#00A565] text-amber-300 border border-[#00A565]/60 disabled:opacity-30 disabled:pointer-events-none"
                      title="拉取单兵实时监控画面"
                    >
                      <Eye className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 3.8 巡查轨迹图层控制 */}
        <div className="rounded-lg bg-[#032414]/90 border border-[#00A565]/40 overflow-hidden">
          <div
            onClick={() => toggleSection('trajectories')}
            className="p-2.5 flex items-center justify-between cursor-pointer hover:bg-[#074728]/50 transition-colors"
          >
            <div className="flex items-center gap-1.5 font-bold text-[#00FEFA]">
              <Route className="w-3.5 h-3.5" />
              <span>3.8 监理 / 监管巡查轨迹图层</span>
            </div>
            {openSections.trajectories ? <ChevronDown className="w-3.5 h-3.5 text-[#1ac88c]" /> : <ChevronRight className="w-3.5 h-3.5 text-[#1ac88c]" />}
          </div>

          {openSections.trajectories && (
            <div className="px-3 pb-3 pt-1 border-t border-[#00A565]/30 space-y-2 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block mb-0.5">监理巡查轨迹 (lineLayer):</span>
                <select
                  value={selectedJlTrack}
                  onChange={(e) => onSelectJlTrack(e.target.value)}
                  className="w-full bg-[#05321C] border border-[#00A565] rounded p-1 text-xs text-white"
                >
                  <option value="none">不叠加监理轨迹</option>
                  <option value="track-jl-01">程明道 (总监) · 今日东支干渠巡查线</option>
                </select>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block mb-0.5">监管巡查轨迹 (lineLayer):</span>
                <select
                  value={selectedJgTrack}
                  onChange={(e) => onSelectJgTrack(e.target.value)}
                  className="w-full bg-[#05321C] border border-[#00A565] rounded p-1 text-xs text-white"
                >
                  <option value="none">不叠加监管轨迹</option>
                  <option value="track-jg-01">刘伟 (监管) · 2号泵站及格田巡检线</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
