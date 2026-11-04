/**
 * Farmland Construction Supervision Screen (Screen 2) - Type Definitions
 */

export interface ProjectParcel {
  id: string;
  code: string; // e.g. TB-2025-01
  name: string;
  area: number; // 亩
  cropType: string; // 优质强筋小麦 / 粮油轮作 / 玉米
  status: 'completed' | 'constructing' | 'not_started'; // 已完工 / 施工中 / 未开工
  progress: number; // %
  contractor: string;
  svgPolygon: string;
  center: [number, number];
  subEngineering: {
    landLeveling: number;
    irrigation: number;
    roads: number;
    shelterbelts: number;
  };
  soilQualityBefore: string;
  soilQualityAfter: string;
}

export interface SubEngineeringItem {
  id: string;
  type: 'leveling' | 'irrigation' | 'roads' | 'shelterbelts';
  name: string;
  unit: string;
  plannedAmount: number;
  completedAmount: number;
  progress: number;
  status: 'normal' | 'lagging';
  lagReason?: string;
  svgLayerType: 'polygon' | 'polyline' | 'points';
  units: {
    id: string;
    unitName: string;
    target: string;
    status: 'completed' | 'constructing' | 'pending';
    progress: number;
  }[];
}

export interface MonthlyPayment {
  month: string;
  amount: number; // 万元
  cumulativeAmount: number;
  items: {
    title: string;
    recipient: string;
    date: string;
    amount: number;
    invoiceNo: string;
  }[];
}

export interface ContractorEntity {
  role: 'construction_lead' | 'contractor' | 'supervisor' | 'designer';
  roleName: string;
  companyName: string;
  qualification: string;
  leader: string;
  phone: string;
  dutyRecords: {
    id: string;
    date: string;
    time: string;
    location: string;
    content: string;
    photoUrl: string;
  }[];
}

export interface MilestoneNode {
  id: string;
  name: string;
  planDate: string;
  actualDate?: string;
  status: 'completed' | 'in_progress' | 'delayed' | 'pending';
  docNumber?: string;
  approvalUnit?: string;
  desc?: string;
  responsibleLead?: string;
  pendingTasks?: string[];
}

export interface GanttPeriod {
  planStart: string;
  planEnd: string;
  actualStart: string;
  actualEnd?: string;
  isDelayed: boolean;
  delayDays: number;
}

export interface QualityIssueItem {
  id: string;
  time: string;
  date: string;
  location: string;
  coord: [number, number];
  issueTitle: string;
  issueDesc: string;
  responsibleCompany: string;
  responsiblePerson: string;
  responsiblePhone: string;
  deadline: string;
  status: 'to_assign' | 'rectifying' | 'to_review' | 'closed' | 'rejected';
  stage: 'found' | 'assigned' | 'rectified' | 'reviewed';
  photoBefore: string;
  photoAfter?: string;
  remindCount: number;
  timeline: {
    stage: string;
    time: string;
    operator: string;
    note: string;
  }[];
}

export interface SurveillanceCamera {
  id: string;
  name: string;
  location: string;
  coord: [number, number];
  status: 'online' | 'offline';
  ipAddress: string;
  streamUrl: string;
  type: 'ptz_dome' | 'fixed_bullet'; // 球机（带云台） / 枪机
  bitrate: string;
  fps: number;
}

export interface ProjectArchiveItem {
  id: string;
  category: string;
  title: string;
  isArchived: boolean;
  fileType: 'pdf' | 'dwg' | 'doc';
  archiveDate?: string;
  fileSize?: string;
  responsiblePerson: string;
  missingReason?: string;
}
