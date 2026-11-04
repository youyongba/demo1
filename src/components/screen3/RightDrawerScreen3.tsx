import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Database,
  Search,
  Video,
  Phone,
  HardHat,
  TrendingUp,
  FolderGit2,
  MapPin,
  CheckCircle2,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  FilterProject,
  FilterProjectArea,
  FilterBlock,
  BlockGisFeature,
  ConstructionWorker,
} from '../../types/screen3Types';
import {
  PROJECT_CONSTRUCTION_CONTENT,
  AREA_CONSTRUCTION_CONTENT,
  BLOCK_CONSTRUCTION_CONTENT,
  SCREEN3_CONSTRUCTION_WORKERS,
} from '../../data/screen3Data';

interface RightDrawerScreen3Props {
  isOpen: boolean;
  project: FilterProject;
  area: FilterProjectArea;
  block: FilterBlock;
  features: BlockGisFeature[];
  onFlyToFeature: (feature: BlockGisFeature) => void;
  onStartWorkerVideoCall: (worker: ConstructionWorker) => void;
  onPushDatabase: () => void;
  isPushingDb: boolean;
}

export const RightDrawerScreen3: React.FC<RightDrawerScreen3Props> = ({
  isOpen,
  project,
  area,
  block,
  features,
  onFlyToFeature,
  onStartWorkerVideoCall,
  onPushDatabase,
  isPushingDb,
}) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    project: true,
    area: true,
    block: true,
    workers: true,
  });

  const [featureSearch, setFeatureSearch] = useState('');

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredFeatures = features.filter(
    (f) => !featureSearch || f.RefName.includes(featureSearch) || f.gclb.includes(featureSearch)
  );

  if (!isOpen) return null;

  return (
    <aside className="absolute right-4 top-16 bottom-18 w-[390px] bg-[#05321C]/95 border border-[#00A565]/80 rounded-xl shadow-[0_10px_35px_rgba(0,0,0,0.85)] z-30 flex flex-col overflow-hidden backdrop-blur select-none transition-all duration-300 animate-in fade-in slide-in-from-right">
      {/* Title Header */}
      <div className="h-10 px-4 bg-gradient-to-r from-[#032414] via-[#05321C] to-[#032414] border-b border-[#00A565]/60 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#1ac88c]" />
          <h2 className="text-xs font-bold text-white tracking-wider uppercase">
            多层级工程量与作业班组
          </h2>
        </div>
        <span className="text-[10px] text-[#00FEFA] font-mono">DATA INSPECT</span>
      </div>

      {/* Accordion List Body */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 text-xs">
        {/* 6.1 项目概况 */}
        <div className="rounded-lg bg-[#032414]/90 border border-[#00A565]/40 overflow-hidden">
          <div
            onClick={() => toggleSection('project')}
            className="p-2.5 flex items-center justify-between cursor-pointer hover:bg-[#074728]/50 transition-colors"
          >
            <div className="flex items-center gap-1.5 font-bold text-[#1ac88c]">
              <FolderGit2 className="w-3.5 h-3.5 text-[#00FEFA]" />
              <span className="truncate max-w-[260px]">{project.name}</span>
            </div>
            {openSections.project ? <ChevronDown className="w-3.5 h-3.5 text-[#1ac88c]" /> : <ChevronRight className="w-3.5 h-3.5 text-[#1ac88c]" />}
          </div>

          {openSections.project && (
            <div className="p-3 border-t border-[#00A565]/30 space-y-2">
              <div className="grid grid-cols-3 gap-1.5 text-center">
                <div className="p-1 rounded bg-[#05321C] border border-[#00A565]/30">
                  <span className="text-[9px] text-slate-400">项目区/标段</span>
                  <div className="font-mono font-bold text-white text-[11px]">
                    {project.projectAreaCount} 区 / {project.blockCount} 标
                  </div>
                </div>
                <div className="p-1 rounded bg-[#05321C] border border-[#00A565]/30">
                  <span className="text-[9px] text-slate-400">总投资</span>
                  <div className="font-mono font-bold text-amber-300 text-[11px]">
                    {project.money} 万元
                  </div>
                </div>
                <div className="p-1 rounded bg-[#05321C] border border-[#00A565]/30">
                  <span className="text-[9px] text-slate-400">总进度</span>
                  <div className="font-mono font-bold text-[#00FEFA] text-[11px]">
                    {project.actualPercent}%
                  </div>
                </div>
              </div>

              {/* Construction Content Table */}
              <div className="space-y-1 pt-1">
                <span className="text-[10px] text-[#1ac88c] font-semibold">项目主体施工内容汇总:</span>
                <div className="max-h-24 overflow-y-auto space-y-1">
                  {PROJECT_CONSTRUCTION_CONTENT.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-1 bg-[#05321C]/60 rounded text-[10px]"
                    >
                      <span className="text-slate-200">{item.name}</span>
                      <span className="font-mono text-[#00FEFA]">
                        {item.completedQuantity} / {item.totalQuantity} {item.unit} ({item.percent}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 6.2 项目区概况 */}
        <div className="rounded-lg bg-[#032414]/90 border border-[#00A565]/40 overflow-hidden">
          <div
            onClick={() => toggleSection('area')}
            className="p-2.5 flex items-center justify-between cursor-pointer hover:bg-[#074728]/50 transition-colors"
          >
            <div className="flex items-center gap-1.5 font-bold text-[#1ac88c]">
              <MapPin className="w-3.5 h-3.5 text-[#00FEFA]" />
              <span className="truncate max-w-[260px]">{area.name}</span>
            </div>
            {openSections.area ? <ChevronDown className="w-3.5 h-3.5 text-[#1ac88c]" /> : <ChevronRight className="w-3.5 h-3.5 text-[#1ac88c]" />}
          </div>

          {openSections.area && (
            <div className="p-3 border-t border-[#00A565]/30 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">标段配额: {area.blockCount} 个标段</span>
                <span className="font-mono text-amber-300 font-bold">{area.money} 万元</span>
                <span className="font-mono text-[#00FEFA] font-bold">{area.actualPercent}%</span>
              </div>

              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#00A565] to-[#00FEFA] rounded-full"
                  style={{ width: `${area.actualPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* 6.3 标段概况 (核心要素联动与一键入库) */}
        <div className="rounded-lg bg-[#032414]/90 border-2 border-[#00A565] overflow-hidden shadow">
          <div
            onClick={() => toggleSection('block')}
            className="p-2.5 flex items-center justify-between cursor-pointer bg-[#05321C] transition-colors"
          >
            <div className="flex items-center gap-1.5 font-bold text-[#00FEFA]">
              <HardHat className="w-3.5 h-3.5 text-amber-300" />
              <span className="truncate max-w-[240px]">{block.name}</span>
            </div>
            {openSections.block ? <ChevronDown className="w-3.5 h-3.5 text-[#1ac88c]" /> : <ChevronRight className="w-3.5 h-3.5 text-[#1ac88c]" />}
          </div>

          {openSections.block && (
            <div className="p-3 border-t border-[#00A565]/40 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">标段概算投资:</span>
                <span className="font-mono text-amber-300 font-bold">
                  {(block.money / 10000).toFixed(2)} 万元 ({block.money.toLocaleString()} 元)
                </span>
              </div>

              {/* Overall Progress Bar */}
              <div className="flex items-center justify-between text-[11px] text-slate-300">
                <span>标段综合工程进度</span>
                <span className="font-mono font-bold text-[#00FEFA]">{block.actualPercent}%</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#1ac88c] rounded-full"
                  style={{ width: `${block.actualPercent}%` }}
                />
              </div>

              {/* Sub-engineering Features Search & Click-to-locate (§6.3) */}
              <div className="pt-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-[#1ac88c] font-semibold">
                    分项工程要素列表（点击行飞行定位）:
                  </span>
                </div>

                <div className="flex items-center bg-[#05321C] border border-[#00A565]/60 rounded px-2 py-0.5 text-xs mb-1.5">
                  <Search className="w-3 h-3 text-slate-400 mr-1 shrink-0" />
                  <input
                    type="text"
                    placeholder="按分项名称、类别搜索..."
                    value={featureSearch}
                    onChange={(e) => setFeatureSearch(e.target.value)}
                    className="bg-transparent text-white placeholder-slate-500 focus:outline-none w-full text-[11px]"
                  />
                </div>

                <div className="max-h-36 overflow-y-auto space-y-1 pr-1">
                  {filteredFeatures.map((f) => (
                    <div
                      key={f.id}
                      onClick={() => onFlyToFeature(f)}
                      className="p-1.5 rounded bg-[#05321C]/80 hover:bg-[#074728] border border-[#00A565]/30 flex items-center justify-between cursor-pointer transition-colors group"
                      title="点击飞行定位该要素并在地图弹出工序浮层"
                    >
                      <div className="flex flex-col truncate max-w-[240px]">
                        <span className="text-slate-200 group-hover:text-white font-medium truncate text-[11px]">
                          {f.RefName}
                        </span>
                        <span className="text-[9px] text-[#1ac88c]">{f.gclb}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span
                          className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                            f.constructionStatus === 2
                              ? 'bg-pink-950 text-[#FF5CC4] border border-[#FF5CC4]'
                              : f.constructionStatus === 1
                              ? 'bg-yellow-950 text-[#FDF652] border border-[#FDF652]'
                              : 'bg-orange-950 text-[#F09035] border border-[#F09035]'
                          }`}
                        >
                          {f.actualPercent}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 一键入库按钮 (§6.3) */}
              <button
                onClick={onPushDatabase}
                disabled={isPushingDb}
                className="w-full mt-2 py-2 px-3 rounded-lg bg-gradient-to-r from-[#00A565] to-[#00FEFA] hover:brightness-110 text-[#032414] font-bold text-xs flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(0,254,250,0.3)] transition-all disabled:opacity-50"
              >
                {isPushingDb ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-[#032414] border-t-transparent rounded-full animate-spin" />
                    <span>正在读取并组装要素坐标入库...</span>
                  </>
                ) : (
                  <>
                    <Database className="w-3.5 h-3.5" />
                    <span>标段工程要素一键入库</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* 6.4 施工人员列表 (班组人员与在线通话) */}
        <div className="rounded-lg bg-[#032414]/90 border border-[#00A565]/40 overflow-hidden">
          <div
            onClick={() => toggleSection('workers')}
            className="p-2.5 flex items-center justify-between cursor-pointer hover:bg-[#074728]/50 transition-colors"
          >
            <div className="flex items-center gap-1.5 font-bold text-[#1ac88c]">
              <HardHat className="w-3.5 h-3.5" />
              <span>6.4 施工现场班组人员</span>
            </div>
            {openSections.workers ? <ChevronDown className="w-3.5 h-3.5 text-[#1ac88c]" /> : <ChevronRight className="w-3.5 h-3.5 text-[#1ac88c]" />}
          </div>

          {openSections.workers && (
            <div className="px-2 pb-2 pt-1 border-t border-[#00A565]/30 space-y-1.5">
              {SCREEN3_CONSTRUCTION_WORKERS.map((worker) => (
                <div
                  key={worker.id}
                  className="p-2 rounded bg-[#05321C]/80 border border-[#00A565]/30 flex items-center justify-between text-xs hover:bg-[#074728] transition-colors group"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        worker.isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
                      }`}
                      title={worker.isOnline ? '在岗在线' : '离线'}
                    />
                    <div className="flex flex-col truncate">
                      <span className="font-bold text-white truncate">{worker.name}</span>
                      <span className="text-[10px] text-slate-400 truncate">{worker.role}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono text-[10px] text-slate-400">{worker.phone}</span>
                    <button
                      onClick={() => onStartWorkerVideoCall(worker)}
                      disabled={!worker.isOnline}
                      className="p-1 rounded bg-[#074728] hover:bg-[#00A565] text-[#00FEFA] border border-[#00A565]/60 disabled:opacity-30 disabled:pointer-events-none"
                      title="发起视频通话"
                    >
                      <Video className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
