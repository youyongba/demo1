import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  Clock,
  PhoneCall,
  Video,
  Send,
  BellRing,
  CheckCircle2,
  XCircle,
  Camera,
  Calendar,
  Building,
  User,
  Shield,
  FileCheck,
} from 'lucide-react';
import { QualityIssueItem } from '../../types/projectDetail';
import { DETAIL_IMAGES } from '../../data/projectDetailData';

interface IssueDetailModalProps {
  issue: QualityIssueItem | null;
  isOpen: boolean;
  onClose: () => void;
  onStartBodycamCall: (name: string, phone: string) => void;
  onShowToast: (msg: string) => void;
}

export const IssueDetailModal: React.FC<IssueDetailModalProps> = ({
  issue,
  isOpen,
  onClose,
  onStartBodycamCall,
  onShowToast,
}) => {
  const [currentIssue, setCurrentIssue] = useState<QualityIssueItem | null>(issue);
  const [actionTab, setActionTab] = useState<'info' | 'assign' | 'remind' | 'review'>('info');

  // Assign form
  const [assignDeadline, setAssignDeadline] = useState('2025-05-25');
  const [assignUnit, setAssignUnit] = useState('省水利工程第一建筑集团');

  // Review form
  const [reviewNote, setReviewNote] = useState('经现场监理复核见证，整改施工质量符合技术规范');

  if (!isOpen || !currentIssue) return null;

  // Handle Transfer / Assign
  const handleAssignSubmit = () => {
    setCurrentIssue({
      ...currentIssue,
      status: 'rectifying',
      stage: 'assigned',
      deadline: assignDeadline,
      timeline: [
        ...currentIssue.timeline,
        {
          stage: '下发转办',
          time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
          operator: '监管中心 (当前调度员)',
          note: `已指派责任施工方 ${assignUnit} 限期于 ${assignDeadline} 前完成消除闭环。`,
        },
      ],
    });
    setActionTab('info');
    onShowToast(`已向责任单位 ${assignUnit} 发送现场整改督办单！`);
  };

  // Handle Remind / Expedite
  const handleRemindSubmit = () => {
    setCurrentIssue({
      ...currentIssue,
      remindCount: currentIssue.remindCount + 1,
      timeline: [
        ...currentIssue.timeline,
        {
          stage: '加急催办',
          time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
          operator: '监管中心 (当前调度员)',
          note: `已发起第 ${currentIssue.remindCount + 1} 次加急催办短信及系统告警。`,
        },
      ],
    });
    onShowToast(`已对责任人 ${currentIssue.responsiblePerson} 发起加急催办提醒！`);
  };

  // Handle Review
  const handleReviewPass = () => {
    setCurrentIssue({
      ...currentIssue,
      status: 'closed',
      stage: 'reviewed',
      timeline: [
        ...currentIssue.timeline,
        {
          stage: '复核通过',
          time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
          operator: '监管验收组',
          note: reviewNote,
        },
      ],
    });
    setActionTab('info');
    onShowToast(`质量问题隐患已复核合格，顺利完成全流程闭环！`);
  };

  const handleReviewReject = () => {
    setCurrentIssue({
      ...currentIssue,
      status: 'rejected',
      stage: 'assigned',
      timeline: [
        ...currentIssue.timeline,
        {
          stage: '复核驳回',
          time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
          operator: '监管验收组',
          note: '整改现场达标程度不足，打回施工班组返工处理。',
        },
      ],
    });
    setActionTab('info');
    onShowToast(`复核不通过，已驳回责任班组限期返工！`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in select-none">
      <div className="w-[660px] max-h-[640px] rounded-xl bg-[#091530] border-t-4 border-t-amber-500 border border-sky-800 shadow-[0_20px_60px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="h-13 px-5 bg-gradient-to-r from-[#0c2452] via-[#081836] to-[#0c2452] border-b border-sky-800/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <div className="flex flex-col">
              <h2 className="text-sm font-bold text-white tracking-wide">
                质量问题处置与全生命周期流转单
              </h2>
              <span className="text-[10px] text-slate-400 font-mono">
                编号: {currentIssue.id} · {currentIssue.location}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Tabs Toolbar */}
        <div className="h-10 px-5 bg-[#071329] border-b border-sky-900/60 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActionTab('info')}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                actionTab === 'info'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              问题详情与流转
            </button>
            <button
              onClick={() => setActionTab('assign')}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                actionTab === 'assign'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              下发转办
            </button>
            <button
              onClick={() => setActionTab('review')}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                actionTab === 'review'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              整改复核
            </button>
          </div>

          {/* Quick Bodycam & Remind triggers */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleRemindSubmit}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 text-[11px]"
              title="发送短信加急催办"
            >
              <BellRing className="w-3 h-3" />
              <span>催办 ({currentIssue.remindCount})</span>
            </button>

            <button
              onClick={() => {
                onStartBodycamCall(currentIssue.responsiblePerson, currentIssue.responsiblePhone);
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-cyan-950 hover:bg-cyan-800 text-cyan-300 border border-cyan-600 text-[11px] font-semibold shadow"
              title="与现场责任人发起执法记录仪实时图传通话"
            >
              <Video className="w-3.5 h-3.5" />
              <span>呼叫记录仪</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3 text-xs">
          {actionTab === 'info' && (
            <>
              {/* Problem Overview Card */}
              <div className="p-3.5 rounded-lg bg-[#071329] border border-sky-900/60 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-amber-300">{currentIssue.issueTitle}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      currentIssue.status === 'closed'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : currentIssue.status === 'to_review'
                        ? 'bg-sky-950 text-sky-400 border border-sky-800'
                        : currentIssue.status === 'rectifying'
                        ? 'bg-amber-950 text-amber-400 border border-amber-800'
                        : 'bg-rose-950 text-rose-400 border border-rose-800 animate-pulse'
                    }`}
                  >
                    {currentIssue.status === 'closed'
                      ? '已复核闭环'
                      : currentIssue.status === 'to_review'
                      ? '整改完成待复核'
                      : currentIssue.status === 'rectifying'
                      ? '施工整改中'
                      : '待转办处理'}
                  </span>
                </div>

                <p className="text-slate-300 leading-relaxed text-[11px]">{currentIssue.issueDesc}</p>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-sky-950 text-[11px]">
                  <div>
                    <span className="text-slate-400">责任单位: </span>
                    <span className="text-slate-200">{currentIssue.responsibleCompany}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">现场负责人: </span>
                    <span className="text-slate-200">
                      {currentIssue.responsiblePerson} ({currentIssue.responsiblePhone})
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">整改截止时间: </span>
                    <span className="font-mono text-amber-400 font-bold">{currentIssue.deadline}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">问题位置: </span>
                    <span className="text-slate-200">{currentIssue.location}</span>
                  </div>
                </div>
              </div>

              {/* Photos Comparison Before & After (if rectified) */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <span className="text-slate-400 text-[11px]">发现问题留证照片:</span>
                  <img
                    src={currentIssue.photoBefore}
                    alt="整改前照片"
                    className="w-full h-32 object-cover rounded border border-sky-900"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-slate-400 text-[11px]">整改后现场照片:</span>
                  {currentIssue.photoAfter ? (
                    <img
                      src={currentIssue.photoAfter}
                      alt="整改后照片"
                      className="w-full h-32 object-cover rounded border border-emerald-800"
                    />
                  ) : (
                    <div className="w-full h-32 rounded border border-dashed border-slate-700 bg-slate-900/50 flex flex-col items-center justify-center text-slate-500 text-[11px]">
                      <Camera className="w-6 h-6 mb-1 text-slate-600" />
                      <span>待施工方上传整改后对比照</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Vertical Lifecycle Flow Timeline (§7.1) */}
              <div className="flex flex-col gap-2 pt-2">
                <h3 className="font-bold text-xs text-cyan-300">处置流转全历程记录</h3>
                <div className="relative pl-6 space-y-3 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-sky-900">
                  {currentIssue.timeline.map((item, idx) => (
                    <div key={idx} className="relative flex flex-col">
                      <div className="absolute -left-6 top-0.5 w-2.5 h-2.5 rounded-full bg-cyan-400 border border-slate-950" />
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-[11px]">{item.stage}</span>
                        <span className="font-mono text-slate-400 text-[10px]">{item.time}</span>
                        <span className="text-cyan-400 text-[10px]">({item.operator})</span>
                      </div>
                      <p className="text-slate-300 text-[10px] mt-0.5">{item.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Tab 2: Assign Form */}
          {actionTab === 'assign' && (
            <div className="p-4 rounded-lg bg-[#071329] border border-amber-900/50 flex flex-col gap-3">
              <span className="font-bold text-sm text-amber-300">下发限期整改通知书</span>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">指派责任施工标段单位:</label>
                <select
                  value={assignUnit}
                  onChange={(e) => setAssignUnit(e.target.value)}
                  className="w-full bg-[#091530] border border-sky-800 rounded p-1.5 text-xs text-white"
                >
                  <option value="吉林省水利水电工程局集团 (机电安装部)">吉林省水利水电工程局集团 (机电安装部)</option>
                  <option value="吉林省水利水电工程局集团 (渠道施工一班组)">吉林省水利水电工程局集团 (渠道施工一班组)</option>
                  <option value="四平市水利市政建筑安装总公司">四平市水利市政建筑安装总公司</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">要求整改截止限期:</label>
                <input
                  type="date"
                  value={assignDeadline}
                  onChange={(e) => setAssignDeadline(e.target.value)}
                  className="w-full bg-[#091530] border border-sky-800 rounded p-1.5 text-xs text-white font-mono"
                />
              </div>

              <button
                onClick={handleAssignSubmit}
                className="mt-2 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow"
              >
                <Send className="w-3.5 h-3.5" />
                <span>立即提交下发转办</span>
              </button>
            </div>
          )}

          {/* Tab 3: Review Form */}
          {actionTab === 'review' && (
            <div className="p-4 rounded-lg bg-[#071329] border border-emerald-900/50 flex flex-col gap-3">
              <span className="font-bold text-sm text-emerald-300">现场整改复核与销号意见</span>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">复核质检评估意见:</label>
                <textarea
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  rows={3}
                  className="w-full bg-[#091530] border border-sky-800 rounded p-2 text-xs text-white"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleReviewPass}
                  className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>复核合格（准予销号闭环）</span>
                </button>
                <button
                  onClick={handleReviewReject}
                  className="py-2 px-4 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-700 text-xs font-semibold"
                >
                  <XCircle className="w-4 h-4 inline mr-1" />
                  <span>复核不合格（打回重整）</span>
                </button>
              </div>
            </div>
          )}
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
