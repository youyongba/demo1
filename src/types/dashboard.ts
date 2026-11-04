/**
 * Farmland Construction Monitoring Dashboard - Data Type Definitions
 */

export type ProjectStatus = 'completed' | 'constructing' | 'pending_acceptance' | 'overdue';

export type DrillLevel = 'province' | 'city' | 'county' | 'project';

export interface FarmlandOverview {
  completedArea: number; // 已建成 (万亩)
  newAreaThisYear: number; // 今年新增 (万亩)
  countyCount: number; // 涉及县区数
  projectCount: number; // 项目总数
  totalInvestment: number; // 总投资 (万元)
  progressRate: number; // 综合进度 %
}

export interface CountyTask {
  id: string;
  countyName: string;
  cityName: string;
  targetArea: number; // 目标 (万亩)
  completedArea: number; // 完成 (万亩)
  rate: number; // 完成率 %
  isWarning: boolean; // < 50%
  centerCoordinate: [number, number]; // [x, y] in SVG space
}

export interface ProjectBlock {
  id: string;
  code: string; // 如 吉农建-2025-SP0101
  name: string;
  cityName: string;
  countyName: string;
  townName: string;
  area: number; // 亩
  investment: number; // 万元
  status: ProjectStatus;
  progress: number; // 0 - 100
  contractor: string; // 施工单位
  supervisor: string; // 监理单位
  leader: string; // 项目负责人
  startDate: string;
  planEndDate: string;
  actualEndDate?: string;
  overdueDays?: number;
  overdueReason?: string;
  sections: {
    name: string;
    type: string; // 土地平整 / 灌排渠系 / 节水喷灌 / 田间道路
    progress: number;
    status: string;
  }[];
  svgPolygon: string; // SVG path d attribute or polygon points
  center: [number, number]; // [x, y]
  hasInspectionIssue?: boolean;
}

export interface InspectionRecord {
  id: string;
  time: string;
  date: string;
  projectName: string;
  projectId: string;
  inspectorName: string;
  inspectorRole: string;
  issueType: string;
  issueDesc: string;
  status: 'pending' | 'processing' | 'closed'; // 待整改 / 整改中 / 已闭环
  rectifyDeadline: string;
  coordinate: [number, number]; // Map location
  photoUrl: string;
  hasTrack: boolean;
  trackId?: string;
  inspectorPhone?: string;
  inspectorDeviceId?: string;
}

export interface InspectorPersonnel {
  id: string;
  name: string;
  role: 'county_lead' | 'town_officer' | 'grid_inspector'; // 县级负责人 / 乡镇干部 / 网格员
  roleTitle: string;
  district: string;
  avatarUrl: string;
  monthlyInspections: number;
  coverageRate: number; // %
  deviceId: string;
  deviceStatus: 'online' | 'offline' | 'busy';
  battery: number;
  signalStrength: string;
  currentLatLong: string;
  currentMapCoord: [number, number];
  gridPolygon?: string;
}

export interface AcceptanceItem {
  id: string;
  projectName: string;
  projectId: string;
  countyName: string;
  area: number; // 亩
  investment: number; // 万元
  finishDate: string;
  status: 'pending' | 'inspecting' | 'approved';
  overdueDays: number;
  contractor: string;
  score?: number;
}

export interface InspectionTrackPoint {
  id: number;
  time: string;
  x: number;
  y: number;
  isCheckin: boolean;
  checkinTitle?: string;
  checkinDesc?: string;
  checkinPhoto?: string;
}

export interface CityRegion {
  id: string;
  name: string;
  center: [number, number];
  svgPath: string;
  totalArea: number; // 万亩
  completedArea: number;
  projectCount: number;
  counties: CountyRegion[];
}

export interface CountyRegion {
  id: string;
  name: string;
  cityName: string;
  center: [number, number];
  svgPath: string;
  blocks: ProjectBlock[];
}

export interface BodycamCallState {
  isOpen: boolean;
  personnel: InspectorPersonnel | null;
  callStatus: 'calling' | 'connected' | 'ended';
  isMuted: boolean;
  isVideoOn: boolean;
  isPttActive: boolean;
  isRecording: boolean;
  isMinimized: boolean;
  callDuration: number;
  networkQuality: 'excellent' | 'fair' | 'poor';
}
