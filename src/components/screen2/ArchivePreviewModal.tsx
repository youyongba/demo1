import React, { useState } from 'react';
import {
  X,
  Download,
  FileText,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  FileCheck,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { ProjectArchiveItem } from '../../types/projectDetail';
import { DETAIL_IMAGES } from '../../data/projectDetailData';

interface ArchivePreviewModalProps {
  archive: ProjectArchiveItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ArchivePreviewModal: React.FC<ArchivePreviewModalProps> = ({
  archive,
  isOpen,
  onClose,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 8;
  const [zoomLevel, setZoomLevel] = useState(100);

  if (!isOpen || !archive) return null;

  const handleDownload = () => {
    alert(`已开始下载工程档案文件: ${archive.title}.${archive.fileType}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in select-none">
      <div className="w-[820px] h-[580px] rounded-xl bg-[#091530] border-t-4 border-t-emerald-500 border border-sky-800 shadow-[0_20px_60px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="h-12 px-5 bg-gradient-to-r from-[#0c2452] via-[#081836] to-[#0c2452] border-b border-sky-800/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 truncate max-w-[620px]">
            <FileCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <h2 className="text-sm font-bold text-white tracking-wide truncate">
              工程档案在线审阅 · {archive.title}
            </h2>
            <span className="font-mono text-[10px] text-cyan-300 bg-sky-950 px-1.5 py-0.5 rounded border border-sky-800">
              .{archive.fileType.toUpperCase()}
            </span>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="h-10 px-5 bg-[#071329] border-b border-sky-900/60 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2 text-slate-300">
            <span>责任人: {archive.responsiblePerson}</span>
            <span className="text-slate-600">|</span>
            <span>归档类别: {archive.category}</span>
            {archive.fileSize && (
              <>
                <span className="text-slate-600">|</span>
                <span className="font-mono">{archive.fileSize}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="p-1 rounded text-slate-300 hover:text-white disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-cyan-400">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="p-1 rounded text-slate-300 hover:text-white disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <span className="text-slate-600">|</span>

            <button
              onClick={() => setZoomLevel((z) => Math.max(50, z - 10))}
              className="p-1 text-slate-300 hover:text-white"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-slate-300 text-[11px]">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(180, z + 10))}
              className="p-1 text-slate-300 hover:text-white"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Document Viewer Body */}
        <div className="flex-1 overflow-auto bg-slate-950 p-4 flex items-center justify-center">
          {archive.isArchived ? (
            <div
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'center center' }}
              className="w-[640px] h-[360px] bg-[#0c1836] border border-cyan-500/40 rounded-lg p-6 shadow-2xl flex flex-col justify-between transition-transform"
            >
              <div className="border-b border-sky-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white tracking-wide">{archive.title}</h3>
                  <span className="text-[10px] text-cyan-400 font-mono">
                    四平市农建档案字第 2024-SP0302-0{currentPage} 号
                  </span>
                </div>
                <div className="w-12 h-12 rounded border border-cyan-500/50 flex items-center justify-center text-cyan-400 text-[9px] font-mono text-center">
                  档案印鉴<br />已核验
                </div>
              </div>

              {/* Sample Blueprint drawing lines or document text */}
              <div className="py-4 space-y-2 text-[11px] text-slate-300 leading-relaxed font-mono">
                <p>一、工程建设范围与黑土地保护规划坐标体系核准严格符合吉农发建〔2024〕88号立项批复。</p>
                <p>二、田间U型排灌抗冻防渗渠标高水力坡降控制在 1/1500，出水流量满足万亩示范区设计峰值要求。</p>
                <p>三、隐蔽工程耐寒暗管与地下水肥配网经打压测试保压0.6MPa历经48小时无压降，见证监理签字归档。</p>
                <div className="mt-2 w-full h-16 border border-sky-900/60 rounded bg-black/40 flex items-center justify-center text-slate-500 text-xs">
                  [工程总平布置与黑土地水网矢量蓝图预览区 · 第 {currentPage} 页]
                </div>
              </div>

              <div className="border-t border-sky-800 pt-2 flex items-center justify-between text-[10px] text-slate-400">
                <span>编制单位: 吉林省水利水电勘测设计研究院</span>
                <span>归档日期: {archive.archiveDate}</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 p-8 text-center">
              <AlertCircle className="w-10 h-10 text-amber-400" />
              <h3 className="text-sm font-bold text-white">当前档案尚未归档 (待补录)</h3>
              <p className="text-xs text-slate-400 max-w-md">{archive.missingReason}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="h-12 px-5 bg-[#071329] border-t border-sky-900/60 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-400">
            符合国家高标准农田建设档案立卷归档规范 (DA/T 28-2023)
          </span>

          <div className="flex items-center gap-2">
            {archive.isArchived && (
              <button
                onClick={handleDownload}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow"
              >
                <Download className="w-3.5 h-3.5" />
                <span>下载原件 (PDF/DWG)</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-sky-950 hover:bg-sky-900 text-slate-200 text-xs font-medium border border-sky-800"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
