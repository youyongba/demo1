import React, { useState, useEffect } from 'react';
import {
  Video,
  Square,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Clock,
} from 'lucide-react';

interface HeaderProps {
  currentYear: number;
  onYearChange: (year: number) => void;
  isRecording: boolean;
  recordDurationText: string;
  isRecordSupported: boolean;
  onStartRecord: () => void;
  onStopRecord: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentYear,
  onYearChange,
  isRecording,
  recordDurationText,
  isRecordSupported,
  onStartRecord,
  onStopRecord,
}) => {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const availableYears = [2023, 2024, 2025, 2026];

  // Live Clock update
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('zh-CN', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
      const dayName = days[now.getDay()];
      const dateStr = `${now.getFullYear()}年${String(now.getMonth() + 1).padStart(2, '0')}月${String(now.getDate()).padStart(2, '0')}日 ${dayName}`;

      setCurrentTime(timeStr);
      setCurrentDate(dateStr);
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
      document.documentElement.requestFullscreen().catch((err) => {
        console.error('Fullscreen request error:', err);
      });
    } else {
      document.exitFullscreen().catch((err) => {
        console.error('Exit fullscreen error:', err);
      });
    }
  };

  const handlePrevYear = () => {
    const idx = availableYears.indexOf(currentYear);
    if (idx > 0) {
      onYearChange(availableYears[idx - 1]);
    }
  };

  const handleNextYear = () => {
    const idx = availableYears.indexOf(currentYear);
    if (idx < availableYears.length - 1) {
      onYearChange(availableYears[idx + 1]);
    }
  };

  return (
    <header className="relative w-full h-[76px] flex items-center justify-between px-7 shrink-0 z-20 border-b border-sky-950/80 bg-gradient-to-b from-[#081533] via-[#071129] to-[#060d21]">
      {/* Decorative top ambient bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent pointer-events-none" />

      {/* Left zone: System Brand & Title */}
      <div className="flex items-center gap-3.5 z-10 w-[380px]">
        <div className="w-10 h-10 rounded-lg bg-sky-950/90 border border-cyan-500/40 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.25)]">
          <ShieldCheck className="w-6 h-6 text-cyan-400" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-[22px] font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-cyan-300 whitespace-nowrap">
            吉林省高标准农田建设监测大屏
          </h1>
          <div className="flex items-center gap-2 text-[11px] text-slate-400 tracking-wide font-medium">
            <span>省级黑土地与农田工程统筹管理平台</span>
            <span className="text-slate-600">/</span>
            <span className="text-cyan-400/90 font-mono">FARMLAND MONITORING GIS</span>
          </div>
        </div>
      </div>

      {/* Middle zone: Year Switcher in Header */}
      <div className="flex items-center justify-center gap-2 z-10">
        <div className="flex items-center bg-[#0d1e44]/90 border border-cyan-500/30 rounded-lg p-1 shadow-inner">
          <button
            onClick={handlePrevYear}
            disabled={currentYear <= availableYears[0]}
            className="p-1 rounded text-slate-300 hover:text-white hover:bg-cyan-500/20 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="前一年"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1 px-1">
            <Calendar className="w-3.5 h-3.5 text-cyan-400 ml-1" />
            {availableYears.map((year) => {
              const isActive = year === currentYear;
              return (
                <button
                  key={year}
                  onClick={() => onYearChange(year)}
                  className={`px-3 py-1 text-xs font-semibold rounded transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  {year} 年度
                </button>
              );
            })}
          </div>

          <button
            onClick={handleNextYear}
            disabled={currentYear >= availableYears[availableYears.length - 1]}
            className="p-1 rounded text-slate-300 hover:text-white hover:bg-cyan-500/20 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="后一年"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Right zone: Screen recording, Fullscreen, Clock, Recording flashing indicator */}
      <div className="flex items-center gap-4 z-10 w-[380px] justify-end">
        {/* Screen Recording Button */}
        {isRecording ? (
          <button
            onClick={onStopRecord}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium shadow-[0_0_15px_rgba(225,29,72,0.5)] transition-all animate-pulse"
            title="点击停止录屏并保存视频"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>停止录屏</span>
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
                ? 'bg-sky-950/80 hover:bg-cyan-950/90 text-cyan-300 border border-cyan-500/40 hover:border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.15)]'
                : 'bg-slate-900/60 text-slate-500 border border-slate-800 cursor-not-allowed'
            }`}
            title={isRecordSupported ? '点击捕获当前页面并录制大屏演示' : '当前环境不支持屏幕录制API'}
          >
            <Video className="w-3.5 h-3.5 text-cyan-400" />
            <span>开始录屏</span>
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

        {/* Live Date & Time Display with Recording Status Badge */}
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1.5">
            {isRecording && (
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
              </span>
            )}
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-mono text-sm font-semibold tracking-wider text-slate-100 tabular-nums">
              {currentTime}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-normal">{currentDate}</span>
        </div>
      </div>
    </header>
  );
};
