import React, { useState, useEffect, useRef } from 'react';
import {
  TrendingUp,
  MapPin,
  FolderKanban,
  Coins,
  AlertTriangle,
  ChevronRight,
  Layers,
  Sparkles,
} from 'lucide-react';
import { FarmlandOverview, CountyTask } from '../types/dashboard';

interface LeftPanelProps {
  overview: FarmlandOverview;
  countyTasks: CountyTask[];
  onOpenProjectList: () => void;
  onSelectCounty: (countyName: string) => void;
  selectedCountyName?: string | null;
  isLoading?: boolean;
}

// Animated Counter Hook
function useCountUp(endVal: number, durationMs: number = 1200) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let animId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / durationMs, 1);
      // Ease-out cubic
      const easeVal = 1 - Math.pow(1 - progress, 3);
      setCount(Number((endVal * easeVal).toFixed(1)));

      if (progress < 1) {
        animId = requestAnimationFrame(animate);
      } else {
        setCount(endVal);
      }
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [endVal, durationMs]);

  return count;
}

export const LeftPanel: React.FC<LeftPanelProps> = ({
  overview,
  countyTasks,
  onOpenProjectList,
  onSelectCounty,
  selectedCountyName,
  isLoading,
}) => {
  const completedCount = useCountUp(overview.completedArea);
  const newCount = useCountUp(overview.newAreaThisYear);
  const projectCount = useCountUp(overview.projectCount);
  const investmentCount = useCountUp(overview.totalInvestment);

  // Auto-scrolling list with pause on hover
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      if (tableContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = tableContainerRef.current;
        if (scrollTop + clientHeight >= scrollHeight - 5) {
          tableContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          tableContainerRef.current.scrollBy({ top: 52, behavior: 'smooth' });
        }
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <aside className="w-[450px] h-full flex flex-col gap-3.5 p-3.5 shrink-0 z-10 overflow-hidden">
      {/* 3.1 农田大数据 (指标卡) */}
      <section className="relative rounded-xl bg-[#091530]/85 border border-sky-800/40 p-4 shadow-lg backdrop-blur flex flex-col gap-3">
        {/* Module Header */}
        <div className="flex items-center justify-between border-b border-sky-900/50 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 bg-cyan-400 rounded-full" />
            <h2 className="text-base font-bold text-white tracking-wide">农田大数据</h2>
            <span className="text-[11px] text-slate-400">全域概况核算</span>
          </div>
          <button
            onClick={onOpenProjectList}
            className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-medium px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40 hover:border-cyan-500/60 transition-colors"
          >
            <span>项目总明细</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Top 2 Primary Big Cards */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Card 1: 已建成高标准农田 */}
          <div className="relative p-3 rounded-lg bg-gradient-to-br from-[#0c234b]/80 to-[#071736]/90 border border-cyan-500/30 flex flex-col justify-between overflow-hidden group">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-medium">已建成高标准农田</span>
              <Layers className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-bold font-mono tracking-tight text-emerald-400 tabular-nums">
                {isLoading ? '--' : completedCount.toLocaleString()}
              </span>
              <span className="text-xs text-slate-400">万亩</span>
            </div>
            <div className="mt-1 text-[10px] text-slate-400 flex items-center gap-1">
              <span>覆盖全省高产田块</span>
            </div>
          </div>

          {/* Card 2: 今年新增 */}
          <div className="relative p-3 rounded-lg bg-gradient-to-br from-[#0c234b]/80 to-[#071736]/90 border border-sky-500/30 flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-medium">今年新增建成</span>
              <TrendingUp className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-bold font-mono tracking-tight text-cyan-300 tabular-nums">
                {isLoading ? '--' : newCount}
              </span>
              <span className="text-xs text-slate-400">万亩</span>
            </div>
            <div className="mt-1 text-[10px] text-cyan-400/90 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>年度提速攻坚任务</span>
            </div>
          </div>
        </div>

        {/* Bottom 3 Secondary Metrics */}
        <div className="grid grid-cols-3 gap-2">
          {/* Metric 1: 涉及县区数 */}
          <div className="p-2.5 rounded-lg bg-[#08152e]/90 border border-sky-900/50 flex flex-col">
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <MapPin className="w-3 h-3 text-sky-400" />
              <span>涉及县区</span>
            </div>
            <div className="mt-1 flex items-baseline gap-0.5">
              <span className="text-lg font-bold font-mono text-slate-100 tabular-nums">
                {overview.countyCount}
              </span>
              <span className="text-[10px] text-slate-400">个</span>
            </div>
          </div>

          {/* Metric 2: 项目总数 (Clickable for drill-down!) */}
          <div
            onClick={onOpenProjectList}
            className="p-2.5 rounded-lg bg-[#0c2246]/90 border border-cyan-500/40 hover:border-cyan-400 cursor-pointer flex flex-col transition-all group shadow-sm hover:shadow-[0_0_10px_rgba(6,182,212,0.2)]"
            title="点击下钻到项目全量清单并高亮地图斑块"
          >
            <div className="flex items-center justify-between text-[11px] text-cyan-300 group-hover:text-cyan-200">
              <div className="flex items-center gap-1">
                <FolderKanban className="w-3 h-3 text-cyan-400" />
                <span>项目总数</span>
              </div>
              <ChevronRight className="w-3 h-3 text-cyan-400/70 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div className="mt-1 flex items-baseline gap-0.5">
              <span className="text-lg font-bold font-mono text-cyan-300 tabular-nums">
                {isLoading ? '--' : Math.round(projectCount)}
              </span>
              <span className="text-[10px] text-slate-400">个</span>
            </div>
          </div>

          {/* Metric 3: 总投资 */}
          <div className="p-2.5 rounded-lg bg-[#08152e]/90 border border-sky-900/50 flex flex-col">
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <Coins className="w-3 h-3 text-amber-400" />
              <span>总投资额</span>
            </div>
            <div className="mt-1 flex items-baseline gap-0.5">
              <span className="text-lg font-bold font-mono text-amber-300 tabular-nums">
                {isLoading ? '--' : investmentCount.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-400">万</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3.2 年度任务 (完成率环形图 + 任务清单) */}
      <section className="flex-1 rounded-xl bg-[#091530]/85 border border-sky-800/40 p-4 shadow-lg backdrop-blur flex flex-col min-h-0">
        {/* Module Header */}
        <div className="flex items-center justify-between border-b border-sky-900/50 pb-2.5 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 bg-blue-400 rounded-full" />
            <h2 className="text-base font-bold text-white tracking-wide">年度任务</h2>
            <span className="text-[11px] text-slate-400">各县区分解进度</span>
          </div>
          <div className="text-[11px] text-slate-400">
            <span>自动轮播中 (悬停暂停)</span>
          </div>
        </div>

        {/* Top Ring Progress Gauge */}
        <div className="py-2 px-3 my-2 rounded-lg bg-[#071329] border border-sky-900/40 flex items-center justify-between shrink-0">
          <div className="flex flex-col">
            <span className="text-xs text-slate-300 font-medium">年度综合建设任务完成率</span>
            <span className="text-[11px] text-slate-400 mt-0.5">
              当年目标: <span className="font-mono text-slate-200">15.0</span> 万亩 · 累计完成: <span className="font-mono text-cyan-300">{overview.newAreaThisYear}</span> 万亩
            </span>
          </div>

          {/* SVG Circular Ring */}
          <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
            <svg className="w-16 h-16 -rotate-90 transform" viewBox="0 0 36 36">
              {/* Background track */}
              <path
                className="text-slate-800/80"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              {/* Active progress */}
              <path
                className="text-cyan-400 transition-all duration-1000 ease-out"
                strokeDasharray={`${overview.progressRate}, 100`}
                strokeLinecap="round"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-xs font-bold font-mono text-white tabular-nums">
                {overview.progressRate}%
              </span>
            </div>
          </div>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-12 text-[11px] font-medium text-slate-400 px-3 py-1.5 bg-[#061022] rounded-t border-b border-sky-900/40 shrink-0">
          <div className="col-span-4">县区 / 城市</div>
          <div className="col-span-3 text-right">目标(万亩)</div>
          <div className="col-span-3 text-right">完成(万亩)</div>
          <div className="col-span-2 text-right">完成率</div>
        </div>

        {/* Scrollable County Task List with Hover Pause & Click FlyTo */}
        <div
          ref={tableContainerRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="flex-1 overflow-y-auto space-y-1 py-1 pr-1"
        >
          {countyTasks.map((task) => {
            const isSelected = selectedCountyName === task.countyName;
            return (
              <div
                key={task.id}
                onClick={() => onSelectCounty(task.countyName)}
                className={`grid grid-cols-12 items-center text-xs px-3 py-2.5 rounded transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-950/80 border border-cyan-400/80 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                    : task.isWarning
                    ? 'bg-rose-950/30 border border-rose-900/50 hover:bg-rose-900/40'
                    : 'bg-[#091736]/60 hover:bg-[#0f244f]/80 border border-sky-950/60'
                }`}
                title="点击在地图上定位并高亮该县农田项目"
              >
                <div className="col-span-4 flex items-center gap-1.5 truncate">
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      task.isWarning ? 'bg-rose-500 animate-pulse' : 'bg-cyan-400'
                    }`}
                  />
                  <span className="font-medium text-slate-100 truncate">{task.countyName}</span>
                  <span className="text-[10px] text-slate-400 shrink-0">({task.cityName.slice(0, 2)})</span>
                </div>

                <div className="col-span-3 text-right font-mono text-slate-300 tabular-nums">
                  {task.targetArea.toFixed(1)}
                </div>

                <div className="col-span-3 text-right font-mono text-slate-100 font-semibold tabular-nums">
                  {task.completedArea.toFixed(1)}
                </div>

                <div className="col-span-2 text-right">
                  {task.isWarning ? (
                    <span className="inline-flex items-center gap-0.5 text-rose-400 font-mono font-bold text-[11px] tabular-nums">
                      <AlertTriangle className="w-2.5 h-2.5" />
                      {task.rate}%
                    </span>
                  ) : (
                    <span className="text-emerald-400 font-mono font-semibold text-[11px] tabular-nums">
                      {task.rate}%
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Table Footer Tip */}
        <div className="pt-2 text-[10px] text-slate-400 flex items-center justify-between border-t border-sky-950/60 shrink-0">
          <span className="flex items-center gap-1 text-rose-400">
            <AlertTriangle className="w-3 h-3" />
            完成率低于50%已触发黄色进度预警
          </span>
          <span>点击行可快速联动地图</span>
        </div>
      </section>
    </aside>
  );
};
