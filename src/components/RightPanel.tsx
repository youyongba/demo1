import React, { useState, useEffect, useRef } from 'react';
import {
  TrendingUp,
  AlertOctagon,
  CheckCircle2,
  Clock,
  UserCheck,
  Video,
  Route,
  AlertTriangle,
  ChevronRight,
  ShieldAlert,
  Flame,
  Award,
} from 'lucide-react';
import {
  ProjectBlock,
  InspectionRecord,
  InspectorPersonnel,
  AcceptanceItem,
} from '../types/dashboard';

interface RightPanelProps {
  blocks: ProjectBlock[];
  inspections: InspectionRecord[];
  personnelList: InspectorPersonnel[];
  acceptanceQueue: AcceptanceItem[];
  selectedBlockId: string | null;
  onSelectBlock: (block: ProjectBlock) => void;
  onOpenOverdueModal: (block: ProjectBlock) => void;
  onOpenInspectionModal: (record: InspectionRecord) => void;
  onOpenCoverageModal: () => void;
  onOpenAcceptanceListModal: () => void;
  onStartTrackPlayback: (trackId: string) => void;
  onStartBodycamCall: (person: InspectorPersonnel) => void;
  onLocatePersonnelGrid: (person: InspectorPersonnel) => void;
}

export const RightPanel: React.FC<RightPanelProps> = ({
  blocks,
  inspections,
  personnelList,
  acceptanceQueue,
  selectedBlockId,
  onSelectBlock,
  onOpenOverdueModal,
  onOpenInspectionModal,
  onOpenCoverageModal,
  onOpenAcceptanceListModal,
  onStartTrackPlayback,
  onStartBodycamCall,
  onLocatePersonnelGrid,
}) => {
  // Auto-scrolling ref for inspection records
  const inspectionScrollRef = useRef<HTMLDivElement>(null);
  const [isInspectionPaused, setIsInspectionPaused] = useState(false);

  useEffect(() => {
    if (isInspectionPaused) return;
    const interval = setInterval(() => {
      if (inspectionScrollRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = inspectionScrollRef.current;
        if (scrollTop + clientHeight >= scrollHeight - 5) {
          inspectionScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          inspectionScrollRef.current.scrollBy({ top: 48, behavior: 'smooth' });
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isInspectionPaused]);

  // Sort blocks by progress for 5.1
  const sortedBlocks = [...blocks].sort((a, b) => b.progress - a.progress);

  // Status badge styling helper
  const renderStatusBadge = (status: ProjectBlock['status'], block: ProjectBlock) => {
    if (status === 'completed') {
      return (
        <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-1.5 py-0.5 rounded">
          已完工
        </span>
      );
    }
    if (status === 'overdue') {
      return (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenOverdueModal(block);
          }}
          className="text-[10px] text-rose-400 bg-rose-950/70 border border-rose-800 hover:bg-rose-900/60 px-1.5 py-0.5 rounded font-medium flex items-center gap-0.5 transition-colors"
          title="点击查看逾期滞后成因及督办分析"
        >
          <AlertOctagon className="w-2.5 h-2.5" />
          <span>逾期超标</span>
        </button>
      );
    }
    return (
      <span className="text-[10px] text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-1.5 py-0.5 rounded">
        在建中
      </span>
    );
  };

  return (
    <aside className="w-[450px] h-full flex flex-col gap-2.5 p-3.5 shrink-0 z-10 overflow-hidden">
      {/* 5.1 建设进度 (项目进度排行) */}
      <section className="h-[215px] rounded-xl bg-[#091530]/85 border border-sky-800/40 p-3 shadow-lg backdrop-blur flex flex-col shrink-0">
        <div className="flex items-center justify-between border-b border-sky-900/50 pb-1.5 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-3.5 bg-cyan-400 rounded-full" />
            <h2 className="text-sm font-bold text-white tracking-wide">建设进度</h2>
            <span className="text-[10px] text-slate-400">重点项目工期跟踪</span>
          </div>
          <span className="text-[10px] text-slate-400">点击项目定位斑块</span>
        </div>

        {/* Progress List */}
        <div className="flex-1 overflow-y-auto space-y-1.5 pt-2 pr-1">
          {sortedBlocks.slice(0, 5).map((block, idx) => {
            const isSelected = selectedBlockId === block.id;
            return (
              <div
                key={block.id}
                onClick={() => onSelectBlock(block)}
                className={`p-1.5 rounded cursor-pointer transition-all flex flex-col gap-1 border ${
                  isSelected
                    ? 'bg-cyan-950/80 border-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.3)]'
                    : 'bg-[#08152e]/60 border-sky-950/60 hover:bg-[#0c2246]/70'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 truncate max-w-[260px]">
                    <span className="font-mono text-[10px] text-slate-400 w-3.5">{idx + 1}</span>
                    <span className="font-medium text-slate-200 truncate">{block.name}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono font-bold text-cyan-300 text-xs tabular-nums">
                      {block.progress}%
                    </span>
                    {renderStatusBadge(block.status, block)}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-slate-900/80 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      block.status === 'overdue'
                        ? 'bg-gradient-to-r from-rose-500 to-amber-500'
                        : block.status === 'completed'
                        ? 'bg-emerald-500'
                        : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                    }`}
                    style={{ width: `${block.progress}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5.2 质量巡查情况 */}
      <section className="h-[245px] rounded-xl bg-[#091530]/85 border border-sky-800/40 p-3 shadow-lg backdrop-blur flex flex-col shrink-0">
        <div className="flex items-center justify-between border-b border-sky-900/50 pb-1.5 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-3.5 bg-amber-400 rounded-full" />
            <h2 className="text-sm font-bold text-white tracking-wide">质量巡查情况</h2>
            <span className="text-[10px] text-slate-400">现场抽检质控</span>
          </div>
          <span className="text-[10px] text-slate-400">实时滚屏中</span>
        </div>

        {/* Top 4 Stats Cards */}
        <div className="grid grid-cols-4 gap-1.5 my-2 shrink-0">
          <div className="p-1.5 rounded bg-[#071329] border border-sky-950/60 flex flex-col items-center">
            <span className="text-[10px] text-slate-400">巡查总次</span>
            <span className="font-mono text-sm font-bold text-cyan-300 tabular-nums">1,420</span>
          </div>
          <div className="p-1.5 rounded bg-[#071329] border border-sky-950/60 flex flex-col items-center">
            <span className="text-[10px] text-slate-400">发现问题</span>
            <span className="font-mono text-sm font-bold text-amber-400 tabular-nums">186</span>
          </div>
          <div className="p-1.5 rounded bg-[#071329] border border-sky-950/60 flex flex-col items-center">
            <span className="text-[10px] text-slate-400">已整改</span>
            <span className="font-mono text-sm font-bold text-emerald-400 tabular-nums">172</span>
          </div>
          <div
            className="p-1.5 rounded bg-[#071329] border border-sky-950/60 flex flex-col items-center group relative cursor-help"
            title="整改率 92.5% (已闭环 172 / 总问题 186)"
          >
            <span className="text-[10px] text-slate-400">整改率</span>
            <span className="font-mono text-sm font-bold text-emerald-400 tabular-nums">92.5%</span>
          </div>
        </div>

        {/* Inspection Records List with Hover Pause */}
        <div
          ref={inspectionScrollRef}
          onMouseEnter={() => setIsInspectionPaused(true)}
          onMouseLeave={() => setIsInspectionPaused(false)}
          className="flex-1 overflow-y-auto space-y-1 pr-1"
        >
          {inspections.map((rec) => (
            <div
              key={rec.id}
              onClick={() => onOpenInspectionModal(rec)}
              className="p-1.5 rounded bg-[#08152e]/60 hover:bg-[#0c2246]/80 border border-sky-950/60 cursor-pointer flex items-center justify-between text-xs transition-colors group"
            >
              <div className="flex flex-col truncate max-w-[310px]">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="font-mono text-[10px] text-cyan-400 shrink-0">{rec.time}</span>
                  <span className="font-medium text-slate-200 truncate">{rec.issueType}</span>
                </div>
                <span className="text-[10px] text-slate-400 truncate mt-0.5">
                  {rec.projectName} · {rec.inspectorName}
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {rec.status === 'closed' ? (
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-1 py-0.5 rounded">
                    已闭环
                  </span>
                ) : rec.status === 'processing' ? (
                  <span className="text-[10px] text-sky-400 bg-sky-950/60 border border-sky-800/40 px-1 py-0.5 rounded">
                    整改中
                  </span>
                ) : (
                  <span className="text-[10px] text-amber-400 bg-amber-950/60 border border-amber-800/40 px-1 py-0.5 rounded animate-pulse">
                    待整改
                  </span>
                )}
                <ChevronRight className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5.3 履职情况 (网格员统计 + Top 5 榜单) */}
      <section className="h-[255px] rounded-xl bg-[#091530]/85 border border-sky-800/40 p-3 shadow-lg backdrop-blur flex flex-col shrink-0">
        <div className="flex items-center justify-between border-b border-sky-900/50 pb-1.5 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-3.5 bg-teal-400 rounded-full" />
            <h2 className="text-sm font-bold text-white tracking-wide">履职情况</h2>
            <span className="text-[10px] text-slate-400">田长制网格化巡护</span>
          </div>

          {/* Clickable Coverage Modal Trigger */}
          <button
            onClick={onOpenCoverageModal}
            className="flex items-center gap-1 text-[10px] text-teal-400 hover:text-teal-300 bg-teal-950/60 border border-teal-800/40 px-2 py-0.5 rounded transition-colors"
          >
            <span>覆盖率 98.2%</span>
            <ChevronRight className="w-2.5 h-2.5" />
          </button>
        </div>

        {/* Roles Distribution Strip */}
        <div className="grid grid-cols-3 gap-1.5 my-1.5 shrink-0 text-center text-xs">
          <div className="p-1 rounded bg-[#071329] border border-sky-950/60">
            <span className="text-[10px] text-slate-400">县级负责人</span>
            <div className="font-mono font-semibold text-slate-100 text-xs">25 人在岗</div>
          </div>
          <div className="p-1 rounded bg-[#071329] border border-sky-950/60">
            <span className="text-[10px] text-slate-400">乡镇农办</span>
            <div className="font-mono font-semibold text-slate-100 text-xs">142 人在岗</div>
          </div>
          <div className="p-1 rounded bg-[#071329] border border-sky-950/60">
            <span className="text-[10px] text-slate-400">网格巡查员</span>
            <div className="font-mono font-semibold text-cyan-300 text-xs">380 人在岗</div>
          </div>
        </div>

        {/* Personnel Duty Top 5 Leaderboard */}
        <div className="flex-1 overflow-y-auto space-y-1 pr-1">
          {personnelList.slice(0, 5).map((person, idx) => (
            <div
              key={person.id}
              onClick={() => onLocatePersonnelGrid(person)}
              className="p-1.5 rounded bg-[#08152e]/60 hover:bg-[#0c2246]/80 border border-sky-950/60 flex items-center justify-between text-xs transition-colors group cursor-pointer"
              title="点击高亮该人员责任网格"
            >
              <div className="flex items-center gap-2 truncate">
                <span className="font-mono text-[10px] text-amber-400 font-bold w-3">{idx + 1}</span>
                <span className="font-medium text-slate-100">{person.name}</span>
                <span className="text-[10px] text-slate-400 truncate max-w-[120px]">
                  {person.roleTitle}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="font-mono text-[11px] text-teal-300 tabular-nums">
                  {person.monthlyInspections} 次/月
                </span>

                {/* Trajectory Playback Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStartTrackPlayback('trk-01');
                  }}
                  className="p-1 rounded bg-sky-950/70 hover:bg-sky-800 text-cyan-400 border border-cyan-800/50 transition-colors"
                  title="回放该网格员巡查GPS轨迹"
                >
                  <Route className="w-3 h-3" />
                </button>

                {/* Bodycam Live Call Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStartBodycamCall(person);
                  }}
                  className={`p-1 rounded border transition-colors ${
                    person.deviceStatus === 'online'
                      ? 'bg-cyan-950/80 hover:bg-cyan-700 text-cyan-300 border-cyan-600 shadow-[0_0_6px_rgba(6,182,212,0.4)]'
                      : 'bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed'
                  }`}
                  disabled={person.deviceStatus !== 'online'}
                  title={
                    person.deviceStatus === 'online'
                      ? '发起执法记录仪实时视频通话'
                      : '设备离线，最后在线18分钟前'
                  }
                >
                  <Video className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5.4 工程验收 */}
      <section className="flex-1 rounded-xl bg-[#091530]/85 border border-sky-800/40 p-3 shadow-lg backdrop-blur flex flex-col min-h-0">
        <div className="flex items-center justify-between border-b border-sky-900/50 pb-1.5 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-3.5 bg-emerald-400 rounded-full" />
            <h2 className="text-sm font-bold text-white tracking-wide">工程验收</h2>
            <span className="text-[10px] text-slate-400">竣工核验与终验闭环</span>
          </div>

          <button
            onClick={onOpenAcceptanceListModal}
            className="flex items-center gap-1 text-[10px] text-emerald-400 hover:text-emerald-300 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded transition-colors"
          >
            <span>验收清单</span>
            <ChevronRight className="w-2.5 h-2.5" />
          </button>
        </div>

        {/* Top 4 Acceptance Stats */}
        <div className="grid grid-cols-4 gap-1.5 my-1.5 shrink-0 text-center">
          <div
            onClick={onOpenAcceptanceListModal}
            className="p-1 rounded bg-[#071329] border border-sky-950/60 cursor-pointer hover:border-amber-500/50 transition-colors"
          >
            <span className="text-[10px] text-slate-400">待验收</span>
            <div className="font-mono font-bold text-amber-400 text-sm tabular-nums">14 个</div>
          </div>
          <div className="p-1 rounded bg-[#071329] border border-sky-950/60">
            <span className="text-[10px] text-slate-400">验收中</span>
            <div className="font-mono font-bold text-sky-400 text-sm tabular-nums">8 个</div>
          </div>
          <div className="p-1 rounded bg-[#071329] border border-sky-950/60">
            <span className="text-[10px] text-slate-400">已验收</span>
            <div className="font-mono font-bold text-emerald-400 text-sm tabular-nums">134 个</div>
          </div>
          <div className="p-1 rounded bg-[#071329] border border-sky-950/60">
            <span className="text-[10px] text-slate-400">通过率</span>
            <div className="font-mono font-bold text-emerald-400 text-sm tabular-nums">98.5%</div>
          </div>
        </div>

        {/* Pending Acceptance Projects Queue */}
        <div className="flex-1 overflow-y-auto space-y-1 pr-1">
          {acceptanceQueue.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                const blk = blocks.find((b) => b.id === item.projectId);
                if (blk) onSelectBlock(blk);
              }}
              className="p-1.5 rounded bg-[#08152e]/60 hover:bg-[#0c2246]/80 border border-sky-950/60 flex items-center justify-between text-xs transition-colors cursor-pointer"
            >
              <div className="flex flex-col truncate max-w-[280px]">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="font-medium text-slate-200 truncate">{item.projectName}</span>
                </div>
                <span className="text-[10px] text-slate-400 truncate mt-0.5">
                  完工日期: {item.finishDate} · {item.contractor}
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {item.overdueDays > 0 ? (
                  <span className="text-[10px] font-mono text-rose-400 bg-rose-950/80 border border-rose-800 px-1.5 py-0.5 rounded font-bold">
                    超期 {item.overdueDays}天
                  </span>
                ) : item.status === 'inspecting' ? (
                  <span className="text-[10px] text-sky-400 bg-sky-950/60 border border-sky-800/40 px-1.5 py-0.5 rounded">
                    现场核验中
                  </span>
                ) : (
                  <span className="text-[10px] text-amber-400 bg-amber-950/60 border border-amber-800/40 px-1.5 py-0.5 rounded">
                    待排期
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
};
