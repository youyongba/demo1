import React from 'react';
import { Download, RefreshCw, X, CheckCircle2, Film } from 'lucide-react';
import { RecordedVideoResult } from '../hooks/useScreenRecorder';

interface RecordReadyModalProps {
  result: RecordedVideoResult | null;
  isOpen: boolean;
  onClose: () => void;
  onRecordAgain: () => void;
}

export const RecordReadyModal: React.FC<RecordReadyModalProps> = ({
  result,
  isOpen,
  onClose,
  onRecordAgain,
}) => {
  if (!isOpen || !result) return null;

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = result.url;
    a.download = result.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-[520px] rounded-xl bg-[#091530] border-2 border-cyan-500/70 shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col text-slate-100">
        {/* Header */}
        <div className="h-12 px-5 bg-gradient-to-r from-[#0c2452] via-[#081836] to-[#0c2452] border-b border-sky-800/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
            <h3 className="font-bold text-sm text-white">大屏录屏已成功生成并保存</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Preview & Details */}
        <div className="p-5 flex flex-col gap-4 text-xs">
          {/* Video Preview */}
          <div className="w-full h-48 bg-black rounded-lg overflow-hidden border border-sky-900 flex items-center justify-center">
            <video
              src={result.url}
              controls
              className="w-full h-full object-contain"
            />
          </div>

          {/* Stats Bar */}
          <div className="p-3 rounded-lg bg-[#071329] border border-sky-900/60 grid grid-cols-3 gap-2 text-center">
            <div>
              <span className="text-[11px] text-slate-400">录屏时长</span>
              <div className="font-mono text-cyan-300 font-bold text-sm mt-0.5">
                {formatSeconds(result.durationSeconds)}
              </div>
            </div>
            <div>
              <span className="text-[11px] text-slate-400">文件大小</span>
              <div className="font-mono text-emerald-400 font-bold text-sm mt-0.5">
                {result.fileSizeMb} MB
              </div>
            </div>
            <div>
              <span className="text-[11px] text-slate-400">视频封装格式</span>
              <div className="font-mono text-slate-200 font-bold text-sm mt-0.5">WebM / H.264</div>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            提示：录屏已在当前会话内存就绪。您可以立即下载为视频文件存档，或者开启下一段巡查录制。
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleDownload}
              className="flex-1 py-2.5 px-4 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all"
            >
              <Download className="w-4 h-4" />
              <span>立即下载录屏文件</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onRecordAgain();
              }}
              className="py-2.5 px-4 rounded-lg bg-sky-950 hover:bg-sky-900 text-slate-200 border border-sky-800 font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>重新录制</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
