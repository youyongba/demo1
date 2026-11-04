import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  User,
  HardHat,
  Phone,
  Video,
  Camera,
  Maximize2,
  FileCheck,
  PhoneOff,
  Mic,
  MicOff,
  Eye,
  Download,
} from 'lucide-react';
import {
  Screen3Inspection,
  BlockGisFeature,
  ProcessStep,
  ManagementPersonnel,
  ConstructionWorker,
} from '../../types/screen3Types';
import { DETAIL_IMAGES } from '../../data/projectDetailData';

// 1. 质量巡查详情弹窗 (60% 宽，§5.4)
export const QualityInspectionDetailModal: React.FC<{
  isOpen: boolean;
  record: Screen3Inspection | null;
  feature: BlockGisFeature | null;
  onClose: () => void;
}> = ({ isOpen, record, feature, onClose }) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  if (!isOpen || !record || !feature) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm animate-fade-in select-none">
      <div className="w-[820px] max-h-[640px] rounded-xl bg-[#032414] border-2 border-[#00A565] shadow-[0_20px_60px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="h-12 px-5 bg-gradient-to-r from-[#05321C] via-[#021d10] to-[#05321C] border-b border-[#00A565]/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h2 className="text-sm font-bold text-white tracking-wide">
              质量巡查实测实量评定详情 · {feature.RefName}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* Basic Info Strip */}
          <div className="p-3.5 rounded-lg bg-[#05321C]/90 border border-[#00A565]/50 grid grid-cols-3 gap-3 text-[11px]">
            <div>
              <span className="text-slate-400">巡查时间: </span>
              <span className="font-mono text-white">{record.createTime}</span>
            </div>
            <div>
              <span className="text-slate-400">巡查专家: </span>
              <span className="text-white font-medium">{record.inspectorName} ({record.inspectorRole})</span>
            </div>
            <div>
              <span className="text-slate-400">评定结论: </span>
              <span
                className={`font-bold px-2 py-0.5 rounded ${
                  record.isStandard
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : 'bg-rose-950 text-rose-400 border border-rose-800 animate-pulse'
                }`}
              >
                {record.statusStr}
              </span>
            </div>
            <div className="col-span-2">
              <span className="text-slate-400">核查部位: </span>
              <span className="text-slate-200">{feature.RefName} ({feature.WYBM})</span>
            </div>
            <div>
              <span className="text-slate-400">施工进度: </span>
              <span className="font-mono text-[#00FEFA] font-bold">{record.constructionProgress}</span>
            </div>
          </div>

          {/* Issue & Standard Evaluation Description */}
          <div className="p-3.5 rounded-lg bg-[#05321C]/60 border border-[#00A565]/40 flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-[#00FEFA] font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>评定分类: {record.evaluationCategory}</span>
            </div>
            <p className="text-slate-200 leading-relaxed text-[11px] mt-1">
              {record.evaluationDesc}
            </p>
          </div>

          {/* Photos Grid */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-white block">现场取证与施工复核照片:</span>
            <div className="grid grid-cols-3 gap-3">
              {(record.issuePhotos.length > 0 ? record.issuePhotos : record.constructionPhotos).map((photo, i) => (
                <div
                  key={i}
                  onClick={() => setPreviewImage(photo)}
                  className="relative rounded-lg overflow-hidden border border-[#00A565]/60 group cursor-pointer h-36 bg-black"
                >
                  <img
                    src={photo}
                    alt="现场照片"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-[10px] text-white gap-1">
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>点击大图预览</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="h-12 px-5 bg-[#05321C] border-t border-[#00A565]/60 flex items-center justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#074728] hover:bg-[#00A565] text-white text-xs font-medium border border-[#00A565]"
          >
            关闭返回
          </button>
        </div>
      </div>

      {/* Large Image Viewer Dialog */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-60 bg-black/95 flex items-center justify-center p-6 animate-fade-in"
        >
          <img src={previewImage} alt="高清大图" className="max-w-4xl max-h-[80vh] object-contain rounded" />
        </div>
      )}
    </div>
  );
};

// 2. 现场工序施工照片弹窗 (§5.2)
export const ProcessPhotosModal: React.FC<{
  isOpen: boolean;
  step: ProcessStep | null;
  onClose: () => void;
}> = ({ isOpen, step, onClose }) => {
  if (!isOpen || !step) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in select-none">
      <div className="w-[580px] rounded-xl bg-[#032414] border-2 border-[#00A565] shadow-2xl flex flex-col overflow-hidden text-slate-100">
        <div className="h-12 px-5 bg-[#05321C] border-b border-[#00A565] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-[#00FEFA]" />
            <h2 className="text-sm font-bold text-white truncate max-w-[420px]">
              工序已上传施工影像档案 · {step.name}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-3 text-xs flex-1 overflow-y-auto">
          <div className="p-2.5 rounded bg-[#05321C] border border-[#00A565]/40 flex items-center justify-between text-[11px]">
            <span>上传时间: {step.createTime}</span>
            <span>见证核验: {step.inspector || '现场监理'}</span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            {step.photos?.map((url, i) => (
              <img
                key={i}
                src={url}
                alt="工序照片"
                className="w-full h-44 object-cover rounded border border-[#00A565]/60"
              />
            ))}
          </div>
        </div>

        <div className="h-12 px-5 bg-[#05321C] border-t border-[#00A565]/60 flex items-center justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#074728] hover:bg-[#00A565] text-white text-xs"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};

// 3. 现场拍照漏项提醒浮层 (missingPzList, §3.3)
export const MissingPhotosAlertModal: React.FC<{
  isOpen: boolean;
  feature: BlockGisFeature | null;
  onClose: () => void;
}> = ({ isOpen, feature, onClose }) => {
  if (!isOpen || !feature) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in select-none">
      <div className="w-[520px] rounded-xl bg-[#032414] border-2 border-amber-500 shadow-2xl flex flex-col overflow-hidden text-slate-100">
        <div className="h-12 px-4 bg-amber-950/90 border-b border-amber-700 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-amber-300">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h2 className="text-sm font-bold">现场工序拍照漏项督办提醒</h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-3 text-xs">
          <div className="p-3 rounded bg-[#05321C] border border-amber-800/60">
            <span className="font-bold text-white text-xs block mb-1">
              受检工程要素：{feature.RefName} ({feature.WYBM})
            </span>
            <p className="text-amber-200 leading-relaxed text-[11px]">
              根据高标准农田建设隐蔽工程全过程数字化影像档案规范，以下重要隐蔽工序在系统内未匹配到现场定位水印照片：
            </p>
          </div>

          <div className="space-y-2">
            {feature.missingPhotos?.map((p, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded bg-amber-950/40 border border-amber-700/60 flex items-center justify-between text-xs"
              >
                <span className="text-slate-200">{p}</span>
                <span className="text-[10px] text-rose-400 font-bold bg-rose-950/80 px-1.5 py-0.5 rounded border border-rose-800">
                  未见证拍照
                </span>
              </div>
            ))}
          </div>

          <p className="text-[10px] text-slate-400 leading-relaxed">
            提示：已通过系统消息通知当标段责任监理员与施工技术负责人，须在24小时内现场补拍或出具隐蔽工程签证单。
          </p>
        </div>

        <div className="h-12 px-5 bg-[#05321C] border-t border-[#00A565]/60 flex items-center justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs"
          >
            知悉并督导催促
          </button>
        </div>
      </div>
    </div>
  );
};

// 4. TRTC 视频通话弹窗 (§3.7 & §6.4)
export const TrtcVideoCallModal: React.FC<{
  isOpen: boolean;
  targetName: string;
  targetRole: string;
  targetPhone: string;
  onClose: () => void;
}> = ({ isOpen, targetName, targetRole, targetPhone, onClose }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(14);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm animate-fade-in select-none">
      <div className="w-[520px] h-[400px] rounded-xl bg-[#032414] border-2 border-[#00FEFA] shadow-[0_20px_60px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden text-slate-100">
        <div className="h-10 px-4 bg-[#05321C] border-b border-[#00A565] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-xs text-white">
              TRTC 视频专线 · 连线中: {targetName} ({targetRole})
            </span>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video feed */}
        <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
          <img
            src={DETAIL_IMAGES.droneInspection}
            alt="现场视频"
            className="w-full h-full object-cover filter brightness-95"
          />
          <div className="absolute top-2 left-3 bg-black/60 px-2 py-0.5 rounded text-[10px] font-mono text-[#00FEFA]">
            ● TRTC 1080P · 延时 42ms · 丢包率 0%
          </div>
        </div>

        {/* Controls */}
        <div className="h-14 px-6 bg-[#05321C] border-t border-[#00A565] flex items-center justify-between shrink-0">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-2 rounded-lg text-xs ${
              isMuted ? 'bg-slate-800 text-slate-400' : 'bg-[#00A565] text-white'
            }`}
          >
            {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <span className="font-mono text-xs text-[#00FEFA] font-bold">
            通话中 00:{callDuration}
          </span>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5"
          >
            <PhoneOff className="w-4 h-4" />
            <span>挂断</span>
          </button>
        </div>
      </div>
    </div>
  );
};
