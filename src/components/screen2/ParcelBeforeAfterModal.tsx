import React, { useState } from 'react';
import { X, Sliders, CheckCircle2, ArrowRightLeft, Sparkles, Layers } from 'lucide-react';
import { ProjectParcel } from '../../types/projectDetail';
import { DETAIL_IMAGES } from '../../data/projectDetailData';

interface ParcelBeforeAfterModalProps {
  parcel: ProjectParcel | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ParcelBeforeAfterModal: React.FC<ParcelBeforeAfterModalProps> = ({
  parcel,
  isOpen,
  onClose,
}) => {
  const [sliderPosition, setSliderPosition] = useState(50); // 0 - 100%

  if (!isOpen || !parcel) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in select-none">
      <div className="w-[740px] h-[540px] rounded-xl bg-[#091530] border-t-4 border-t-cyan-500 border border-sky-800 shadow-[0_20px_60px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="h-12 px-5 bg-gradient-to-r from-[#0c234d] via-[#081836] to-[#0c234d] border-b border-sky-800/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white tracking-wide">
              图斑精细整治全景对比 · {parcel.code} ({parcel.name})
            </h2>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 text-xs">
          {/* Key Metrics Strip */}
          <div className="p-2.5 rounded-lg bg-[#071329] border border-sky-900/60 grid grid-cols-4 gap-2 text-center">
            <div>
              <span className="text-[10px] text-slate-400">图斑面积</span>
              <div className="font-mono font-bold text-cyan-300 text-sm">{parcel.area} 亩</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400">主要种植作物</span>
              <div className="font-medium text-slate-200 text-xs mt-0.5">{parcel.cropType}</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400">整治施工状态</span>
              <div className="font-bold text-emerald-400 text-xs mt-0.5">
                {parcel.status === 'completed' ? '已全面竣工' : '施工阶段推进中'}
              </div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400">综合完成率</span>
              <div className="font-mono font-bold text-cyan-300 text-sm">{parcel.progress}%</div>
            </div>
          </div>

          {/* Interactive Split Slider Reveal View (§7) */}
          <div className="relative w-full h-[230px] rounded-lg overflow-hidden border border-sky-800/80 shadow-inner group">
            {/* Background: After Consolidation Image */}
            <img
              src={DETAIL_IMAGES.afterConsolidation}
              alt="整治后现代高标准农田"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute top-2 right-3 z-10 px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-600 font-bold text-[11px] backdrop-blur">
              整治后：现代高产连片田
            </div>

            {/* Foreground: Before Consolidation Image (Clipped by slider) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src={DETAIL_IMAGES.beforeConsolidation}
                alt="整治前荒瘠碎块化田块"
                className="absolute inset-0 w-[706px] h-[230px] object-cover max-w-none"
              />
              <div className="absolute top-2 left-3 z-10 px-2 py-0.5 rounded bg-black/80 text-amber-300 border border-amber-600 font-bold text-[11px] backdrop-blur">
                整治前：高低不平碎小田
              </div>
            </div>

            {/* Draggable Divider Line & Handle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-cyan-400 cursor-ew-resize z-20 flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.8)]"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="w-6 h-6 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shadow-lg border-2 border-white">
                <ArrowRightLeft className="w-3 h-3" />
              </div>
            </div>

            {/* Native range slider for smooth touch/drag */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              className="absolute inset-0 opacity-0 cursor-ew-resize z-30 w-full h-full"
            />
          </div>

          <div className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>按住中缝左右拖拽对比高标准整治前后工程成效</span>
          </div>

          {/* Soil & Agricultural Improvement Indicators */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-2.5 rounded bg-black/40 border border-amber-900/50">
              <span className="font-bold text-amber-400 text-xs">整治前地力状况:</span>
              <p className="text-slate-300 mt-1 leading-relaxed text-[11px]">
                {parcel.soilQualityBefore}
              </p>
            </div>
            <div className="p-2.5 rounded bg-black/40 border border-emerald-900/50">
              <span className="font-bold text-emerald-400 text-xs">整治后提质达标:</span>
              <p className="text-slate-300 mt-1 leading-relaxed text-[11px]">
                {parcel.soilQualityAfter}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="h-12 px-5 bg-[#071329] border-t border-sky-900/60 flex items-center justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-sky-950 hover:bg-sky-900 text-slate-200 text-xs font-medium border border-sky-800 transition-colors"
          >
            关闭返回
          </button>
        </div>
      </div>
    </div>
  );
};
