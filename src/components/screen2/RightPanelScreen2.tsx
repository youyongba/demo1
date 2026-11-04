import React, { useState } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  FileSpreadsheet,
  CheckCircle2,
  FolderOpen,
  Filter,
  ChevronRight,
  ShieldAlert,
  Calendar,
  FileCheck,
  AlertCircle,
  Eye,
  PhoneCall,
  Sparkles,
} from 'lucide-react';
import {
  SUB_ENGINEERING_ITEMS,
  QUALITY_ISSUES,
  PROJECT_ARCHIVES,
} from '../../data/projectDetailData';
import {
  SubEngineeringItem,
  QualityIssueItem,
  ProjectArchiveItem,
} from '../../types/projectDetail';

interface RightPanelScreen2Props {
  highlightedSubEngineering: string | null;
  onToggleSubEngineeringHighlight: (type: string) => void;
  onOpenSubEngineeringListModal: () => void;
  onOpenIssueDetailModal: (issue: QualityIssueItem) => void;
  onOpenFunnelStageModal: (stageName: string, count: number) => void;
  onOpenArchivePreviewModal: (archive: ProjectArchiveItem) => void;
  onOpenAcceptanceWorkflowModal: () => void;
}

export const RightPanelScreen2: React.FC<RightPanelScreen2Props> = ({
  highlightedSubEngineering,
  onToggleSubEngineeringHighlight,
  onOpenSubEngineeringListModal,
  onOpenIssueDetailModal,
  onOpenFunnelStageModal,
  onOpenArchivePreviewModal,
  onOpenAcceptanceWorkflowModal,
}) => {
  // Archive counts
  const archivedCount = PROJECT_ARCHIVES.filter((a) => a.isArchived).length;
  const totalArchives = PROJECT_ARCHIVES.length;
  const archiveRate = Math.round((archivedCount / totalArchives) * 100);

  return (
    <aside className="w-[450px] h-full flex flex-col gap-2.5 p-3.5 shrink-0 z-10 overflow-hidden">
      {/* 6.1 分项工程进度 */}
      <section className="h-[215px] rounded-xl bg-[#091530]/85 border border-sky-800/40 p-3 shadow-lg backdrop-blur flex flex-col shrink-0">
        <div className="flex items-center justify-between border-b border-sky-900/50 pb-1.5 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-3.5 bg-cyan-400 rounded-full" />
            <h2 className="text-sm font-bold text-white tracking-wide">分项工程进度</h2>
            <span className="text-[10px] text-slate-400">专业工种分步实施</span>
          </div>

          <button
            onClick={onOpenSubEngineeringListModal}
            className="flex items-center gap-1 text-[10px] text-cyan-400 hover:text-cyan-300 bg-cyan-950/70 border border-cyan-800/50 px-2 py-0.5 rounded transition-colors"
          >
            <FileSpreadsheet className="w-3 h-3" />
            <span>单元清单</span>
            <ChevronRight className="w-2.5 h-2.5" />
          </button>
        </div>

        {/* 4 Sub-engineering Progress Bars (§6.1) */}
        <div className="flex-1 overflow-y-auto space-y-2 pt-2 pr-1">
          {SUB_ENGINEERING_ITEMS.map((item) => {
            const isHighlighted = highlightedSubEngineering === item.type;
            const isLagging = item.status === 'lagging';

            return (
              <div
                key={item.id}
                onClick={() => onToggleSubEngineeringHighlight(item.type)}
                className={`p-2 rounded cursor-pointer transition-all border flex flex-col gap-1 ${
                  isHighlighted
                    ? 'bg-cyan-950/90 border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                    : 'bg-[#08152e]/60 border-sky-950/60 hover:bg-[#0c2246]/70'
                }`}
                title="点击在地图上仅高亮本分项图层（再次点击取消）"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-slate-100">{item.name}</span>
                    {isLagging && (
                      <span
                        className="text-[9px] text-amber-400 bg-amber-950/80 border border-amber-800 px-1 rounded flex items-center gap-0.5"
                        title={item.lagReason}
                      >
                        <AlertTriangle className="w-2.5 h-2.5" />
                        <span>时序预警</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-slate-400">
                      {item.completedAmount} / {item.plannedAmount} {item.unit}
                    </span>
                    <span className="font-mono font-bold text-cyan-300 text-xs tabular-nums">
                      {item.progress}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      item.type === 'leveling'
                        ? 'bg-amber-400'
                        : item.type === 'irrigation'
                        ? 'bg-sky-400'
                        : item.type === 'roads'
                        ? 'bg-amber-500'
                        : 'bg-emerald-400'
                    }`}
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6.2 质量问题闭环 */}
      <section className="h-[255px] rounded-xl bg-[#091530]/85 border border-sky-800/40 p-3 shadow-lg backdrop-blur flex flex-col shrink-0">
        <div className="flex items-center justify-between border-b border-sky-900/50 pb-1.5 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-3.5 bg-rose-400 rounded-full" />
            <h2 className="text-sm font-bold text-white tracking-wide">质量问题闭环</h2>
            <span className="text-[10px] text-slate-400">巡查督办处置全过程</span>
          </div>

          <span className="text-[10px] text-slate-400">点击列表项定位及处置</span>
        </div>

        {/* Funnel Stage Strip (发现 23 → 已转办 21 → 整改 18 → 复核 16) */}
        <div className="grid grid-cols-4 gap-1 my-2 shrink-0 text-center">
          {[
            { label: '发现问题', count: 23, color: 'text-rose-400', bg: 'bg-rose-950/50', border: 'border-rose-900/60' },
            { label: '已转办', count: 21, color: 'text-amber-400', bg: 'bg-amber-950/50', border: 'border-amber-900/60' },
            { label: '整改完成', count: 18, color: 'text-sky-400', bg: 'bg-sky-950/50', border: 'border-sky-900/60' },
            { label: '复核通过', count: 16, color: 'text-emerald-400', bg: 'bg-emerald-950/50', border: 'border-emerald-900/60' },
          ].map((fn, idx) => (
            <div
              key={idx}
              onClick={() => onOpenFunnelStageModal(fn.label, fn.count)}
              className={`p-1 rounded ${fn.bg} border ${fn.border} cursor-pointer hover:brightness-125 transition-all`}
              title={`点击查看${fn.label}清单`}
            >
              <span className="text-[9px] text-slate-400">{fn.label}</span>
              <div className={`font-mono font-bold text-xs mt-0.5 ${fn.color}`}>
                {fn.count}
              </div>
            </div>
          ))}
        </div>

        {/* Issues List (§6.2) */}
        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
          {QUALITY_ISSUES.map((issue) => (
            <div
              key={issue.id}
              onClick={() => onOpenIssueDetailModal(issue)}
              className="p-2 rounded bg-[#08152e]/60 hover:bg-[#0c2246]/80 border border-sky-950/60 cursor-pointer flex items-center justify-between text-xs transition-colors group"
            >
              <div className="flex flex-col truncate max-w-[300px]">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="font-mono text-[10px] text-cyan-400 shrink-0">{issue.time}</span>
                  <span className="font-medium text-slate-100 truncate">{issue.issueTitle}</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                  {issue.location} · 责任人: {issue.responsiblePerson}
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                    issue.status === 'closed'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : issue.status === 'to_review'
                      ? 'bg-sky-950 text-sky-400 border border-sky-800'
                      : issue.status === 'rectifying'
                      ? 'bg-amber-950 text-amber-400 border border-amber-800'
                      : 'bg-rose-950 text-rose-400 border border-rose-800 animate-pulse'
                  }`}
                >
                  {issue.status === 'closed'
                    ? '已闭环'
                    : issue.status === 'to_review'
                    ? '待复核'
                    : issue.status === 'rectifying'
                    ? '整改中'
                    : '待转办'}
                </span>
                <ChevronRight className="w-3 h-3 text-slate-500 group-hover:text-cyan-400" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6.3 验收与档案 */}
      <section className="flex-1 rounded-xl bg-[#091530]/85 border border-sky-800/40 p-3 shadow-lg backdrop-blur flex flex-col min-h-0">
        <div className="flex items-center justify-between border-b border-sky-900/50 pb-1.5 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-3.5 bg-emerald-400 rounded-full" />
            <h2 className="text-sm font-bold text-white tracking-wide">验收与档案</h2>
            <span className="text-[10px] text-slate-400">工程档案归档率</span>
          </div>

          {/* Acceptance Stage Trigger */}
          <button
            onClick={onOpenAcceptanceWorkflowModal}
            className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/70 border border-emerald-800/50 px-2 py-0.5 rounded hover:bg-emerald-900 transition-colors"
          >
            <span>县级初验筹备中</span>
            <ChevronRight className="w-2.5 h-2.5" />
          </button>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-3 gap-1.5 my-1.5 shrink-0 text-center">
          <div className="p-1 rounded bg-[#071329] border border-sky-950/60">
            <span className="text-[10px] text-slate-400">归档率</span>
            <div className="font-mono font-bold text-emerald-300 text-xs mt-0.5">
              {archiveRate}%
            </div>
          </div>
          <div className="p-1 rounded bg-[#071329] border border-sky-950/60">
            <span className="text-[10px] text-slate-400">已归档 / 缺失</span>
            <div className="font-mono font-bold text-slate-100 text-xs mt-0.5">
              {archivedCount} / {totalArchives - archivedCount}
            </div>
          </div>
          <div className="p-1 rounded bg-[#071329] border border-sky-950/60">
            <span className="text-[10px] text-slate-400">自评质量分</span>
            <div className="font-mono font-bold text-cyan-300 text-xs mt-0.5">94.5 分</div>
          </div>
        </div>

        {/* Archives Checklist List (§6.3) */}
        <div className="flex-1 overflow-y-auto space-y-1 pr-1">
          {PROJECT_ARCHIVES.map((arc) => (
            <div
              key={arc.id}
              onClick={() => onOpenArchivePreviewModal(arc)}
              className="p-1.5 rounded bg-[#08152e]/60 hover:bg-[#0c2246]/80 border border-sky-950/60 cursor-pointer flex items-center justify-between text-xs transition-colors group"
            >
              <div className="flex items-center gap-2 truncate max-w-[280px]">
                {arc.isArchived ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                )}
                <span className="truncate text-slate-200 group-hover:text-white font-medium">
                  {arc.title}
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                    arc.isArchived
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}
                >
                  {arc.isArchived ? '已归档' : '缺失待补'}
                </span>
                <ChevronRight className="w-3 h-3 text-slate-500 group-hover:text-cyan-400" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
};
