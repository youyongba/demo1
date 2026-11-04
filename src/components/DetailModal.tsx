import React, { useState } from 'react';
import {
  X,
  Download,
  Search,
  Route,
  Video,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  MapPin,
  Building2,
  User,
  Shield,
  FileSpreadsheet,
} from 'lucide-react';
import {
  ProjectBlock,
  InspectionRecord,
  InspectorPersonnel,
  AcceptanceItem,
} from '../types/dashboard';
import { ASSET_IMAGES } from '../data/mockData';

export type ModalType =
  | 'project_detail'
  | 'inspection_detail'
  | 'overdue_analysis'
  | 'project_list'
  | 'acceptance_list'
  | 'coverage_detail';

interface DetailModalProps {
  type: ModalType | null;
  data: any;
  isOpen: boolean;
  onClose: () => void;
  onStartTrackPlayback?: (trackId: string) => void;
  onStartBodycamCall?: (person: InspectorPersonnel) => void;
  onSelectProjectOnMap?: (block: ProjectBlock) => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({
  type,
  data,
  isOpen,
  onClose,
  onStartTrackPlayback,
  onStartBodycamCall,
  onSelectProjectOnMap,
}) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'sections' | 'photos'>('overview');

  if (!isOpen || !type) return null;

  // Determine top color bar based on type (§6.2 rule 4)
  const getHeaderColor = () => {
    switch (type) {
      case 'project_detail':
      case 'project_list':
        return 'border-t-4 border-t-cyan-500';
      case 'inspection_detail':
        return 'border-t-4 border-t-amber-500';
      case 'coverage_detail':
        return 'border-t-4 border-t-teal-500';
      case 'acceptance_list':
        return 'border-t-4 border-t-emerald-500';
      case 'overdue_analysis':
        return 'border-t-4 border-t-rose-500';
      default:
        return 'border-t-4 border-t-cyan-500';
    }
  };

  // Export CSV mock handler
  const handleExportCsv = (filename: string) => {
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF项目编号,项目名称,行政区划,面积(亩),总投资(万元),建设状态,工期进度\n';
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm animate-fade-in">
      <div
        className={`relative bg-[#091530] border border-sky-800/80 rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden text-slate-100 ${getHeaderColor()} ${
          type === 'project_list' || type === 'acceptance_list' || type === 'coverage_detail'
            ? 'w-[820px] h-[540px]'
            : 'w-[660px] h-[500px]'
        }`}
      >
        {/* Header Bar */}
        <div className="h-14 px-5 bg-gradient-to-r from-[#0c234d] via-[#081836] to-[#0c234d] border-b border-sky-900/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            {type === 'project_detail' && <Layers className="w-5 h-5 text-cyan-400" />}
            {type === 'inspection_detail' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
            {type === 'overdue_analysis' && <AlertTriangle className="w-5 h-5 text-rose-400" />}
            {type === 'project_list' && <FileSpreadsheet className="w-5 h-5 text-cyan-400" />}
            {type === 'acceptance_list' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            {type === 'coverage_detail' && <Shield className="w-5 h-5 text-teal-400" />}

            <h2 className="text-base font-bold text-white tracking-wide">
              {type === 'project_detail' && `项目档案明细 · ${data?.name}`}
              {type === 'inspection_detail' && `质量巡查现场督办单 · ${data?.issueType}`}
              {type === 'overdue_analysis' && `工期逾期预警与成因深度剖析 · ${data?.name}`}
              {type === 'project_list' && '全省高标准农田建设项目台账清单'}
              {type === 'acceptance_list' && '全省竣工工程验收闭环监督清单'}
              {type === 'coverage_detail' && '各县区田长制网格巡查履职覆盖率明细'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="flex-1 overflow-y-auto p-5 text-xs">
          {/* 1. Project Detail */}
          {type === 'project_detail' && data && (
            <div className="flex flex-col gap-4">
              {/* Top basic card */}
              <div className="p-3.5 rounded-lg bg-[#071329] border border-sky-900/60 grid grid-cols-3 gap-3">
                <div>
                  <span className="text-[11px] text-slate-400">图斑编码</span>
                  <div className="font-mono font-semibold text-cyan-300 text-sm mt-0.5">{data.code}</div>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400">建设面积</span>
                  <div className="font-mono font-semibold text-slate-100 text-sm mt-0.5">{data.area.toLocaleString()} 亩</div>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400">概算投资</span>
                  <div className="font-mono font-semibold text-amber-300 text-sm mt-0.5">{data.investment} 万元</div>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400">行政隶属</span>
                  <div className="text-slate-200 mt-0.5">{data.cityName} · {data.countyName} ({data.townName})</div>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400">施工单位</span>
                  <div className="text-slate-200 mt-0.5 truncate">{data.contractor}</div>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400">项目负责人</span>
                  <div className="text-slate-200 mt-0.5">{data.leader}</div>
                </div>
              </div>

              {/* Sub-sections Construction Details */}
              <div className="flex flex-col gap-2">
                <h3 className="font-bold text-sm text-cyan-300 flex items-center gap-1.5">
                  <span className="w-1.5 h-3 bg-cyan-400 rounded-full" />
                  工程分标段建设进度
                </h3>
                <div className="space-y-2">
                  {data.sections?.map((sec: any, idx: number) => (
                    <div key={idx} className="p-2.5 rounded bg-[#071329]/90 border border-sky-950/80 flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-200">{sec.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400 font-mono">{sec.status}</span>
                          <span className="font-mono font-bold text-cyan-400">{sec.progress}%</span>
                        </div>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${sec.progress}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Drone Real-scene Photo */}
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-slate-300">现场无人机高空航测实景图</span>
                <img
                  src={ASSET_IMAGES.droneFarmland}
                  alt="无人机实景"
                  className="w-full h-44 object-cover rounded-lg border border-sky-900"
                />
              </div>
            </div>
          )}

          {/* 2. Inspection Detail */}
          {type === 'inspection_detail' && data && (
            <div className="flex flex-col gap-4">
              <div className="p-3.5 rounded-lg bg-[#071329] border border-amber-900/40 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[11px] text-slate-400">巡查时间</span>
                  <div className="font-mono text-slate-200 mt-0.5">{data.date} {data.time}</div>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400">所属项目</span>
                  <div className="text-slate-100 font-medium mt-0.5">{data.projectName}</div>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400">巡查人</span>
                  <div className="text-slate-200 mt-0.5">{data.inspectorName} ({data.inspectorRole})</div>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400">整改截止日期</span>
                  <div className="font-mono text-amber-400 font-semibold mt-0.5">{data.rectifyDeadline}</div>
                </div>
              </div>

              {/* Issue Description */}
              <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-900/40">
                <div className="flex items-center gap-1.5 text-rose-400 font-bold mb-1">
                  <AlertTriangle className="w-4 h-4" />
                  <span>隐患问题核实说明</span>
                </div>
                <p className="text-slate-200 leading-relaxed">{data.issueDesc}</p>
              </div>

              {/* Photo & Actions */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <span className="text-[11px] text-slate-400 mb-1 block">现场抽检留存取证照片</span>
                  <img
                    src={data.photoUrl || ASSET_IMAGES.pumpStation}
                    alt="现场问题照片"
                    className="w-full h-36 object-cover rounded border border-sky-900"
                  />
                </div>

                <div className="w-52 flex flex-col justify-end gap-2.5">
                  {data.hasTrack && onStartTrackPlayback && (
                    <button
                      onClick={() => {
                        onStartTrackPlayback(data.trackId || 'trk-01');
                        onClose();
                      }}
                      className="w-full py-2 px-3 rounded-lg bg-sky-900 hover:bg-sky-800 text-cyan-300 font-medium flex items-center justify-center gap-1.5 border border-cyan-500/50 shadow transition-colors"
                    >
                      <Route className="w-4 h-4" />
                      <span>播放巡查轨迹</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      alert(`已通过短信与系统调度专线向责任施工方（${data.inspectorName}督办）发送加急整改督办单！`);
                    }}
                    className="w-full py-2 px-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-medium flex items-center justify-center gap-1.5 shadow transition-colors"
                  >
                    <span>催办限期整改</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 3. Overdue Analysis */}
          {type === 'overdue_analysis' && data && (
            <div className="flex flex-col gap-4">
              <div className="p-3.5 rounded-lg bg-rose-950/30 border border-rose-900/50 flex items-center justify-between">
                <div>
                  <span className="text-xs text-rose-300 font-bold">已连续超期滞后</span>
                  <div className="text-2xl font-mono font-bold text-rose-400">{data.overdueDays} 天</div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400">计划竣工日期: {data.planEndDate}</span>
                  <div className="text-xs text-slate-300 mt-1">目前累计工期进度仅完成 {data.progress}%</div>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-[#071329] border border-sky-900/60 flex flex-col gap-2">
                <span className="font-bold text-sm text-slate-100">滞后根因溯源</span>
                <p className="text-slate-300 leading-relaxed">{data.overdueReason}</p>
              </div>

              <div className="p-3.5 rounded-lg bg-[#071329] border border-sky-900/60 flex flex-col gap-2">
                <span className="font-bold text-sm text-cyan-300">市农业农村局现场督导纠偏举措</span>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  <li>增加双班制机械进场：新增3台大型挖掘机与2组激光平地机</li>
                  <li>协调异地预制构件现货调拨，保障渠系暗管24小时连续吊装</li>
                  <li>将该项目列入重点每日履职巡查库，要求网格员每日回传视频</li>
                </ul>
              </div>
            </div>
          )}

          {/* 4. Full Project List Table */}
          {type === 'project_list' && (
            <div className="flex flex-col h-full gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="按名称、县区筛选..."
                    value={filterQuery}
                    onChange={(e) => setFilterQuery(e.target.value)}
                    className="bg-[#071329] border border-sky-800 rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-cyan-400 w-52"
                  />
                </div>
                <button
                  onClick={() => handleExportCsv('高标准农田项目台账全量清单')}
                  className="flex items-center gap-1.5 px-3 py-1 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>导出清单 (CSV)</span>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto border border-sky-900/60 rounded">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#071329] text-slate-400 sticky top-0 border-b border-sky-900/60">
                    <tr>
                      <th className="p-2">图斑编码</th>
                      <th className="p-2">项目名称</th>
                      <th className="p-2">县区</th>
                      <th className="p-2 text-right">面积(亩)</th>
                      <th className="p-2 text-right">投资(万)</th>
                      <th className="p-2 text-center">状态</th>
                      <th className="p-2 text-right">工期进度</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sky-950">
                    {(data as ProjectBlock[])
                      ?.filter((b) => !filterQuery || b.name.includes(filterQuery) || b.countyName.includes(filterQuery))
                      .map((b) => (
                        <tr
                          key={b.id}
                          onClick={() => {
                            if (onSelectProjectOnMap) onSelectProjectOnMap(b);
                            onClose();
                          }}
                          className="hover:bg-cyan-950/40 cursor-pointer transition-colors"
                        >
                          <td className="p-2 font-mono text-cyan-400">{b.code}</td>
                          <td className="p-2 font-medium text-slate-200">{b.name}</td>
                          <td className="p-2 text-slate-400">{b.countyName}</td>
                          <td className="p-2 text-right font-mono text-slate-100">{b.area.toLocaleString()}</td>
                          <td className="p-2 text-right font-mono text-amber-300">{b.investment}</td>
                          <td className="p-2 text-center">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] ${
                                b.status === 'completed'
                                  ? 'bg-emerald-950 text-emerald-400'
                                  : b.status === 'overdue'
                                  ? 'bg-rose-950 text-rose-400'
                                  : 'bg-cyan-950 text-cyan-400'
                              }`}
                            >
                              {b.status === 'completed' ? '已完工' : b.status === 'overdue' ? '逾期' : '在建'}
                            </span>
                          </td>
                          <td className="p-2 text-right font-mono font-bold text-cyan-300">{b.progress}%</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 5. Acceptance List */}
          {type === 'acceptance_list' && (
            <div className="flex flex-col h-full gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300">当前批次工程验收队列进度（共 14 项排查中）</span>
                <button
                  onClick={() => handleExportCsv('高标准农田工程终验闭环清单')}
                  className="flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>导出核验证明 (CSV)</span>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto border border-sky-900/60 rounded">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#071329] text-slate-400 sticky top-0 border-b border-sky-900/60">
                    <tr>
                      <th className="p-2">项目名称</th>
                      <th className="p-2">县区</th>
                      <th className="p-2">完工日期</th>
                      <th className="p-2 text-center">状态</th>
                      <th className="p-2 text-right">超期天数</th>
                      <th className="p-2 text-right">自评质检得分</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sky-950">
                    {(data as AcceptanceItem[])?.map((item) => (
                      <tr key={item.id} className="hover:bg-cyan-950/40">
                        <td className="p-2 font-medium text-slate-200">{item.projectName}</td>
                        <td className="p-2 text-slate-400">{item.countyName}</td>
                        <td className="p-2 font-mono text-slate-300">{item.finishDate}</td>
                        <td className="p-2 text-center">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] ${
                              item.status === 'approved'
                                ? 'bg-emerald-950 text-emerald-400'
                                : item.status === 'inspecting'
                                ? 'bg-sky-950 text-sky-400'
                                : 'bg-amber-950 text-amber-400'
                            }`}
                          >
                            {item.status === 'approved' ? '已验收' : item.status === 'inspecting' ? '现场核验' : '待组织'}
                          </span>
                        </td>
                        <td className="p-2 text-right font-mono">
                          {item.overdueDays > 0 ? (
                            <span className="text-rose-400 font-bold">+{item.overdueDays}天</span>
                          ) : (
                            <span className="text-emerald-400">按期</span>
                          )}
                        </td>
                        <td className="p-2 text-right font-mono font-bold text-emerald-300">{item.score || 92}分</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 6. Coverage Detail */}
          {type === 'coverage_detail' && (
            <div className="flex flex-col h-full gap-3">
              <div className="p-3 rounded bg-[#071329] border border-teal-900/40 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400">全省田长制平均覆盖率</span>
                  <div className="text-xl font-bold font-mono text-teal-300">98.2%</div>
                </div>
                <div className="text-xs text-slate-300 text-right">
                  全省已划分农田网格 <span className="font-mono text-cyan-300 font-bold">1,850</span> 个，配备网格员{' '}
                  <span className="font-mono text-cyan-300 font-bold">380</span> 名
                </div>
              </div>

              <div className="flex-1 overflow-y-auto border border-sky-900/60 rounded">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#071329] text-slate-400 sticky top-0 border-b border-sky-900/60">
                    <tr>
                      <th className="p-2">县区</th>
                      <th className="p-2 text-right">责任网格数</th>
                      <th className="p-2 text-right">在岗田长与网格员</th>
                      <th className="p-2 text-right">本月打卡巡查数</th>
                      <th className="p-2 text-right">履职覆盖率</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sky-950">
                    {[
                      { county: '梨树县', grids: 85, inspectors: 24, count: 482, rate: 98.6 },
                      { county: '农安县', grids: 98, inspectors: 28, count: 520, rate: 97.8 },
                      { county: '榆树市', grids: 110, inspectors: 32, count: 615, rate: 98.8 },
                      { county: '镇赉县', grids: 76, inspectors: 20, count: 395, rate: 96.5 },
                      { county: '前郭县', grids: 84, inspectors: 22, count: 470, rate: 96.0 },
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-cyan-950/40">
                        <td className="p-2 font-medium text-slate-200">{row.county}</td>
                        <td className="p-2 text-right font-mono text-slate-300">{row.grids} 个</td>
                        <td className="p-2 text-right font-mono text-slate-300">{row.inspectors} 人</td>
                        <td className="p-2 text-right font-mono text-cyan-300 font-bold">{row.count} 次</td>
                        <td className="p-2 text-right font-mono font-bold text-teal-300">{row.rate}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="h-12 px-5 bg-[#071329] border-t border-sky-900/60 flex items-center justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-sky-950 hover:bg-sky-900 text-slate-200 text-xs font-medium border border-sky-800 transition-colors"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};
