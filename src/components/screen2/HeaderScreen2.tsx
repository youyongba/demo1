import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Video,
  Square,
  Maximize2,
  Minimize2,
  Clock,
  Compass,
  FolderGit2,
  Search,
} from 'lucide-react';
import { ProjectBlock } from '../../types/dashboard';
import { PROJECT_BLOCKS } from '../../data/mockData';

interface HeaderScreen2Props {
  currentProject: ProjectBlock;
  onSelectProject: (project: ProjectBlock) => void;
  onBackToOverview: (targetCity?: string, targetCounty?: string) => void;
  isRecording: boolean;
  recordDurationText: string;
  isRecordSupported: boolean;
  onStartRecord: () => void;
  onStopRecord: () => void;
}

export const HeaderScreen2: React.FC<HeaderScreen2Props> = ({
  currentProject,
  onSelectProject,
  onBackToOverview,
  isRecording,
  recordDurationText,
  isRecordSupported,
  onStartRecord,
  onStopRecord,
}) => {
  const [currentTime, setCurrentTime] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  // Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('zh-CN', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Listen to fullscreen changes
  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(console.error);
    } else {
      document.exitFullscreen().catch(console.error);
    }
  };

  const currentIndex = PROJECT_BLOCKS.findIndex((p) => p.id === currentProject.id);

  const handlePrevProject = () => {
    const prevIdx = (currentIndex - 1 + PROJECT_BLOCKS.length) % PROJECT_BLOCKS.length;
    onSelectProject(PROJECT_BLOCKS[prevIdx]);
  };

  const handleNextProject = () => {
    const nextIdx = (currentIndex + 1) % PROJECT_BLOCKS.length;
    onSelectProject(PROJECT_BLOCKS[nextIdx]);
  };

  return (
    <header className="relative w-full h-[76px] flex items-center justify-between px-7 shrink-0 z-20 border-b border-sky-950/80 bg-gradient-to-b from-[#081533] via-[#071129] to-[#060d21]">
      {/* Decorative top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent pointer-events-none" />

      {/* Left: Breadcrumbs (§3) */}
      <div className="flex items-center gap-2 text-xs font-medium z-10 w-[460px]">
        {/* Back to Screen 1 Button */}
        <button
          onClick={() => onBackToOverview()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-950/80 hover:bg-cyan-950 text-cyan-300 border border-cyan-500/40 hover:border-cyan-400 transition-all shadow-[0_0_10px_rgba(6,182,212,0.2)] font-semibold"
          title="返回一屏（监测总览大屏），并保持离开时的视角"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>返回总览</span>
        </button>

        <span className="text-slate-600">/</span>

        {/* Clickable Breadcrumbs Navigation */}
        <div className="flex items-center gap-1.5 text-slate-300">
          <button
            onClick={() => onBackToOverview()}
            className="hover:text-cyan-300 transition-colors"
          >
            总览
          </button>
          <span className="text-slate-600">&gt;</span>
          <button
            onClick={() => onBackToOverview(currentProject.cityName)}
            className="hover:text-cyan-300 transition-colors"
          >
            {currentProject.cityName}
          </button>
          <span className="text-slate-600">&gt;</span>
          <button
            onClick={() => onBackToOverview(currentProject.cityName, currentProject.countyName)}
            className="hover:text-cyan-300 transition-colors"
          >
            {currentProject.countyName}
          </button>
          <span className="text-slate-600">&gt;</span>
          <span className="text-cyan-300 font-semibold truncate max-w-[170px]" title={currentProject.name}>
            {currentProject.townName}项目
          </span>
        </div>
      </div>

      {/* Middle: Project Switcher with Prev/Next and Search (§3) */}
      <div className="flex items-center justify-center gap-2 z-10">
        <div className="relative flex items-center bg-[#0d1e44]/95 border border-cyan-500/40 rounded-xl p-1 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
          <button
            onClick={handlePrevProject}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-cyan-500/20 transition-colors"
            title="切换上一个项目"
          >
            <ChevronLeft className="w-4 h-4 text-cyan-400" />
          </button>

          <div
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="flex items-center gap-2 px-3 py-1 cursor-pointer hover:bg-cyan-950/60 rounded-lg transition-colors group"
            title="点击展开项目切换列表"
          >
            <FolderGit2 className="w-4 h-4 text-cyan-400" />
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-white tracking-wide truncate max-w-[260px]">
                {currentProject.name}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {currentProject.code} · {currentProject.area.toLocaleString()} 亩
              </span>
            </div>
            <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
              切换
            </span>
          </div>

          <button
            onClick={handleNextProject}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-cyan-500/20 transition-colors"
            title="切换下一个项目"
          >
            <ChevronRight className="w-4 h-4 text-cyan-400" />
          </button>

          {/* Project Switcher Dropdown */}
          {isSearchOpen && (
            <div className="absolute top-12 left-0 right-0 max-h-64 overflow-y-auto bg-[#0a1838] border border-cyan-500/60 rounded-xl shadow-2xl p-2 z-50 flex flex-col gap-1 backdrop-blur">
              <div className="flex items-center bg-[#071329] border border-sky-800 rounded px-2 py-1 mb-1 text-xs">
                <Search className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
                <input
                  type="text"
                  placeholder="搜索项目或图斑..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="bg-transparent text-white placeholder-slate-500 focus:outline-none w-full text-xs"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              {PROJECT_BLOCKS.filter(
                (p) => !searchFilter || p.name.includes(searchFilter) || p.countyName.includes(searchFilter)
              ).map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    onSelectProject(p);
                    setIsSearchOpen(false);
                  }}
                  className={`p-2 rounded cursor-pointer text-xs flex items-center justify-between transition-colors ${
                    p.id === currentProject.id
                      ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-700'
                      : 'hover:bg-slate-800/60 text-slate-200'
                  }`}
                >
                  <div className="flex flex-col truncate">
                    <span className="truncate">{p.name}</span>
                    <span className="text-[10px] text-slate-400">{p.cityName} · {p.countyName}</span>
                  </div>
                  <span className="font-mono text-cyan-400 font-bold text-[11px] shrink-0 ml-2">
                    {p.progress}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right: Record screen, Fullscreen, Clock */}
      <div className="flex items-center gap-4 z-10 w-[420px] justify-end">
        {/* Screen Recording Button (Screen 2 support §9.7) */}
        {isRecording ? (
          <button
            onClick={onStopRecord}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium shadow-[0_0_15px_rgba(225,29,72,0.5)] transition-all animate-pulse"
            title="停止录制并保存"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>停止录制</span>
            <span className="font-mono font-bold bg-rose-950/70 px-1.5 py-0.5 rounded text-[11px]">
              {recordDurationText}
            </span>
          </button>
        ) : (
          <button
            onClick={onStartRecord}
            disabled={!isRecordSupported}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isRecordSupported
                ? 'bg-sky-950/80 hover:bg-cyan-950/90 text-cyan-300 border border-cyan-500/40 hover:border-cyan-400'
                : 'bg-slate-900/60 text-slate-500 border border-slate-800 cursor-not-allowed'
            }`}
            title="录制二屏监管与处置操作"
          >
            <Video className="w-3.5 h-3.5 text-cyan-400" />
            <span>录制监管演示</span>
          </button>
        )}

        {/* Fullscreen Toggle */}
        <button
          onClick={handleToggleFullscreen}
          className="p-2 rounded-lg bg-sky-950/60 hover:bg-cyan-950/80 text-slate-300 hover:text-white border border-sky-800/40 transition-colors"
          title={isFullscreen ? '退出全屏' : '全屏显示 (F11)'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4 text-cyan-400" /> : <Maximize2 className="w-4 h-4 text-cyan-400" />}
        </button>

        {/* Clock */}
        <div className="flex items-center gap-1.5 bg-sky-950/60 px-2.5 py-1.5 rounded-lg border border-sky-900/50">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-mono text-xs font-semibold tracking-wider text-slate-100 tabular-nums">
            {currentTime}
          </span>
        </div>
      </div>
    </header>
  );
};
