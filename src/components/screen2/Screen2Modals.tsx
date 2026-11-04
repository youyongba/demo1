import React from 'react';
import {
  X,
  CheckCircle2,
  Calendar,
  Building,
  User,
  Phone,
  FileSpreadsheet,
  Layers,
  MapPin,
  Coins,
  ShieldCheck,
  Download,
  Clock,
  Sparkles,
} from 'lucide-react';
import {
  ContractorEntity,
  MilestoneNode,
  MonthlyPayment,
  SubEngineeringItem,
} from '../../types/projectDetail';
import { SUB_ENGINEERING_ITEMS } from '../../data/projectDetailData';

// 1. Status Flow Lifecycle Modal
export const StatusFlowModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const steps = [
    { name: '规划立项', time: '2024-08-12', status: 'completed', desc: '吉农发建〔2024〕88号核准批复，资金概算3,125万元下达' },
    { name: '公开招投标', time: '2024-10-18', status: 'completed', desc: '在四平市公共资源交易中心完成施工、监理两标段挂牌与合同签订' },
    { name: '工程开工', time: '2024-11-01', status: 'completed', desc: '召开施工动员誓师大会，深松农机与北斗激光平地机大规模块组进场' },
    { name: '主体施工', time: '2025-05 (当前)', status: 'active', desc: '总体完成度74%，黑土地条田深松基本就绪，正全力攻坚抗冻渠系与泵站' },
    { name: '竣工初验', time: '2025-10 (计划)', status: 'pending', desc: '县级农业农村局会同镇政府开展黑土地实地测绘与通水试压初验' },
    { name: '终验闭环与移交', time: '2025-11 (计划)', status: 'pending', desc: '市级复验及省级抽验，移交孤家子镇管护并下发长效运行管护证' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in select-none">
      <div className="w-[620px] rounded-xl bg-[#091530] border-t-4 border-t-cyan-500 border border-sky-800 shadow-[0_20px_60px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden text-slate-100">
        <div className="h-12 px-5 bg-gradient-to-r from-[#0c2452] via-[#081836] to-[#0c2452] border-b border-sky-800/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <h2 className="text-sm font-bold text-white tracking-wide">项目全生命周期状态流转履历</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-4 text-xs">
          <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-sky-900">
            {steps.map((st, idx) => (
              <div key={idx} className="relative flex flex-col">
                <div
                  className={`absolute -left-6 top-0.5 w-3 h-3 rounded-full border-2 ${
                    st.status === 'completed'
                      ? 'bg-emerald-500 border-white'
                      : st.status === 'active'
                      ? 'bg-cyan-400 border-white animate-pulse'
                      : 'bg-slate-800 border-slate-600'
                  }`}
                />
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white">{st.name}</span>
                  <span className="font-mono text-[11px] text-cyan-300">{st.time}</span>
                  {st.status === 'active' && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                      当前阶段
                    </span>
                  )}
                </div>
                <p className="text-slate-300 text-[11px] mt-1 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="h-12 px-5 bg-[#071329] border-t border-sky-900/60 flex items-center justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-sky-950 hover:bg-sky-900 text-slate-200 text-xs font-medium border border-sky-800"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};

// 2. Villages List Modal
export const VillagesModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const villages = [
    { name: '孤家子中街村', households: 420, area: 2150, crops: '优质水稻/大豆轮作', benefits: '深松培厚有机质提升至2.45%，粮食亩增产120公斤' },
    { name: '八里庙村', households: 360, area: 1820, crops: '黑土高产大豆示范', benefits: '抗冻防渗渠系水利用系数从0.48提升至0.85' },
    { name: '前林海村', households: 310, area: 1640, crops: '耐密植高产玉米', benefits: '实现300马力北斗农机全流程高效作业' },
    { name: '西河西村', households: 280, area: 1480, crops: '绿色粮豆轮作区', benefits: '排涝标准提升至10年一遇暴雨24小时排除' },
    { name: '后林海村', households: 265, area: 1390, crops: '优质高产玉米核心田', benefits: '5米宽重型农机道路硬化率达100%' },
    { name: '高家店村', households: 295, area: 1560, crops: '黑土数字种业繁育', benefits: '全域实现5G深层土壤墒情物联网自动监测' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in select-none">
      <div className="w-[660px] rounded-xl bg-[#091530] border-t-4 border-t-teal-500 border border-sky-800 shadow-[0_20px_60px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden text-slate-100">
        <div className="h-12 px-5 bg-gradient-to-r from-[#0c2452] via-[#081836] to-[#0c2452] border-b border-sky-800/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-teal-400" />
            <h2 className="text-sm font-bold text-white tracking-wide">项目涉及行政村及受益农户清单 (6村)</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#071329] text-slate-400 border-b border-sky-900">
              <tr>
                <th className="p-2">村庄名称</th>
                <th className="p-2 text-right">农户数</th>
                <th className="p-2 text-right">改造面积</th>
                <th className="p-2">主栽品种</th>
                <th className="p-2">建设综合效益</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-950">
              {villages.map((v, i) => (
                <tr key={i} className="hover:bg-cyan-950/40">
                  <td className="p-2 font-bold text-slate-200">{v.name}</td>
                  <td className="p-2 text-right font-mono text-cyan-300">{v.households} 户</td>
                  <td className="p-2 text-right font-mono text-slate-100">{v.area.toLocaleString()} 亩</td>
                  <td className="p-2 text-slate-300">{v.crops}</td>
                  <td className="p-2 text-slate-400 text-[11px]">{v.benefits}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="h-12 px-5 bg-[#071329] border-t border-sky-900/60 flex items-center justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-sky-950 hover:bg-sky-900 text-slate-200 text-xs font-medium border border-sky-800"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};

// 3. Monthly Payment Detail Modal
export const PaymentDetailModal: React.FC<{
  payment: MonthlyPayment | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ payment, isOpen, onClose }) => {
  if (!isOpen || !payment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in select-none">
      <div className="w-[640px] rounded-xl bg-[#091530] border-t-4 border-t-amber-500 border border-sky-800 shadow-[0_20px_60px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden text-slate-100">
        <div className="h-12 px-5 bg-gradient-to-r from-[#0c2452] via-[#081836] to-[#0c2452] border-b border-sky-800/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-400" />
            <h2 className="text-sm font-bold text-white tracking-wide">
              {payment.month} 月度财政专项资金拨付凭证清单
            </h2>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 flex flex-col gap-3 text-xs flex-1 overflow-y-auto">
          <div className="p-3 rounded bg-[#071329] border border-amber-900/50 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400">本月拨付总额</span>
              <div className="text-xl font-bold font-mono text-amber-300">{payment.amount} 万元</div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400">截至当期累计拨付</span>
              <div className="font-mono text-cyan-300 font-bold">{payment.cumulativeAmount} 万元</div>
            </div>
          </div>

          <div className="space-y-2">
            {payment.items.map((item, idx) => (
              <div key={idx} className="p-3 rounded bg-[#071329] border border-sky-950 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-100">{item.title}</span>
                  <span className="font-mono font-bold text-amber-300 text-sm">{item.amount} 万元</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-400 pt-1 border-t border-sky-950/60">
                  <span>收款单位: {item.recipient}</span>
                  <span>拨付日期: {item.date}</span>
                  <span className="font-mono">发票代码: {item.invoiceNo}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="h-12 px-5 bg-[#071329] border-t border-sky-900/60 flex items-center justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-sky-950 hover:bg-sky-900 text-slate-200 text-xs font-medium border border-sky-800"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};

// 4. Milestone Stage Detail Modal
export const MilestoneDetailModal: React.FC<{
  node: MilestoneNode | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ node, isOpen, onClose }) => {
  if (!isOpen || !node) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in select-none">
      <div className="w-[580px] rounded-xl bg-[#091530] border-t-4 border-t-cyan-500 border border-sky-800 shadow-[0_20px_60px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden text-slate-100">
        <div className="h-12 px-5 bg-gradient-to-r from-[#0c2452] via-[#081836] to-[#0c2452] border-b border-sky-800/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-cyan-400" />
            <h2 className="text-sm font-bold text-white tracking-wide">
              里程碑阶段档案 · {node.name}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-3 text-xs flex-1 overflow-y-auto">
          <div className="p-3 rounded bg-[#071329] border border-sky-900/60 grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <span className="text-slate-400">计划时限: </span>
              <span className="font-mono text-slate-200">{node.planDate}</span>
            </div>
            <div>
              <span className="text-slate-400">实际执行: </span>
              <span className="font-mono text-emerald-400 font-bold">{node.actualDate || '推进中'}</span>
            </div>
            {node.docNumber && (
              <div className="col-span-2">
                <span className="text-slate-400">批复文号: </span>
                <span className="font-mono text-cyan-300 font-bold">{node.docNumber}</span>
              </div>
            )}
            {node.approvalUnit && (
              <div className="col-span-2">
                <span className="text-slate-400">审批机关: </span>
                <span className="text-slate-200">{node.approvalUnit}</span>
              </div>
            )}
          </div>

          <div className="p-3 rounded bg-[#071329] border border-sky-900/60 flex flex-col gap-1">
            <span className="font-bold text-white">阶段纪要说明:</span>
            <p className="text-slate-300 leading-relaxed text-[11px]">{node.desc}</p>
          </div>

          {node.pendingTasks && (
            <div className="p-3 rounded bg-amber-950/30 border border-amber-900/50 flex flex-col gap-1.5">
              <span className="font-bold text-amber-300">当前阶段重点待办攻坚清单:</span>
              <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
                {node.pendingTasks.map((t, idx) => (
                  <li key={idx}>{t}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="h-12 px-5 bg-[#071329] border-t border-sky-900/60 flex items-center justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-sky-950 hover:bg-sky-900 text-slate-200 text-xs font-medium border border-sky-800"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};

// 5. Sub Engineering Units Modal (6.1 清单)
export const SubEngineeringListModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in select-none">
      <div className="w-[740px] h-[520px] rounded-xl bg-[#091530] border-t-4 border-t-cyan-500 border border-sky-800 shadow-[0_20px_60px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden text-slate-100">
        <div className="h-12 px-5 bg-gradient-to-r from-[#0c2452] via-[#081836] to-[#0c2452] border-b border-sky-800/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-cyan-400" />
            <h2 className="text-sm font-bold text-white tracking-wide">
              分项工程施工作业单元全量清单
            </h2>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto space-y-4 text-xs">
          {SUB_ENGINEERING_ITEMS.map((sub) => (
            <div key={sub.id} className="flex flex-col gap-2">
              <div className="flex items-center justify-between font-bold text-cyan-300 border-b border-sky-900/60 pb-1">
                <span>{sub.name}</span>
                <span className="font-mono text-slate-400 text-[11px]">
                  总体已完成 {sub.completedAmount} / {sub.plannedAmount} {sub.unit} ({sub.progress}%)
                </span>
              </div>

              <div className="space-y-1.5">
                {sub.units.map((u) => (
                  <div
                    key={u.id}
                    className="p-2 rounded bg-[#071329] border border-sky-950 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-200">{u.unitName}</span>
                      <span className="font-mono text-[10px] text-slate-400">({u.target})</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                          u.status === 'completed'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : u.status === 'constructing'
                            ? 'bg-sky-950 text-sky-400 border border-sky-800'
                            : 'bg-slate-900 text-slate-400'
                        }`}
                      >
                        {u.status === 'completed' ? '已验收' : u.status === 'constructing' ? '在建' : '待开工'}
                      </span>
                      <span className="font-mono font-bold text-cyan-400 w-10 text-right">
                        {u.progress}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="h-12 px-5 bg-[#071329] border-t border-sky-900/60 flex items-center justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-sky-950 hover:bg-sky-900 text-slate-200 text-xs font-medium border border-sky-800"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};

// 6. Contractor Details & Duty Records Modal (4.3)
export const ContractorDutyModal: React.FC<{
  contractor: ContractorEntity | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ contractor, isOpen, onClose }) => {
  if (!isOpen || !contractor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in select-none">
      <div className="w-[660px] max-h-[560px] rounded-xl bg-[#091530] border-t-4 border-t-teal-500 border border-sky-800 shadow-[0_20px_60px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden text-slate-100">
        <div className="h-12 px-5 bg-gradient-to-r from-[#0c2452] via-[#081836] to-[#0c2452] border-b border-sky-800/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-teal-400" />
            <h2 className="text-sm font-bold text-white tracking-wide">
              参建主体资质与现场履职档案 · {contractor.companyName}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 flex flex-col gap-3 text-xs flex-1 overflow-y-auto">
          <div className="p-3 rounded bg-[#071329] border border-sky-900/60 grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <span className="text-slate-400">参建角色: </span>
              <span className="text-cyan-300 font-bold">{contractor.roleName}</span>
            </div>
            <div>
              <span className="text-slate-400">企业资质: </span>
              <span className="text-slate-200">{contractor.qualification}</span>
            </div>
            <div>
              <span className="text-slate-400">现场负责人: </span>
              <span className="text-slate-200">{contractor.leader}</span>
            </div>
            <div>
              <span className="text-slate-400">调度电话: </span>
              <span className="font-mono text-cyan-400">{contractor.phone}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-bold text-xs text-teal-300">现场履职打卡日志记录:</span>
            <div className="space-y-2">
              {contractor.dutyRecords.map((rec) => (
                <div
                  key={rec.id}
                  className="p-3 rounded bg-[#071329] border border-sky-950 flex flex-col gap-1.5"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-white">{rec.location}</span>
                    <span className="font-mono text-cyan-400">{rec.date} {rec.time}</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">{rec.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="h-12 px-5 bg-[#071329] border-t border-sky-900/60 flex items-center justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-sky-950 hover:bg-sky-900 text-slate-200 text-xs font-medium border border-sky-800"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};
