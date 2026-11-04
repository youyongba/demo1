/**
 * Farmland Construction Supervision Screen 3 (Engineering GIS Screen) - Type Definitions
 */

export interface FilterYear {
  id: string;
  name: string;
}

export interface FilterProjectType {
  id: string;
  name: string;
  code: string;
}

export interface FilterProject {
  id: string;
  name: string;
  typeId: string;
  year: string;
  money: number; // 万元
  projectAreaCount: number;
  blockCount: number;
  actualPercent: number;
}

export interface FilterProjectArea {
  id: string;
  name: string;
  projectId: string;
  blockCount: number;
  money: number; // 万元
  actualPercent: number;
  center: [number, number];
  svgPath: string;
}

export interface FilterBlock {
  id: string;
  name: string;
  areaId: string;
  projectId: string;
  money: number; // 元
  actualPercent: number;
  isExistsBlockInfo?: boolean;
  contractor: string;
  supervisor: string;
}

export interface BlockGisFeature {
  id: string;
  WYBM: string; // 唯一编码
  RefName: string; // 工程/构筑物名称
  gclb: string; // 工程类别 (土地平整 / 灌排渠道 / 节水喷灌 / 田间道路 / 泵站涵闸)
  constructionStatus: 0 | 1 | 2; // 0: 未进场, 1: 施工中, 2: 已完工
  actualPercent: number; // 进度 %
  actualAmount: number; // 投入额 (元)
  planWarn: 0 | 1 | 2; // 0 正常 / 1 延期 / 2 过快
  qualityRating: '合格' | '优质' | '待整改';
  inputWarn: 0 | 1 | 2;
  hasQualityAlarm?: boolean; // 是否存在质量巡查待整改
  hasMissingPhoto?: boolean; // 是否存在拍照遗漏
  missingPhotos?: string[]; // 遗漏拍照工序
  svgPath: string;
  center: [number, number];
  coordType: 'polygon' | 'polyline' | 'point';
  processes: ProcessStep[];
  inspectionRecords: Screen3Inspection[];
}

export interface ProcessStep {
  id: string;
  name: string;
  status: 'uploaded' | 'overdue_risk' | 'pending';
  createTime?: string;
  photos?: string[];
  inspector?: string;
}

export interface Screen3Inspection {
  id: string;
  createTime: string;
  inspectorName: string;
  inspectorRole: string;
  isStandard: boolean; // 合格 / 不合格
  statusStr: string;
  constructionProgress: string;
  evaluationCategory: string;
  evaluationDesc: string;
  issuePhotos: string[];
  constructionPhotos: string[];
}

export interface ManagementPersonnel {
  id: string;
  name: string;
  role: 'jl' | 'jg'; // 监理 / 监管
  roleTitle: string;
  phone: string;
  deviceCode: string;
  isOnline: boolean;
  avatarUrl?: string;
}

export interface ConstructionWorker {
  id: string;
  name: string;
  teamName: string;
  role: string;
  phone: string;
  deviceCode: string;
  isOnline: boolean;
}

export interface ConstructionContentVo {
  id: string;
  name: string;
  unit: string;
  totalQuantity: number;
  completedQuantity: number;
  percent: number;
}
