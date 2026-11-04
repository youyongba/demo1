import React from 'react';
import {
  Calendar,
  Layers,
  FolderGit2,
  MapPin,
  SlidersHorizontal,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import {
  FilterYear,
  FilterProjectType,
  FilterProject,
  FilterProjectArea,
  FilterBlock,
} from '../../types/screen3Types';
import {
  SCREEN3_YEARS,
  SCREEN3_PROJECT_TYPES,
  SCREEN3_PROJECTS,
  SCREEN3_AREAS,
  SCREEN3_BLOCKS,
} from '../../data/screen3Data';

interface BottomFilterBarProps {
  selectedYear: string;
  selectedProjectType: string;
  selectedProjectId: string;
  selectedAreaId: string;
  selectedBlockId: string;
  isDrawerOpen: boolean;
  onToggleDrawer: () => void;
  onYearChange: (year: string) => void;
  onProjectTypeChange: (typeId: string) => void;
  onProjectChange: (projId: string) => void;
  onAreaChange: (areaId: string) => void;
  onBlockChange: (blockId: string) => void;
}

export const BottomFilterBar: React.FC<BottomFilterBarProps> = ({
  selectedYear,
  selectedProjectType,
  selectedProjectId,
  selectedAreaId,
  selectedBlockId,
  isDrawerOpen,
  onToggleDrawer,
  onYearChange,
  onProjectTypeChange,
  onProjectChange,
  onAreaChange,
  onBlockChange,
}) => {
  return (
    <footer className="absolute bottom-0 left-0 right-0 h-14 bg-[#032414]/95 border-t border-[#00A565]/80 shadow-[0_-5px_25px_rgba(0,0,0,0.85)] z-40 px-6 flex items-center justify-between backdrop-blur select-none">
      {/* 5-Level Cascading Dropdowns (§2.1) */}
      <div className="flex items-center gap-3 text-xs">
        <span className="text-[#1ac88c] font-bold tracking-wider flex items-center gap-1.5 shrink-0 text-xs uppercase font-mono">
          <SlidersHorizontal className="w-4 h-4 text-[#00FEFA]" />
          <span>工程五级联动筛选</span>
        </span>

        {/* Level 1: 年度 */}
        <div className="relative flex items-center bg-[#05321C] border border-[#00A565]/60 hover:border-[#00FEFA] rounded-lg px-2.5 py-1 text-slate-100 transition-colors">
          <Calendar className="w-3.5 h-3.5 text-[#1ac88c] mr-1.5 shrink-0" />
          <select
            value={selectedYear}
            onChange={(e) => onYearChange(e.target.value)}
            className="bg-transparent text-white font-medium focus:outline-none cursor-pointer pr-4 text-xs appearance-none"
          >
            {SCREEN3_YEARS.map((y) => (
              <option key={y.id} value={y.id} className="bg-[#05321C] text-white">
                {y.name}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3 h-3 text-[#1ac88c] pointer-events-none absolute right-2" />
        </div>

        {/* Level 2: 项目类型 */}
        <div className="relative flex items-center bg-[#05321C] border border-[#00A565]/60 hover:border-[#00FEFA] rounded-lg px-2.5 py-1 text-slate-100 transition-colors">
          <Layers className="w-3.5 h-3.5 text-[#1ac88c] mr-1.5 shrink-0" />
          <select
            value={selectedProjectType}
            onChange={(e) => onProjectTypeChange(e.target.value)}
            className="bg-transparent text-white font-medium focus:outline-none cursor-pointer pr-4 text-xs appearance-none"
          >
            {SCREEN3_PROJECT_TYPES.map((pt) => (
              <option key={pt.id} value={pt.id} className="bg-[#05321C] text-white">
                {pt.name}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3 h-3 text-[#1ac88c] pointer-events-none absolute right-2" />
        </div>

        {/* Level 3: 项目 */}
        <div className="relative flex items-center bg-[#05321C] border border-[#00A565]/60 hover:border-[#00FEFA] rounded-lg px-2.5 py-1 text-slate-100 transition-colors max-w-[280px]">
          <FolderGit2 className="w-3.5 h-3.5 text-[#1ac88c] mr-1.5 shrink-0" />
          <select
            value={selectedProjectId}
            onChange={(e) => onProjectChange(e.target.value)}
            className="bg-transparent text-white font-medium focus:outline-none cursor-pointer pr-4 text-xs appearance-none truncate"
          >
            {SCREEN3_PROJECTS.map((p) => (
              <option key={p.id} value={p.id} className="bg-[#05321C] text-white">
                {p.name}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3 h-3 text-[#1ac88c] pointer-events-none absolute right-2" />
        </div>

        {/* Level 4: 项目区 */}
        <div className="relative flex items-center bg-[#05321C] border border-[#00A565]/60 hover:border-[#00FEFA] rounded-lg px-2.5 py-1 text-slate-100 transition-colors">
          <MapPin className="w-3.5 h-3.5 text-[#1ac88c] mr-1.5 shrink-0" />
          <select
            value={selectedAreaId}
            onChange={(e) => onAreaChange(e.target.value)}
            className="bg-transparent text-white font-medium focus:outline-none cursor-pointer pr-4 text-xs appearance-none"
          >
            {SCREEN3_AREAS.map((a) => (
              <option key={a.id} value={a.id} className="bg-[#05321C] text-white">
                {a.name}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3 h-3 text-[#1ac88c] pointer-events-none absolute right-2" />
        </div>

        {/* Level 5: 标段 */}
        <div className="relative flex items-center bg-[#05321C] border-2 border-[#1ac88c] rounded-lg px-2.5 py-1 text-slate-100 shadow-[0_0_10px_rgba(26,200,140,0.3)]">
          <span className="w-2 h-2 rounded-full bg-[#00FEFA] animate-pulse mr-1.5 shrink-0" />
          <select
            value={selectedBlockId}
            onChange={(e) => onBlockChange(e.target.value)}
            className="bg-transparent text-[#00FEFA] font-bold focus:outline-none cursor-pointer pr-4 text-xs appearance-none"
          >
            {SCREEN3_BLOCKS.map((b) => (
              <option key={b.id} value={b.id} className="bg-[#05321C] text-white">
                {b.name}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3 h-3 text-[#00FEFA] pointer-events-none absolute right-2" />
        </div>
      </div>

      {/* Right Drawer Toggle Button (§1 & §2.1) */}
      <button
        onClick={onToggleDrawer}
        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
          isDrawerOpen
            ? 'bg-[#00A565] hover:bg-[#1ac88c] text-[#032414] border-[#00FEFA] shadow-[0_0_12px_rgba(0,254,250,0.4)]'
            : 'bg-[#05321C] hover:bg-[#074728] text-[#1ac88c] border-[#00A565]'
        }`}
        title={isDrawerOpen ? '点击收起左右控制抽屉面板' : '点击展开左右控制抽屉面板'}
      >
        {isDrawerOpen ? (
          <>
            <PanelLeftClose className="w-4 h-4" />
            <span>收起左右监管面板</span>
          </>
        ) : (
          <>
            <PanelLeftOpen className="w-4 h-4" />
            <span>展开左右监管面板</span>
          </>
        )}
      </button>
    </footer>
  );
};
