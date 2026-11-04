import React, { useState } from 'react';
import {
  Layers,
  Calendar,
  AlertTriangle,
  Building,
  Coins,
  ChevronRight,
  TrendingUp,
  MapPin,
  Phone,
  FileText,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';
import { ProjectBlock } from '../../types/dashboard';
import {
  CONTRACTOR_ENTITIES,
  MONTHLY_PAYMENTS,
  PROJECT_PARCELS,
} from '../../data/projectDetailData';
import { ContractorEntity, MonthlyPayment } from '../../types/projectDetail';

interface LeftPanelScreen2Props {
  project: ProjectBlock;
  onFlashAllParcels: () => void;
  onOpenStatusFlowModal: () => void;
  onOpenVillagesModal: () => void;
  onOpenPaymentDetailModal: (payment: MonthlyPayment) => void;
  onOpenContractorModal: (contractor: ContractorEntity) => void;
  onOpenContractorDutyModal: (contractor: ContractorEntity) => void;
}

export const LeftPanelScreen2: React.FC<LeftPanelScreen2Props> = ({
  project,
  onFlashAllParcels,
  onOpenStatusFlowModal,
  onOpenVillagesModal,
  onOpenPaymentDetailModal,
  onOpenContractorModal,
  onOpenContractorDutyModal,
}) => {
  const [hoveredMonth, setHoveredMonth] = useState<string | null>(null);

  const totalBudget = project.investment || 3125;
  const paidAmount = 2250;
  const unpaidAmount = totalBudget - paidAmount;
  const paymentRate = Math.round((paidAmount / totalBudget) * 100);
  const isPaymentLagging = paymentRate < project.progress - 20;

  return (
    <aside className="w-[450px] h-full flex flex-col gap-2.5 p-3.5 shrink-0 z-10 overflow-hidden">
      {/* 4.1 项目概况 */}
      <section className="h-[215px] rounded-xl bg-[#091530]/85 border border-sky-800/40 p-3 shadow-lg backdrop-blur flex flex-col shrink-0">
        <div className="flex items-center justify-between border-b border-sky-900/50 pb-1.5 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-3.5 bg-cyan-400 rounded-full" />
            <h2 className="text-sm font-bold text-white tracking-wide">项目概况</h2>
            <span className="text-[10px] text-slate-400 font-mono">{project.code}</span>
          </div>

          {/* Current Status tag (Clickable for Status Flow Record §4.1) */}
          <button
            onClick={onOpenStatusFlowModal}
            className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded border transition-all ${
              project.status === 'completed'
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/60 shadow-[0_0_8px_rgba(16,185,129,0.3)]'
                : project.status === 'overdue'
                ? 'bg-rose-950/80 text-rose-300 border-rose-500/60 shadow-[0_0_8px_rgba(244,63,94,0.3)] animate-pulse'
                : 'bg-cyan-950/80 text-cyan-300 border-cyan-500/60 shadow-[0_0_8px_rgba(6,182,212,0.3)]'
            }`}
            title="点击查看项目全生命周期状态流转记录"
          >
            <span>{project.status === 'completed' ? '已完工' : project.status === 'overdue' ? '工期逾期' : '在建中'}</span>
            <ChevronRight className="w-2.5 h-2.5" />
          </button>
        </div>

        {/* 5 Indicator Metric Cards */}
        <div className="grid grid-cols-3 gap-2 mt-2 shrink-0">
          {/* Card 1: 建设面积 */}
          <div className="p-2 rounded bg-gradient-to-br from-[#0c234d]/90 to-[#071638]/90 border border-sky-700/40 flex flex-col">
            <span className="text-[10px] text-slate-400">建设面积</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg font-bold font-mono text-cyan-300 tabular-nums">
                {(project.area / 10000).toFixed(2)}
              </span>
              <span className="text-[10px] text-slate-400">万亩</span>
            </div>
            <span className="text-[9px] text-slate-400 font-mono mt-0.5">({project.area.toLocaleString()} 亩)</span>
          </div>

          {/* Card 2: 图斑数量 (Click -> Flash all parcels on map) */}
          <div
            onClick={onFlashAllParcels}
            className="p-2 rounded bg-gradient-to-br from-[#0c234d]/90 to-[#071638]/90 border border-cyan-500/40 hover:border-cyan-400 cursor-pointer flex flex-col transition-all group shadow-sm hover:shadow-[0_0_8px_rgba(6,182,212,0.3)]"
            title="点击联动地图高亮并闪烁全部8个图斑"
          >
            <div className="flex items-center justify-between text-[10px] text-slate-300">
              <span>图斑数量</span>
              <Layers className="w-3 h-3 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg font-bold font-mono text-white tabular-nums">
                {PROJECT_PARCELS.length}
              </span>
              <span className="text-[10px] text-cyan-400">个图斑</span>
            </div>
            <span className="text-[9px] text-cyan-400/90 flex items-center gap-0.5">
              <Sparkles className="w-2.5 h-2.5" />
              <span>点击定位</span>
            </span>
          </div>

          {/* Card 3: 涉及行政村 (Click -> open village list modal) */}
          <div
            onClick={onOpenVillagesModal}
            className="p-2 rounded bg-gradient-to-br from-[#0c234d]/90 to-[#071638]/90 border border-teal-500/40 hover:border-teal-400 cursor-pointer flex flex-col transition-all group"
            title="点击查看涉及村庄清单"
          >
            <div className="flex items-center justify-between text-[10px] text-slate-300">
              <span>涉及村庄</span>
              <MapPin className="w-3 h-3 text-teal-400" />
            </div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg font-bold font-mono text-teal-300 tabular-nums">6</span>
              <span className="text-[10px] text-slate-400">个村</span>
            </div>
            <span className="text-[9px] text-teal-400/90">孤家子中街、八里庙等</span>
          </div>
        </div>

        {/* Bottom Period Bar */}
        <div className="mt-2 p-2 rounded bg-[#071329] border border-sky-950/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <span>建设工期：</span>
            <span className="font-mono text-slate-200">
              {project.startDate} 至 {project.planEndDate}
            </span>
          </div>
          {project.status === 'overdue' && (
            <span className="text-[10px] text-rose-400 font-bold bg-rose-950/80 px-1.5 py-0.5 rounded border border-rose-800">
              超期 {project.overdueDays} 天
            </span>
          )}
        </div>
      </section>

      {/* 4.2 资金支付情况 */}
      <section className="h-[250px] rounded-xl bg-[#091530]/85 border border-sky-800/40 p-3 shadow-lg backdrop-blur flex flex-col shrink-0">
        <div className="flex items-center justify-between border-b border-sky-900/50 pb-1.5 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-3.5 bg-amber-400 rounded-full" />
            <h2 className="text-sm font-bold text-white tracking-wide">资金支付情况</h2>
            <span className="text-[10px] text-slate-400">财政专项预算执行</span>
          </div>

          {isPaymentLagging && (
            <span className="flex items-center gap-1 text-[10px] text-amber-400 bg-amber-950/70 border border-amber-800 px-1.5 py-0.5 rounded">
              <AlertTriangle className="w-3 h-3" />
              <span>支付进度滞后预警</span>
            </span>
          )}
        </div>

        {/* Top Ring & 3 Stat Cards */}
        <div className="flex items-center gap-3 my-2 shrink-0">
          {/* Ring */}
          <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
            <svg className="w-16 h-16 -rotate-90 transform" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-amber-400 transition-all duration-1000"
                strokeDasharray={`${paymentRate}, 100`}
                strokeLinecap="round"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-xs font-bold font-mono text-amber-300 tabular-nums">
                {paymentRate}%
              </span>
              <span className="text-[8px] text-slate-400">已付</span>
            </div>
          </div>

          {/* 3 Metric Cards */}
          <div className="flex-1 grid grid-cols-3 gap-1.5 text-center">
            <div className="p-1 rounded bg-[#071329] border border-sky-950/60">
              <span className="text-[10px] text-slate-400">总概算</span>
              <div className="font-mono font-bold text-slate-100 text-xs mt-0.5">
                {totalBudget}万
              </div>
            </div>
            <div className="p-1 rounded bg-[#071329] border border-sky-950/60">
              <span className="text-[10px] text-slate-400">已支付</span>
              <div className="font-mono font-bold text-amber-400 text-xs mt-0.5">
                {paidAmount}万
              </div>
            </div>
            <div className="p-1 rounded bg-[#071329] border border-sky-950/60">
              <span className="text-[10px] text-slate-400">未拨付</span>
              <div className="font-mono font-bold text-slate-300 text-xs mt-0.5">
                {unpaidAmount}万
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Payment Bar Chart (近8-12个月) */}
        <div className="flex-1 flex flex-col justify-end pt-1">
          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
            <span>月度支付趋势（点击柱状图查看支付明细凭证）</span>
            <span className="font-mono text-amber-400 font-bold">累计 2,250 万元</span>
          </div>

          {/* Bars */}
          <div className="h-20 flex items-end justify-between gap-1 px-1 bg-[#071329]/60 rounded p-1 border border-sky-950/60">
            {MONTHLY_PAYMENTS.map((item) => {
              const maxVal = 500;
              const barHeightPct = Math.round((item.amount / maxVal) * 100);
              const isHovered = hoveredMonth === item.month;

              return (
                <div
                  key={item.month}
                  onClick={() => onOpenPaymentDetailModal(item)}
                  onMouseEnter={() => setHoveredMonth(item.month)}
                  onMouseLeave={() => setHoveredMonth(null)}
                  className="flex-1 flex flex-col items-center gap-1 cursor-pointer group"
                  title={`${item.month}: 支付 ${item.amount} 万元 (点击查看明细)`}
                >
                  <span className="text-[8px] font-mono text-slate-400 group-hover:text-amber-300">
                    {item.amount}
                  </span>
                  <div className="w-full bg-slate-800 rounded-t h-12 flex items-end overflow-hidden">
                    <div
                      className={`w-full rounded-t transition-all ${
                        isHovered
                          ? 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.6)]'
                          : 'bg-gradient-to-t from-amber-600 to-amber-400'
                      }`}
                      style={{ height: `${barHeightPct}%` }}
                    />
                  </div>
                  <span className="text-[8px] font-mono text-slate-400 whitespace-nowrap">
                    {item.month.slice(5)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4.3 参建单位 */}
      <section className="flex-1 rounded-xl bg-[#091530]/85 border border-sky-800/40 p-3 shadow-lg backdrop-blur flex flex-col min-h-0">
        <div className="flex items-center justify-between border-b border-sky-900/50 pb-1.5 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-3.5 bg-teal-400 rounded-full" />
            <h2 className="text-sm font-bold text-white tracking-wide">参建单位</h2>
            <span className="text-[10px] text-slate-400">责任主体与现场履职</span>
          </div>
          <span className="text-[10px] text-slate-400">点击查看资质与轨迹</span>
        </div>

        {/* Contractor List */}
        <div className="flex-1 overflow-y-auto space-y-1.5 pt-2 pr-1">
          {CONTRACTOR_ENTITIES.map((ent, idx) => (
            <div
              key={idx}
              onClick={() => onOpenContractorModal(ent)}
              className="p-2 rounded bg-[#08152e]/60 hover:bg-[#0c2246]/80 border border-sky-950/60 cursor-pointer flex items-center justify-between text-xs transition-colors group"
            >
              <div className="flex flex-col truncate max-w-[260px]">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-cyan-400 bg-sky-950/80 px-1 rounded border border-sky-800 shrink-0">
                    {ent.roleName.split(' ')[0]}
                  </span>
                  <span className="font-medium text-slate-100 truncate">{ent.companyName}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                  <span>负责人: {ent.leader}</span>
                  <span className="font-mono text-slate-400">{ent.phone}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenContractorDutyModal(ent);
                  }}
                  className="px-2 py-0.5 rounded text-[10px] font-medium bg-teal-950/80 hover:bg-teal-800 text-teal-300 border border-teal-700/60 transition-colors"
                  title="查看现场履职打卡记录与打卡点位"
                >
                  履职记录
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    alert(`正在呼叫 ${ent.roleName} ${ent.leader} (${ent.phone}) 专线电话...`);
                  }}
                  className="p-1 rounded text-cyan-400 hover:text-white hover:bg-cyan-900 border border-cyan-800/50"
                  title="拨打负责人电话"
                >
                  <Phone className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
};
