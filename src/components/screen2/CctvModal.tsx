import React, { useState } from 'react';
import {
  X,
  Camera,
  Disc,
  Maximize2,
  Minimize2,
  Grid2X2,
  ZoomIn,
  ZoomOut,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Wifi,
  Sparkles,
  Check,
} from 'lucide-react';
import { SurveillanceCamera } from '../../types/projectDetail';
import { SURVEILLANCE_CAMERAS, DETAIL_IMAGES } from '../../data/projectDetailData';

interface CctvModalProps {
  camera: SurveillanceCamera | null;
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const CctvModal: React.FC<CctvModalProps> = ({
  camera,
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [isQuadView, setIsQuadView] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [snapshotToast, setSnapshotToast] = useState(false);
  const [ptzActionText, setPtzActionText] = useState('云台待命中');

  if (!isOpen || !camera) return null;

  const handlePtzMove = (direction: string) => {
    setPtzActionText(`云台动作: ${direction}`);
    setTimeout(() => setPtzActionText('云台就绪'), 1500);
  };

  const handleSnapshot = () => {
    setSnapshotToast(true);
    onShowToast(`监控截图已成功生成并存入工程影像台账档案！`);
    setTimeout(() => setSnapshotToast(false), 2000);
  };

  const handleToggleRecord = () => {
    setIsRecording(!isRecording);
    onShowToast(isRecording ? '已停止现场监控录像并归档。' : '正在录制监控视频流...');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in select-none">
      <div
        className={`rounded-xl bg-[#091530] border-2 border-cyan-500/70 shadow-[0_20px_60px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden text-slate-100 transition-all ${
          isQuadView ? 'w-[820px] h-[560px]' : 'w-[520px] h-[450px]'
        }`}
      >
        {/* Header */}
        <div className="h-11 px-4 bg-gradient-to-r from-[#0c2452] via-[#081836] to-[#0c2452] border-b border-sky-800/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-xs text-white truncate max-w-[280px]">
              {camera.name}
            </span>
            <span className="font-mono text-[10px] text-cyan-300 bg-sky-950 px-1 rounded border border-sky-800">
              {camera.ipAddress}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* 4-split view toggle (§8.1) */}
            <button
              onClick={() => setIsQuadView(!isQuadView)}
              className={`p-1 rounded text-xs flex items-center gap-1 border transition-colors ${
                isQuadView
                  ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
              title="切换4路同屏 (2x2)"
            >
              <Grid2X2 className="w-3.5 h-3.5" />
              <span>{isQuadView ? '单路' : '4路分屏'}</span>
            </button>

            <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Video Viewport */}
        <div className="relative flex-1 bg-black overflow-hidden flex items-center justify-center">
          {isQuadView ? (
            /* 4-Split Grid */
            <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-1 p-1 bg-slate-950">
              {SURVEILLANCE_CAMERAS.map((cam, idx) => (
                <div key={cam.id} className="relative w-full h-full bg-slate-900 overflow-hidden">
                  <img
                    src={cam.streamUrl}
                    alt={cam.name}
                    className="w-full h-full object-cover filter contrast-110"
                  />
                  <div className="absolute top-1 left-1 bg-black/60 px-1.5 py-0.5 rounded text-[9px] font-mono text-cyan-300">
                    CAM-{idx + 1} · {cam.location.slice(0, 10)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Single Camera Feed */
            <div className="relative w-full h-full">
              <img
                src={camera.streamUrl}
                alt={camera.name}
                className="w-full h-full object-cover filter contrast-105"
              />

              {/* HUD Telemetry Overlay */}
              <div className="absolute top-2 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-cyan-300 pointer-events-none">
                <div className="flex items-center gap-2 bg-black/60 px-2 py-0.5 rounded backdrop-blur">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  <span className="text-rose-400 font-bold">1080P HD</span>
                  <span>{camera.bitrate}</span>
                  <span>{camera.fps} FPS</span>
                </div>
                <div className="flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded text-[10px] text-emerald-400">
                  <Wifi className="w-3 h-3" />
                  <span>5G低延时 45ms</span>
                </div>
              </div>

              {/* Recording indicator */}
              {isRecording && (
                <div className="absolute top-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded bg-rose-600 text-white font-mono font-bold text-[10px] animate-pulse">
                  ● 正在录像中 REC
                </div>
              )}

              {/* Snapshot confirmation overlay */}
              {snapshotToast && (
                <div className="absolute inset-0 bg-white/40 flex items-center justify-center animate-fade-in z-20">
                  <div className="px-3 py-1.5 rounded-lg bg-black/80 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 border border-emerald-500">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>现场高清快照已抓取并归档</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* PTZ Pan-Tilt-Zoom & Recording Controls Toolbar (§8.1) */}
        <div className="h-20 px-4 bg-[#071329] border-t border-sky-900/60 flex items-center justify-between shrink-0 text-xs">
          {/* PTZ 8-Direction Rocker Controller */}
          <div className="flex items-center gap-3">
            <div className="grid grid-cols-3 gap-1 w-20 h-16 bg-[#091530] p-1 rounded-lg border border-sky-800">
              <div />
              <button
                onClick={() => handlePtzMove('向上俯仰')}
                className="bg-slate-800 hover:bg-cyan-600 rounded flex items-center justify-center text-slate-200 hover:text-white"
                title="上仰"
              >
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
              <div />

              <button
                onClick={() => handlePtzMove('向左旋转')}
                className="bg-slate-800 hover:bg-cyan-600 rounded flex items-center justify-center text-slate-200 hover:text-white"
                title="左转"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <div className="bg-sky-950 flex items-center justify-center text-[9px] font-mono text-cyan-400">
                PTZ
              </div>
              <button
                onClick={() => handlePtzMove('向右旋转')}
                className="bg-slate-800 hover:bg-cyan-600 rounded flex items-center justify-center text-slate-200 hover:text-white"
                title="右转"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <div />
              <button
                onClick={() => handlePtzMove('向下俯仰')}
                className="bg-slate-800 hover:bg-cyan-600 rounded flex items-center justify-center text-slate-200 hover:text-white"
                title="下俯"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <div />
            </div>

            {/* Zoom In / Out */}
            <div className="flex flex-col gap-1">
              <button
                onClick={() => handlePtzMove('镜头变倍放大 (Zoom In)')}
                className="px-2 py-1 rounded bg-[#091530] hover:bg-cyan-900 border border-sky-800 text-cyan-300 flex items-center gap-1 text-[10px]"
              >
                <ZoomIn className="w-3 h-3" />
                <span>变倍+</span>
              </button>
              <button
                onClick={() => handlePtzMove('镜头变倍缩小 (Zoom Out)')}
                className="px-2 py-1 rounded bg-[#091530] hover:bg-cyan-900 border border-sky-800 text-cyan-300 flex items-center gap-1 text-[10px]"
              >
                <ZoomOut className="w-3 h-3" />
                <span>变倍-</span>
              </button>
            </div>

            <span className="text-[10px] text-slate-400 font-mono">{ptzActionText}</span>
          </div>

          {/* Right: Snapshot & Record buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSnapshot}
              className="px-3 py-1.5 rounded-lg bg-[#0b224c] hover:bg-cyan-900 text-cyan-300 border border-cyan-600 text-xs font-medium flex items-center gap-1.5 shadow"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>截屏抓拍</span>
            </button>

            <button
              onClick={handleToggleRecord}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 border transition-colors ${
                isRecording
                  ? 'bg-rose-950 text-rose-300 border-rose-600 animate-pulse'
                  : 'bg-[#0b224c] text-slate-300 border-sky-800 hover:bg-rose-950/70 hover:text-rose-300'
              }`}
            >
              <Disc className="w-3.5 h-3.5" />
              <span>{isRecording ? '停止录像' : '开始录像'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
