import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Camera,
  Radio,
  Disc,
  PhoneOff,
  Minimize2,
  Maximize2,
  Wifi,
  Battery,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { InspectorPersonnel } from '../types/dashboard';
import { ASSET_IMAGES } from '../data/mockData';

interface BodycamModalProps {
  personnel: InspectorPersonnel;
  isOpen: boolean;
  onClose: () => void;
  onCallEndedToast: (msg: string) => void;
}

export const BodycamModal: React.FC<BodycamModalProps> = ({
  personnel,
  isOpen,
  onClose,
  onCallEndedToast,
}) => {
  const [callStatus, setCallStatus] = useState<'calling' | 'connected' | 'ended'>('calling');
  const [callSeconds, setCallSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isPttPressed, setIsPttPressed] = useState(false);
  const [isRecordingStream, setIsRecordingStream] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [snapshotToast, setSnapshotToast] = useState(false);

  // Position for dragging (default bottom-left 50px, 100px)
  const [position, setPosition] = useState({ x: 480, y: 640 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Ringing to connected transition
  useEffect(() => {
    if (!isOpen) return;
    setCallStatus('calling');
    setCallSeconds(0);
    setIsRecordingStream(false);

    const callTimer = setTimeout(() => {
      setCallStatus('connected');
    }, 2400);

    return () => clearTimeout(callTimer);
  }, [isOpen, personnel.id]);

  // Call timer counter
  useEffect(() => {
    if (callStatus !== 'connected') return;
    const interval = setInterval(() => {
      setCallSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [callStatus]);

  if (!isOpen) return null;

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleHangup = () => {
    const duration = formatSeconds(callSeconds);
    setCallStatus('ended');
    onCallEndedToast(`通话已结束，总时长 ${duration}，现场视频与轨迹已归档至 ${personnel.name} 履职档案。`);
    onClose();
  };

  const handleTakeSnapshot = () => {
    setSnapshotToast(true);
    setTimeout(() => setSnapshotToast(false), 2000);
  };

  // Dragging handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDraggingRef.current) return;
      setPosition({
        x: Math.max(10, Math.min(1420, moveEvent.clientX - dragStartRef.current.x)),
        y: Math.max(10, Math.min(700, moveEvent.clientY - dragStartRef.current.y)),
      });
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      className={`absolute z-50 rounded-xl bg-[#091530]/95 border border-cyan-400/80 shadow-[0_10px_35px_rgba(0,0,0,0.8)] backdrop-blur transition-all flex flex-col overflow-hidden select-none ${
        isMinimized ? 'w-80 h-12' : 'w-[480px] h-[360px]'
      }`}
    >
      {/* Draggable Title Header */}
      <div
        onMouseDown={handleMouseDown}
        className="h-10 px-3 bg-gradient-to-r from-[#0c2452] via-[#081938] to-[#0c2452] border-b border-cyan-500/40 flex items-center justify-between cursor-move shrink-0"
      >
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold text-xs text-white tracking-wide">
            {personnel.name} · 执法记录仪实时图传
          </span>
          <span className="font-mono text-[10px] text-cyan-300 bg-sky-950/70 px-1.5 py-0.5 rounded border border-cyan-800">
            {personnel.deviceId}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 rounded text-slate-300 hover:text-white hover:bg-slate-800/60"
            title={isMinimized ? '展开面板' : '最小化'}
          >
            {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handleHangup}
            className="p-1 rounded text-rose-400 hover:text-white hover:bg-rose-600/80 transition-colors"
            title="挂断通话"
          >
            <PhoneOff className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Body (if not minimized) */}
      {!isMinimized && (
        <div className="flex-1 flex flex-col bg-black relative overflow-hidden">
          {/* Simulated Video Stream Screen */}
          <div className="relative flex-1 w-full h-full flex items-center justify-center overflow-hidden">
            {callStatus === 'calling' ? (
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="w-16 h-16 rounded-full border-2 border-cyan-400/80 border-t-transparent animate-spin flex items-center justify-center">
                  <Radio className="w-6 h-6 text-cyan-400 animate-pulse" />
                </div>
                <span className="text-xs text-cyan-300 font-medium">
                  正在呼叫现场巡查员 {personnel.name} 设备...
                </span>
                <span className="text-[10px] text-slate-400">正在建立专用加密视音频隧道</span>
              </div>
            ) : isVideoOn ? (
              <div className="relative w-full h-full">
                {/* Field Camera Feed */}
                <img
                  src={ASSET_IMAGES.droneFarmland}
                  alt="现场巡查视频流"
                  className="w-full h-full object-cover filter brightness-95"
                />

                {/* HUD Overlay Scanlines & Telemetry */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40 pointer-events-none" />

                {/* Top HUD Telemetry */}
                <div className="absolute top-2 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-cyan-300">
                  <div className="flex items-center gap-2 bg-black/60 px-2 py-0.5 rounded backdrop-blur border border-sky-800/40">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    <span className="text-rose-400 font-bold">LIVE</span>
                    <span>{formatSeconds(callSeconds)}</span>
                  </div>

                  <div className="flex items-center gap-3 bg-black/60 px-2 py-0.5 rounded backdrop-blur border border-sky-800/40 text-[10px]">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <Wifi className="w-3 h-3" />
                      5G 120ms
                    </span>
                    <span className="flex items-center gap-1 text-slate-200">
                      <Battery className="w-3 h-3 text-emerald-400" />
                      86%
                    </span>
                  </div>
                </div>

                {/* Bottom HUD Location Bar */}
                <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-slate-200 bg-black/60 px-2 py-1 rounded backdrop-blur border border-sky-800/40">
                  <div className="flex items-center gap-1 text-cyan-300">
                    <ShieldCheck className="w-3 h-3" />
                    <span>GPS: {personnel.currentLatLong}</span>
                  </div>
                  <span>{personnel.district}</span>
                </div>

                {/* Snapshot Flash Overlay */}
                {snapshotToast && (
                  <div className="absolute inset-0 bg-white/40 flex items-center justify-center animate-fade-in z-20">
                    <div className="px-3 py-1.5 rounded-lg bg-black/80 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 border border-emerald-500/60 shadow-lg">
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>现场画面已截取并归档</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2">
                <img
                  src={personnel.avatarUrl}
                  alt={personnel.name}
                  className="w-16 h-16 rounded-full border-2 border-cyan-400 object-cover"
                />
                <span className="text-xs text-slate-300">现场摄像头已关闭 (语音对讲模式)</span>
              </div>
            )}
          </div>

          {/* Controls Footer Toolbar */}
          <div className="h-12 px-3 bg-[#071329] border-t border-sky-900/60 flex items-center justify-between shrink-0">
            {/* Left Controls: Mic, Video */}
            <div className="flex items-center gap-2">
              {/* Mic Toggle */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-2 rounded-lg text-xs font-medium border transition-colors ${
                  isMuted
                    ? 'bg-slate-800 text-slate-400 border-slate-700'
                    : 'bg-emerald-950 text-emerald-300 border-emerald-600'
                }`}
                title={isMuted ? '点击开启麦克风' : '点击静音麦克风'}
              >
                {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* Video Toggle */}
              <button
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={`p-2 rounded-lg text-xs font-medium border transition-colors ${
                  !isVideoOn
                    ? 'bg-slate-800 text-slate-400 border-slate-700'
                    : 'bg-sky-950 text-cyan-300 border-sky-600'
                }`}
                title={isVideoOn ? '关闭视频画面' : '恢复视频画面'}
              >
                {!isVideoOn ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
              </button>

              {/* Snapshot Button */}
              <button
                onClick={handleTakeSnapshot}
                className="p-2 rounded-lg text-xs font-medium bg-[#0b2149] hover:bg-cyan-950 text-cyan-300 border border-cyan-600/60 transition-colors"
                title="抓取当前画面保存到本地并记入巡查档案"
              >
                <Camera className="w-4 h-4" />
              </button>

              {/* Record Stream Toggle */}
              <button
                onClick={() => setIsRecordingStream(!isRecordingStream)}
                className={`p-2 rounded-lg text-xs font-medium border transition-colors ${
                  isRecordingStream
                    ? 'bg-rose-950 text-rose-300 border-rose-600 animate-pulse'
                    : 'bg-[#0b2149] text-slate-400 border-sky-800'
                }`}
                title={isRecordingStream ? '停止现场视频录制' : '录制现场回传视频'}
              >
                <Disc className="w-4 h-4" />
              </button>
            </div>

            {/* Middle: PTT Intercom Button */}
            <button
              onMouseDown={() => setIsPttPressed(true)}
              onMouseUp={() => setIsPttPressed(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-all select-none ${
                isPttPressed
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.8)] scale-95'
                  : 'bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border-cyan-500/50'
              }`}
              title="按住对讲讲话，松开收听"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>{isPttPressed ? '正在讲话...' : '按住对讲 (PTT)'}</span>
            </button>

            {/* Right: Hang up button */}
            <button
              onClick={handleHangup}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium flex items-center gap-1 shadow-lg transition-colors"
            >
              <PhoneOff className="w-3.5 h-3.5" />
              <span>挂断</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
