/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ContainerScale } from './components/ContainerScale';
import { Header } from './components/Header';
import { LeftPanel } from './components/LeftPanel';
import { MapCenter } from './components/MapCenter';
import { RightPanel } from './components/RightPanel';
import { BodycamModal } from './components/BodycamModal';
import { DetailModal, ModalType } from './components/DetailModal';
import { RecordReadyModal } from './components/RecordReadyModal';
import { useScreenRecorder } from './hooks/useScreenRecorder';

// Screen 2 Components
import { HeaderScreen2 } from './components/screen2/HeaderScreen2';
import { LeftPanelScreen2 } from './components/screen2/LeftPanelScreen2';
import { CenterMapScreen2 } from './components/screen2/CenterMapScreen2';
import { RightPanelScreen2 } from './components/screen2/RightPanelScreen2';
import { ParcelBeforeAfterModal } from './components/screen2/ParcelBeforeAfterModal';
import { IssueDetailModal } from './components/screen2/IssueDetailModal';
import { CctvModal } from './components/screen2/CctvModal';
import { ArchivePreviewModal } from './components/screen2/ArchivePreviewModal';
import {
  StatusFlowModal,
  VillagesModal,
  PaymentDetailModal,
  MilestoneDetailModal,
  SubEngineeringListModal,
  ContractorDutyModal,
} from './components/screen2/Screen2Modals';

// Screen 3 Components
import { HeaderScreen3 } from './components/screen3/HeaderScreen3';
import { BottomFilterBar } from './components/screen3/BottomFilterBar';
import { LeftDrawerScreen3 } from './components/screen3/LeftDrawerScreen3';
import { RightDrawerScreen3 } from './components/screen3/RightDrawerScreen3';
import { MapScreen3 } from './components/screen3/MapScreen3';
import {
  QualityInspectionDetailModal,
  ProcessPhotosModal,
  MissingPhotosAlertModal,
  TrtcVideoCallModal,
} from './components/screen3/Screen3Modals';

import {
  DrillLevel,
  ProjectBlock,
  InspectionRecord,
  InspectorPersonnel,
} from './types/dashboard';
import {
  ProjectParcel,
  QualityIssueItem,
  SurveillanceCamera,
  ProjectArchiveItem,
  MonthlyPayment,
  ContractorEntity,
  MilestoneNode,
} from './types/projectDetail';
import {
  BlockGisFeature,
  FilterProject,
  FilterProjectArea,
  FilterBlock,
  ProcessStep,
  Screen3Inspection,
  ManagementPersonnel,
  ConstructionWorker,
} from './types/screen3Types';

import {
  YEARLY_OVERVIEW,
  COUNTY_TASKS_DATA,
  PROJECT_BLOCKS,
  INSPECTION_RECORDS,
  PERSONNEL_DUTY_LIST,
  ACCEPTANCE_QUEUE,
} from './data/mockData';
import {
  SCREEN3_PROJECTS,
  SCREEN3_AREAS,
  SCREEN3_BLOCKS,
  SCREEN3_GIS_FEATURES,
} from './data/screen3Data';

export default function App() {
  // Active Screen: 'screen1' (Monitoring Overview) | 'screen2' (Project Lifecycle) | 'screen3' (Engineering GIS)
  const [activeScreen, setActiveScreen] = useState<'screen1' | 'screen2' | 'screen3'>('screen1');

  // Year state
  const [currentYear, setCurrentYear] = useState<number>(2025);
  const [isYearLoading, setIsYearLoading] = useState<boolean>(false);

  // Screen 1: Map Navigation & Drill-down states (preserved across screens!)
  const [drillLevel, setDrillLevel] = useState<DrillLevel>('province');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>('blk-py-01');
  const [highlightedBlockId, setHighlightedBlockId] = useState<string | null>(null);

  // Screen 2: Current Selected Project Block
  const [currentProject, setCurrentProject] = useState<ProjectBlock>(
    PROJECT_BLOCKS.find((b) => b.id === 'blk-py-01') || PROJECT_BLOCKS[0]
  );
  const [highlightedSubEngineering, setHighlightedSubEngineering] = useState<string | null>(null);
  const [isFlashingParcels, setIsFlashingParcels] = useState(false);

  // Screen 2 Modal States
  const [activeParcelForModal, setActiveParcelForModal] = useState<ProjectParcel | null>(null);
  const [activeIssueForModal, setActiveIssueForModal] = useState<QualityIssueItem | null>(null);
  const [activeCameraForModal, setActiveCameraForModal] = useState<SurveillanceCamera | null>(null);
  const [activeArchiveForModal, setActiveArchiveForModal] = useState<ProjectArchiveItem | null>(null);
  const [activePaymentForModal, setActivePaymentForModal] = useState<MonthlyPayment | null>(null);
  const [activeContractorForModal, setActiveContractorForModal] = useState<ContractorEntity | null>(null);
  const [activeMilestoneForModal, setActiveMilestoneForModal] = useState<MilestoneNode | null>(null);
  const [isStatusFlowOpen, setIsStatusFlowOpen] = useState(false);
  const [isVillagesOpen, setIsVillagesOpen] = useState(false);
  const [isSubEngineeringListOpen, setIsSubEngineeringListOpen] = useState(false);

  // Screen 3: Five-Level Filter Bar State
  const [s3Year, setS3Year] = useState<string>('2025');
  const [s3ProjectType, setS3ProjectType] = useState<string>('pt-01');
  const [s3ProjectId, setS3ProjectId] = useState<string>('20');
  const [s3AreaId, setS3AreaId] = useState<string>('area-01');
  const [s3BlockId, setS3BlockId] = useState<string>('blk-01');

  // Screen 3: Drawer open state
  const [isS3DrawerOpen, setIsS3DrawerOpen] = useState<boolean>(true);

  // Screen 3: Layer & Filter states
  const [s3StatusFilters, setS3StatusFilters] = useState({
    completed: true,
    constructing: true,
    notStarted: true,
  });
  const [s3QualityAlarm, setS3QualityAlarm] = useState<boolean>(false);
  const [s3MissingPhotos, setS3MissingPhotos] = useState<boolean>(false);
  const [s3PlanningArea, setS3PlanningArea] = useState<boolean>(true);
  const [s3RefNames, setS3RefNames] = useState<boolean>(true);
  const [s3Category, setS3Category] = useState<string>('全部');
  const [s3JlTrack, setS3JlTrack] = useState<string>('none');
  const [s3JgTrack, setS3JgTrack] = useState<string>('none');

  // Screen 3: Selected WFS feature & Modals
  const [s3SelectedFeature, setS3SelectedFeature] = useState<BlockGisFeature | null>(null);
  const [s3InspectionModalRecord, setS3InspectionModalRecord] = useState<Screen3Inspection | null>(null);
  const [s3InspectionModalFeature, setS3InspectionModalFeature] = useState<BlockGisFeature | null>(null);
  const [s3ProcessPhotosStep, setS3ProcessPhotosStep] = useState<ProcessStep | null>(null);
  const [s3MissingPhotosFeature, setS3MissingPhotosFeature] = useState<BlockGisFeature | null>(null);
  const [s3TrtcCallTarget, setS3TrtcCallTarget] = useState<{
    name: string;
    role: string;
    phone: string;
  } | null>(null);
  const [s3IsPushingDb, setS3IsPushingDb] = useState<boolean>(false);

  // Trajectory Playback & Bodycam states (Screen 1 & 2)
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);
  const [activeCallingPersonnel, setActiveCallingPersonnel] = useState<InspectorPersonnel | null>(null);
  const [isBodycamOpen, setIsBodycamOpen] = useState(false);

  // Screen 1 Detail Modal states
  const [activeModalType, setActiveModalType] = useState<ModalType | null>(null);
  const [modalData, setModalData] = useState<any>(null);

  // Global Toast Message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Screen Recorder Hook (shared across all three screens)
  const {
    isRecording,
    recordDurationText,
    recordedResult,
    errorMessage: recordError,
    isSupported: isRecordSupported,
    startRecording,
    stopRecording,
    clearRecordedResult,
  } = useScreenRecorder();

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Switch to Screen 2
  const navigateToProjectScreen2 = (project: ProjectBlock) => {
    setCurrentProject(project);
    setActiveScreen('screen2');
    showToast(`已进入【${project.name}】全过程监管二屏。`);
  };

  // Switch to Screen 3
  const navigateToBlockScreen3 = () => {
    setActiveScreen('screen3');
    showToast('已进入【标段工程级监管大屏 (三屏)】，五级联动主轴已就绪。');
  };

  // Return to Screen 1 keeping camera state (§1)
  const navigateBackToOverview = (targetCity?: string, targetCounty?: string) => {
    if (targetCounty && targetCity) {
      setDrillLevel('county');
      setSelectedCity(targetCity);
      setSelectedCounty(targetCounty);
    } else if (targetCity) {
      setDrillLevel('city');
      setSelectedCity(targetCity);
    }
    setActiveScreen('screen1');
    showToast('已返回一屏（监测总览），保留离开时的区划与图层视角。');
  };

  // Year Change
  const handleYearChange = (newYear: number) => {
    if (newYear === currentYear) return;
    setIsYearLoading(true);
    setCurrentYear(newYear);
    setTimeout(() => setIsYearLoading(false), 350);
  };

  // Screen 1: Drill level
  const handleDrillChange = (
    level: DrillLevel,
    city?: string | null,
    county?: string | null,
    blockId?: string | null
  ) => {
    setDrillLevel(level);
    setSelectedCity(city ?? null);
    setSelectedCounty(county ?? null);
    setSelectedBlockId(blockId ?? null);
    if (level === 'province') {
      setHighlightedBlockId(null);
    }
  };

  const handleSelectBlock = (block: ProjectBlock) => {
    setSelectedBlockId(block.id);
    setHighlightedBlockId(block.id);
    setSelectedCity(block.cityName);
    setSelectedCounty(block.countyName);
    setDrillLevel('project');
  };

  const handleSelectCounty = (countyName: string) => {
    if (countyName === '梨树县') {
      handleDrillChange('county', '四平市', '梨树县', null);
      setHighlightedBlockId('blk-py-01');
    } else if (countyName === '农安县') {
      handleDrillChange('county', '长春市', '农安县', null);
      setHighlightedBlockId('blk-sg-01');
    } else if (countyName === '舒兰市') {
      handleDrillChange('county', '吉林市', '舒兰市', null);
      setHighlightedBlockId('blk-fx-01');
    } else {
      handleDrillChange('city', '四平市', null, null);
    }
  };

  const handleStartTrackPlayback = (trackId: string) => {
    setActiveTrackId(trackId);
    handleDrillChange('county', '四平市', '梨树县', null);
    showToast('已启动刘伟巡查员现场GPS移动轨迹回放。');
  };

  const handleStartBodycamCall = (person: InspectorPersonnel) => {
    setActiveCallingPersonnel(person);
    setIsBodycamOpen(true);
    showToast(`正在呼叫 ${person.name} (${person.deviceId}) 执法记录仪...`);
  };

  // Screen 3: One-click Database push handler (§6.3)
  const handleS3PushDatabase = () => {
    setS3IsPushingDb(true);
    setTimeout(() => {
      setS3IsPushingDb(false);
      showToast('标段全部要素坐标与属性已成功组装并调用 pushData 入库！');
    }, 1200);
  };

  // Screen 3: Five-level cascading handlers (§2.1)
  const handleS3YearChange = (yr: string) => {
    setS3Year(yr);
    setS3QualityAlarm(false);
  };

  const handleS3ProjectTypeChange = (typeId: string) => {
    setS3ProjectType(typeId);
    setS3QualityAlarm(false);
  };

  const handleS3ProjectChange = (projId: string) => {
    setS3ProjectId(projId);
    setS3QualityAlarm(false);
  };

  const handleS3AreaChange = (areaId: string) => {
    setS3AreaId(areaId);
    setS3QualityAlarm(false);
    setS3SelectedFeature(null);
  };

  const handleS3BlockChange = (blockId: string) => {
    setS3BlockId(blockId);
    setS3QualityAlarm(false);
    setS3SelectedFeature(null);
    showToast(`已加载并 fitBounds 标段要素及左右面板数据。`);
  };

  const overview = YEARLY_OVERVIEW[currentYear] || YEARLY_OVERVIEW[2025];
  const countyTasks = COUNTY_TASKS_DATA[currentYear] || COUNTY_TASKS_DATA[2025];

  const currentS3Project = SCREEN3_PROJECTS.find((p) => p.id === s3ProjectId) || SCREEN3_PROJECTS[0];
  const currentS3Area = SCREEN3_AREAS.find((a) => a.id === s3AreaId) || SCREEN3_AREAS[0];
  const currentS3Block = SCREEN3_BLOCKS.find((b) => b.id === s3BlockId) || SCREEN3_BLOCKS[0];

  return (
    <ContainerScale>
      {/* Top Global Screen Mode Indicator Switcher */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 flex items-center bg-[#071329]/95 border border-cyan-500/50 rounded-lg p-0.5 shadow-[0_0_15px_rgba(6,182,212,0.3)] backdrop-blur">
        <button
          onClick={() => setActiveScreen('screen1')}
          className={`px-3 py-1 rounded text-xs font-bold transition-all ${
            activeScreen === 'screen1'
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          一屏 · 监测总览大屏
        </button>
        <button
          onClick={() => setActiveScreen('screen2')}
          className={`px-3 py-1 rounded text-xs font-bold transition-all ${
            activeScreen === 'screen2'
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          二屏 · 项目全过程监管屏
        </button>
        <button
          onClick={() => setActiveScreen('screen3')}
          className={`px-3 py-1 rounded text-xs font-bold transition-all ${
            activeScreen === 'screen3'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-slate-950 shadow-[0_0_12px_rgba(26,200,140,0.5)]'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          三屏 · 标段工程级监管屏
        </button>
      </div>

      {/* ==================== SCREEN 1: MONITORING OVERVIEW ==================== */}
      {activeScreen === 'screen1' && (
        <div className="w-full h-full flex flex-col animate-fade-in">
          <Header
            currentYear={currentYear}
            onYearChange={handleYearChange}
            isRecording={isRecording}
            recordDurationText={recordDurationText}
            isRecordSupported={isRecordSupported}
            onStartRecord={startRecording}
            onStopRecord={stopRecording}
          />

          <div className="flex-1 w-full flex overflow-hidden relative">
            <LeftPanel
              overview={overview}
              countyTasks={countyTasks}
              onOpenProjectList={() => {
                setActiveModalType('project_list');
                setModalData(PROJECT_BLOCKS);
              }}
              onSelectCounty={handleSelectCounty}
              selectedCountyName={selectedCounty}
              isLoading={isYearLoading}
            />

            <MapCenter
              drillLevel={drillLevel}
              selectedCity={selectedCity}
              selectedCounty={selectedCounty}
              selectedBlockId={selectedBlockId}
              highlightedBlockId={highlightedBlockId}
              activeTrackId={activeTrackId}
              activeCallingPersonnel={activeCallingPersonnel}
              onDrillChange={handleDrillChange}
              onSelectBlock={handleSelectBlock}
              onOpenBlockDetail={(block) => navigateToProjectScreen2(block)}
              onOpenInspectionDetail={(record) => {
                setActiveModalType('inspection_detail');
                setModalData(record);
                setSelectedBlockId(record.projectId);
              }}
              onCloseTrackPlayback={() => setActiveTrackId(null)}
            />

            <RightPanel
              blocks={PROJECT_BLOCKS}
              inspections={INSPECTION_RECORDS}
              personnelList={PERSONNEL_DUTY_LIST}
              acceptanceQueue={ACCEPTANCE_QUEUE}
              selectedBlockId={selectedBlockId}
              onSelectBlock={handleSelectBlock}
              onOpenOverdueModal={(block) => {
                setActiveModalType('overdue_analysis');
                setModalData(block);
              }}
              onOpenInspectionModal={(record) => {
                setActiveModalType('inspection_detail');
                setModalData(record);
              }}
              onOpenCoverageModal={() => {
                setActiveModalType('coverage_detail');
                setModalData(null);
              }}
              onOpenAcceptanceListModal={() => {
                setActiveModalType('acceptance_list');
                setModalData(ACCEPTANCE_QUEUE);
              }}
              onStartTrackPlayback={handleStartTrackPlayback}
              onStartBodycamCall={handleStartBodycamCall}
              onLocatePersonnelGrid={(person) => {
                if (person.district.includes('梨树')) {
                  handleDrillChange('county', '四平市', '梨树县', null);
                } else if (person.district.includes('农安')) {
                  handleDrillChange('county', '长春市', '农安县', null);
                } else if (person.district.includes('镇赉')) {
                  handleDrillChange('county', '白城市', '镇赉县', null);
                }
                showToast(`已在地图上高亮 ${person.name} 负责的网格。`);
              }}
            />
          </div>
        </div>
      )}

      {/* ==================== SCREEN 2: PROJECT SUPERVISION ==================== */}
      {activeScreen === 'screen2' && (
        <div className="w-full h-full flex flex-col animate-fade-in">
          <HeaderScreen2
            currentProject={currentProject}
            onSelectProject={(p) => {
              setCurrentProject(p);
              showToast(`已切换至【${p.name}】监管视图。`);
            }}
            onBackToOverview={navigateBackToOverview}
            isRecording={isRecording}
            recordDurationText={recordDurationText}
            isRecordSupported={isRecordSupported}
            onStartRecord={startRecording}
            onStopRecord={stopRecording}
          />

          <div className="flex-1 w-full flex overflow-hidden relative">
            <LeftPanelScreen2
              project={currentProject}
              onFlashAllParcels={() => {
                setIsFlashingParcels(true);
                showToast('已在地图高亮并闪烁全部 8 个图斑！');
                setTimeout(() => setIsFlashingParcels(false), 2800);
              }}
              onOpenStatusFlowModal={() => setIsStatusFlowOpen(true)}
              onOpenVillagesModal={() => setIsVillagesOpen(true)}
              onOpenPaymentDetailModal={(payment) => setActivePaymentForModal(payment)}
              onOpenContractorModal={(contractor) => setActiveContractorForModal(contractor)}
              onOpenContractorDutyModal={(contractor) => setActiveContractorForModal(contractor)}
            />

            <CenterMapScreen2
              project={currentProject}
              highlightedSubEngineering={highlightedSubEngineering}
              onOpenParcelModal={(parcel) => setActiveParcelForModal(parcel)}
              onOpenCctvModal={(cam) => setActiveCameraForModal(cam)}
              onOpenMilestoneModal={(node) => setActiveMilestoneForModal(node)}
              isFlashingParcels={isFlashingParcels}
            />

            <RightPanelScreen2
              highlightedSubEngineering={highlightedSubEngineering}
              onToggleSubEngineeringHighlight={(type) => {
                if (highlightedSubEngineering === type) {
                  setHighlightedSubEngineering(null);
                  showToast('已恢复全分项工程图层显示。');
                } else {
                  setHighlightedSubEngineering(type);
                  showToast(`地图已高亮当前分项工程。`);
                }
              }}
              onOpenSubEngineeringListModal={() => setIsSubEngineeringListOpen(true)}
              onOpenIssueDetailModal={(issue) => setActiveIssueForModal(issue)}
              onOpenFunnelStageModal={(stageName, count) => {
                showToast(`当前处于【${stageName}】阶段的问题共有 ${count} 项。`);
              }}
              onOpenArchivePreviewModal={(arc) => setActiveArchiveForModal(arc)}
              onOpenAcceptanceWorkflowModal={() => {
                showToast('项目已进入县级初验筹备环节。');
              }}
            />
          </div>
        </div>
      )}

      {/* ==================== SCREEN 3: ENGINEERING GIS SUPERVISION ==================== */}
      {activeScreen === 'screen3' && (
        <div className="w-full h-full flex flex-col bg-[#02180d] animate-fade-in relative overflow-hidden">
          {/* Screen 3 Header */}
          <HeaderScreen3
            project={currentS3Project}
            block={currentS3Block}
            onBackToOverview={() => setActiveScreen('screen1')}
            onBackToProjectScreen2={() => setActiveScreen('screen2')}
            isRecording={isRecording}
            recordDurationText={recordDurationText}
            isRecordSupported={isRecordSupported}
            onStartRecord={startRecording}
            onStopRecord={stopRecording}
          />

          {/* Central Fullscreen GIS Map */}
          <div className="flex-1 w-full h-full relative overflow-hidden">
            <MapScreen3
              area={currentS3Area}
              block={currentS3Block}
              statusFilters={s3StatusFilters}
              showQualityAlarm={s3QualityAlarm}
              showMissingPhotos={s3MissingPhotos}
              showPlanningArea={s3PlanningArea}
              showRefNames={s3RefNames}
              selectedCategory={s3Category}
              selectedJlTrack={s3JlTrack}
              selectedJgTrack={s3JgTrack}
              isRightDrawerOpen={isS3DrawerOpen}
              selectedFeature={s3SelectedFeature}
              onSelectFeature={(feat) => setS3SelectedFeature(feat)}
              onOpenQualityDetailModal={(rec, feat) => {
                setS3InspectionModalRecord(rec);
                setS3InspectionModalFeature(feat);
              }}
              onOpenProcessPhotosModal={(step) => setS3ProcessPhotosStep(step)}
              onOpenMissingPhotosModal={(feat) => setS3MissingPhotosFeature(feat)}
            />

            {/* Left Drawer Panel (§3) */}
            <LeftDrawerScreen3
              isOpen={isS3DrawerOpen}
              statusFilters={s3StatusFilters}
              onToggleStatusFilter={(key) =>
                setS3StatusFilters((prev) => ({ ...prev, [key]: !prev[key] }))
              }
              onToggleAllStatus={(selectAll) =>
                setS3StatusFilters({
                  completed: selectAll,
                  constructing: selectAll,
                  notStarted: selectAll,
                })
              }
              showQualityAlarm={s3QualityAlarm}
              onToggleQualityAlarm={() => {
                setS3QualityAlarm(!s3QualityAlarm);
                showToast(
                  s3QualityAlarm
                    ? '已关闭质量巡查待整改告警闪动。'
                    : '已开启质量巡查待整改告警！不合格工程正以 800ms 红色高亮闪动。'
                );
              }}
              showMissingPhotos={s3MissingPhotos}
              onToggleMissingPhotos={() => {
                setS3MissingPhotos(!s3MissingPhotos);
                showToast(
                  s3MissingPhotos
                    ? '已关闭拍照遗漏预警。'
                    : '已开启现场拍照遗漏预警动态标注。'
                );
              }}
              showPlanningArea={s3PlanningArea}
              onTogglePlanningArea={() => setS3PlanningArea(!s3PlanningArea)}
              showRefNames={s3RefNames}
              onToggleRefNames={() => setS3RefNames(!s3RefNames)}
              selectedCategory={s3Category}
              onSelectCategory={(cat) => setS3Category(cat)}
              onStartVideoCall={(person) =>
                setS3TrtcCallTarget({
                  name: person.name,
                  role: person.roleTitle,
                  phone: person.phone,
                })
              }
              onViewTrajectory={(person) => {
                setS3JlTrack('track-jl-01');
                showToast(`已在地图上叠加 ${person.name} 今日巡查轨迹路线。`);
              }}
              onOpenLiveVideo={(person) => {
                showToast(`正在拉取 ${person.name} 单兵执法仪实时监控流...`);
              }}
              selectedJlTrack={s3JlTrack}
              onSelectJlTrack={(track) => setS3JlTrack(track)}
              selectedJgTrack={s3JgTrack}
              onSelectJgTrack={(track) => setS3JgTrack(track)}
            />

            {/* Right Drawer Panel (§6) */}
            <RightDrawerScreen3
              isOpen={isS3DrawerOpen}
              project={currentS3Project}
              area={currentS3Area}
              block={currentS3Block}
              features={SCREEN3_GIS_FEATURES}
              onFlyToFeature={(feat) => {
                setS3SelectedFeature(feat);
                showToast(`已定位到【${feat.RefName}】并打开标段工序浮层。`);
              }}
              onStartWorkerVideoCall={(worker) =>
                setS3TrtcCallTarget({
                  name: worker.name,
                  role: `${worker.teamName} · ${worker.role}`,
                  phone: worker.phone,
                })
              }
              onPushDatabase={handleS3PushDatabase}
              isPushingDb={s3IsPushingDb}
            />
          </div>

          {/* Bottom Five-Level Cascading Filter Bar (§2) */}
          <BottomFilterBar
            selectedYear={s3Year}
            selectedProjectType={s3ProjectType}
            selectedProjectId={s3ProjectId}
            selectedAreaId={s3AreaId}
            selectedBlockId={s3BlockId}
            isDrawerOpen={isS3DrawerOpen}
            onToggleDrawer={() => setIsS3DrawerOpen(!isS3DrawerOpen)}
            onYearChange={handleS3YearChange}
            onProjectTypeChange={handleS3ProjectTypeChange}
            onProjectChange={handleS3ProjectChange}
            onAreaChange={handleS3AreaChange}
            onBlockChange={handleS3BlockChange}
          />
        </div>
      )}

      {/* ==================== GLOBAL MODALS & POPUPS ==================== */}
      {/* 1. Bodycam Video Call Modal (Screen 1 & 2) */}
      {activeCallingPersonnel && (
        <BodycamModal
          personnel={activeCallingPersonnel}
          isOpen={isBodycamOpen}
          onClose={() => {
            setIsBodycamOpen(false);
            setActiveCallingPersonnel(null);
          }}
          onCallEndedToast={showToast}
        />
      )}

      {/* 2. Screen 1 Detail Modal */}
      <DetailModal
        type={activeModalType}
        data={modalData}
        isOpen={!!activeModalType}
        onClose={() => {
          setActiveModalType(null);
          setModalData(null);
        }}
        onStartTrackPlayback={handleStartTrackPlayback}
        onStartBodycamCall={handleStartBodycamCall}
        onSelectProjectOnMap={handleSelectBlock}
      />

      {/* 3. Screen 2: Parcel Before-After Slider Reveal Modal */}
      <ParcelBeforeAfterModal
        parcel={activeParcelForModal}
        isOpen={!!activeParcelForModal}
        onClose={() => setActiveParcelForModal(null)}
      />

      {/* 4. Screen 2: Issue Resolution Flow Modal */}
      <IssueDetailModal
        issue={activeIssueForModal}
        isOpen={!!activeIssueForModal}
        onClose={() => setActiveIssueForModal(null)}
        onStartBodycamCall={() => {
          const person = PERSONNEL_DUTY_LIST[0];
          handleStartBodycamCall(person);
        }}
        onShowToast={showToast}
      />

      {/* 5. Screen 2: CCTV PTZ Camera Stream Modal */}
      <CctvModal
        camera={activeCameraForModal}
        isOpen={!!activeCameraForModal}
        onClose={() => setActiveCameraForModal(null)}
        onShowToast={showToast}
      />

      {/* 6. Screen 2: Archive Preview Modal */}
      <ArchivePreviewModal
        archive={activeArchiveForModal}
        isOpen={!!activeArchiveForModal}
        onClose={() => setActiveArchiveForModal(null)}
      />

      {/* 7. Screen 2 Auxiliary Modals */}
      <StatusFlowModal
        isOpen={isStatusFlowOpen}
        onClose={() => setIsStatusFlowOpen(false)}
      />
      <VillagesModal
        isOpen={isVillagesOpen}
        onClose={() => setIsVillagesOpen(false)}
      />
      <PaymentDetailModal
        payment={activePaymentForModal}
        isOpen={!!activePaymentForModal}
        onClose={() => setActivePaymentForModal(null)}
      />
      <MilestoneDetailModal
        node={activeMilestoneForModal}
        isOpen={!!activeMilestoneForModal}
        onClose={() => setActiveMilestoneForModal(null)}
      />
      <SubEngineeringListModal
        isOpen={isSubEngineeringListOpen}
        onClose={() => setIsSubEngineeringListOpen(false)}
      />
      <ContractorDutyModal
        contractor={activeContractorForModal}
        isOpen={!!activeContractorForModal}
        onClose={() => setActiveContractorForModal(null)}
      />

      {/* 8. Screen 3 Modals (§5.4 & §3.3 & §3.7) */}
      <QualityInspectionDetailModal
        isOpen={!!s3InspectionModalRecord}
        record={s3InspectionModalRecord}
        feature={s3InspectionModalFeature}
        onClose={() => {
          setS3InspectionModalRecord(null);
          setS3InspectionModalFeature(null);
        }}
      />
      <ProcessPhotosModal
        isOpen={!!s3ProcessPhotosStep}
        step={s3ProcessPhotosStep}
        onClose={() => setS3ProcessPhotosStep(null)}
      />
      <MissingPhotosAlertModal
        isOpen={!!s3MissingPhotosFeature}
        feature={s3MissingPhotosFeature}
        onClose={() => setS3MissingPhotosFeature(null)}
      />
      <TrtcVideoCallModal
        isOpen={!!s3TrtcCallTarget}
        targetName={s3TrtcCallTarget?.name || ''}
        targetRole={s3TrtcCallTarget?.role || ''}
        targetPhone={s3TrtcCallTarget?.phone || ''}
        onClose={() => setS3TrtcCallTarget(null)}
      />

      {/* 9. Screen Recording Ready Modal */}
      <RecordReadyModal
        result={recordedResult}
        isOpen={!!recordedResult}
        onClose={clearRecordedResult}
        onRecordAgain={() => {
          clearRecordedResult();
          startRecording();
        }}
      />

      {/* 10. Global Toast Message */}
      {toastMessage && (
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-lg bg-sky-950/95 border border-cyan-400 text-cyan-200 text-xs shadow-2xl backdrop-blur flex items-center gap-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 11. Recording Error Toast */}
      {recordError && (
        <div className="absolute top-16 right-8 z-50 px-4 py-2 rounded-lg bg-rose-950/95 border border-rose-500 text-rose-200 text-xs shadow-2xl backdrop-blur">
          {recordError}
        </div>
      )}
    </ContainerScale>
  );
}
