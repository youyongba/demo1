import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Video,
  Square,
  Maximize2,
  Minimize2,
  Clock,
  HardHat,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { FilterProject, FilterBlock } from '../../types/screen3Types';

interface HeaderScreen3Props {
  project: FilterProject;
  block: FilterBlock;
  onBackToOverview: () => void;
  onBackToProjectScreen2: () => void;
  isRecording: boolean;
  recordDurationText: string;
  isRecordSupported: boolean;
  onStartRecord: () => void;
  onStopRecord: () => void;
}

export const HeaderScreen3: React.FC<HeaderScreen3Props> = ({
  project,
  block,
  onBackToOverview,
  onBackToProjectScreen2,
  isRecording,
  recordDurationText,
  isRecordSupported,
  onStartRecord,
  onStopRecord,
}) => {
  const [currentTime, setCurrentTime] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  return (
    <header className="relative w-full h-[70px] flex items-center justify-between px-6 shrink-0 z-20 border-b border-[#00A565]/80 bg-gradient-to-b from-[#032414] via-[#05321C] to-[#021d10] select-none">
      {/* Top green cyber accent light line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00FEFA] to-transparent pointer-events-none" />

      {/* Left: Brand Title & Back Navigation */}
      <div className="flex items-center gap-3 z-10 w-[480px]">
        <button
          onClick={onBackToProjectScreen2}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#05321C] hover:bg-[#074728] text-[#00FEFA] border border-[#00A565] transition-all text-xs font-semibold shadow"
          title="返回二屏（项目全过程监管屏）"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>返回二屏</span>
        </button>

        <button
          onClick={onBackToOverview}
          className="px-2.5 py-1.5 rounded-lg bg-[#05321C]/80 hover:bg-[#074728] text-slate-300 hover:text-white border border-[#00A565]/50 transition-all text-xs"
          title="返回一屏（监测总览大屏）"
        >
          <span>一屏总览</span>
        </button>

        <div className="h-5 w-[1px] bg-[#00A565]/40" />

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <HardHat className="w-4 h-4 text-amber-300" />
            <h1 className="text-base font-bold text-white tracking-wide">
              标段工程级监管大屏 (三屏)
            </h1>
          </div>
          <span className="text-[10px] text-[#1ac88c] font-mono truncate max-w-[280px]">
            {project.name.slice(0, 14)}... · {block.name}
          </span>
        </div>
      </div>

      {/* Middle: Current active block indicator badge */}
      <div className="flex items-center gap-2 z-10">
        <div className="px-4 py-1 rounded-full bg-[#032414]/90 border border-[#00FEFA]/60 shadow-[0_0_12px_rgba(0,254,250,0.25)] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00FEFA] animate-pulse" />
          <span className="text-xs font-bold text-white tracking-wide">{block.name}</span>
          <span className="text-[10px] text-[#1ac88c] font-mono">
            进度: {block.actualPercent}% · 投入: {(block.money / 10000).toFixed(1)}万
          </span>
        </div>
      </div>

      {/* Right: Screen recording, Fullscreen, Clock */}
      <div className="flex items-center gap-4 z-10 w-[420px] justify-end">
        {isRecording ? (
          <button
            onClick={onStopRecord}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium shadow-[0_0_15px_rgba(225,29,72,0.5)] transition-all animate-pulse"
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
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-[#05321C] hover:bg-[#074728] text-[#00FEFA] border border-[#00A565]"
            title="录制标段工程GIS监管演示"
          >
            <Video className="w-3.5 h-3.5 text-[#00FEFA]" />
            <span>录屏演示</span>
          </button>
        )}

        {/* Fullscreen */}
        <button
          onClick={handleToggleFullscreen}
          className="p-2 rounded-lg bg-[#05321C] hover:bg-[#074728] text-slate-300 hover:text-white border border-[#00A565]"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4 text-[#00FEFA]" /> : <Maximize2 className="w-4 h-4 text-[#00FEFA]" />}
        </button>

        {/* Clock */}
        <div className="flex items-center gap-1.5 bg-[#05321C] px-2.5 py-1.5 rounded-lg border border-[#00A565]/60">
          <Clock className="w-3.5 h-3.5 text-[#00FEFA]" />
          <span className="font-mono text-xs font-semibold text-white tabular-nums">
            {currentTime}
          </span>
        </div>
      </div>
    </header>
  );
};
