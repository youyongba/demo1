import {
  FilterYear,
  FilterProjectType,
  FilterProject,
  FilterProjectArea,
  FilterBlock,
  BlockGisFeature,
  ManagementPersonnel,
  ConstructionWorker,
  ConstructionContentVo,
} from '../types/screen3Types';
import { DETAIL_IMAGES } from './projectDetailData';

export const SCREEN3_YEARS: FilterYear[] = [
  { id: '2025', name: '2025 年度' },
  { id: '2024', name: '2024 年度' },
  { id: '2023', name: '2023 年度' },
];

export const SCREEN3_PROJECT_TYPES: FilterProjectType[] = [
  { id: 'pt-01', name: '高标准农田新建项目', code: 'NEW_CONSTRUCT' },
  { id: 'pt-02', name: '高标准农田改造提升', code: 'UPGRADE' },
  { id: 'pt-03', name: '东北黑土地保护性耕作', code: 'BLACK_SOIL' },
  { id: 'pt-04', name: '盐碱地综合改造提质', code: 'SALINE_LAND' },
];

export const SCREEN3_PROJECTS: FilterProject[] = [
  {
    id: '20',
    name: '四平市梨树县孤家子镇国家黑土地保护示范片区高标准农田建设项目',
    typeId: 'pt-03',
    year: '2025',
    money: 3125,
    projectAreaCount: 3,
    blockCount: 4,
    actualPercent: 74,
  },
  {
    id: '21',
    name: '梨树县十家堡镇绿色高产黑土地建设示范区',
    typeId: 'pt-03',
    year: '2025',
    money: 2100,
    projectAreaCount: 2,
    blockCount: 3,
    actualPercent: 100,
  },
  {
    id: '22',
    name: '农安县靠山镇粮食绿色高质高效示范区',
    typeId: 'pt-01',
    year: '2025',
    money: 4500,
    projectAreaCount: 4,
    blockCount: 5,
    actualPercent: 82,
  },
];

export const SCREEN3_AREAS: FilterProjectArea[] = [
  {
    id: 'area-01',
    name: '孤家子一片区 (万亩高产核心攻关区)',
    projectId: '20',
    blockCount: 4,
    money: 1680,
    actualPercent: 78,
    center: [420, 290],
    svgPath: 'M 160 120 L 680 130 L 670 470 L 150 460 Z',
  },
  {
    id: 'area-02',
    name: '孤家子二片区 (节水微滴灌先行试验区)',
    projectId: '20',
    blockCount: 3,
    money: 865,
    actualPercent: 68,
    center: [380, 260],
    svgPath: 'M 180 140 L 590 145 L 580 440 L 170 430 Z',
  },
  {
    id: 'area-03',
    name: '孤家子三片区 (辽河沿岸沉沙排渍区)',
    projectId: '20',
    blockCount: 2,
    money: 580,
    actualPercent: 72,
    center: [450, 310],
    svgPath: 'M 200 160 L 620 170 L 610 450 L 190 440 Z',
  },
];

export const SCREEN3_BLOCKS: FilterBlock[] = [
  {
    id: 'blk-01',
    name: '一标段 (黑土深松与激光格田平整工程)',
    areaId: 'area-01',
    projectId: '20',
    money: 8200000,
    actualPercent: 88,
    isExistsBlockInfo: true,
    contractor: '吉林省水利水电工程局集团有限公司 (农建一部)',
    supervisor: '吉林省农业工程建设监理咨询有限公司',
  },
  {
    id: 'blk-02',
    name: '二标段 (骨干排灌防冻防渗渠系与节制闸工程)',
    areaId: 'area-01',
    projectId: '20',
    money: 9450000,
    actualPercent: 72,
    isExistsBlockInfo: true,
    contractor: '吉林省水利水电工程局集团有限公司 (水利渠道二部)',
    supervisor: '吉林省农业工程建设监理咨询有限公司',
  },
  {
    id: 'blk-03',
    name: '三标段 (智能水肥一体化泵房与墒情站)',
    areaId: 'area-01',
    projectId: '20',
    money: 6800000,
    actualPercent: 65,
    isExistsBlockInfo: true,
    contractor: '吉林省智慧农田物联科技有限公司',
    supervisor: '长春建工工程监理咨询有限公司',
  },
  {
    id: 'blk-04',
    name: '四标段 (田间重型机耕路网与三北防护林)',
    areaId: 'area-01',
    projectId: '20',
    money: 6800000,
    actualPercent: 60,
    isExistsBlockInfo: true,
    contractor: '四平市水利市政建筑安装总公司',
    supervisor: '吉林省农业工程建设监理咨询有限公司',
  },
];

// Block GIS Features (WFS vector elements for Screen 3 in Jilin Lishu)
export const SCREEN3_GIS_FEATURES: BlockGisFeature[] = [
  {
    id: 'feat-01',
    WYBM: 'GC-2025-JL-SP-01',
    RefName: '孤家子东支干渠现浇防冻混凝土防渗渠 (K0+000~K2+500)',
    gclb: '灌排渠道',
    constructionStatus: 2, // 已完工 (#FF5CC4)
    actualPercent: 100,
    actualAmount: 2650000,
    planWarn: 0,
    qualityRating: '优质',
    inputWarn: 0,
    coordType: 'polyline',
    svgPath: 'M 210 160 L 360 170 L 510 180 L 660 190',
    center: [435, 175],
    processes: [
      { id: 'p-1', name: '渠槽土方开挖与抗冻修坡', status: 'uploaded', createTime: '2024-11-15 10:20', photos: [DETAIL_IMAGES.droneInspection], inspector: '程明道 (总监)' },
      { id: 'p-2', name: '原土夯实与压实度环刀取样', status: 'uploaded', createTime: '2024-12-02 14:10', photos: [DETAIL_IMAGES.droneInspection], inspector: '张建军 (质检)' },
      { id: 'p-3', name: '高密度聚乙烯抗冻防渗土工膜铺设', status: 'uploaded', createTime: '2025-01-18 16:30', photos: [DETAIL_IMAGES.afterConsolidation], inspector: '刘伟 (巡查员)' },
      { id: 'p-4', name: 'C25抗冻混凝土现浇衬砌机械振捣', status: 'uploaded', createTime: '2025-03-22 09:45', photos: [DETAIL_IMAGES.afterConsolidation], inspector: '程明道 (总监)' },
      { id: 'p-5', name: '耐低温伸缩缝填塞与春灌试压初验', status: 'uploaded', createTime: '2025-04-10 15:00', photos: [DETAIL_IMAGES.afterConsolidation], inspector: '马培峰 (科长)' },
    ],
    inspectionRecords: [
      {
        id: 'ins-s3-01',
        createTime: '2025-04-12 11:00',
        inspectorName: '程明道',
        inspectorRole: '总监理工程师',
        isStandard: true,
        statusStr: '合格 (工程质量评定优良)',
        constructionProgress: '100% (衬砌全线通水无渗漏无冻融鼓泡)',
        evaluationCategory: '现浇防渗渠几何尺寸及平整度',
        evaluationDesc: '抽查20个断面的顶宽、底宽及抗冻壁厚，偏差均在±5mm规范允许内，渠面压光密实。',
        issuePhotos: [],
        constructionPhotos: [DETAIL_IMAGES.afterConsolidation],
      },
    ],
  },
  {
    id: 'feat-02',
    WYBM: 'GC-2025-JL-SP-02',
    RefName: '孤家子中街2号灌排水肥一体化主控泵房',
    gclb: '泵站涵闸',
    constructionStatus: 1, // 施工中 (#FDF652)
    actualPercent: 78,
    actualAmount: 1850000,
    planWarn: 0,
    qualityRating: '待整改',
    inputWarn: 0,
    hasQualityAlarm: true, // 质量巡查告警 (闪动)
    coordType: 'point',
    svgPath: 'M 350 210 L 390 210 L 390 245 L 350 245 Z',
    center: [370, 227],
    processes: [
      { id: 'p-6', name: '泵房钢筋混凝土独立抗冻基础浇筑', status: 'uploaded', createTime: '2025-02-10 10:00', photos: [DETAIL_IMAGES.pumpStation], inspector: '程明道' },
      { id: 'p-7', name: '深井潜水混流高效离心水泵吊装就位', status: 'uploaded', createTime: '2025-03-15 14:00', photos: [DETAIL_IMAGES.pumpStation], inspector: '刘伟' },
      { id: 'p-8', name: '电气主控柜配线与接地防雷网焊接', status: 'overdue_risk', createTime: undefined, inspector: '待整改复验' },
      { id: 'p-9', name: '智能变频恒压水肥一体系统带载试车', status: 'pending', createTime: undefined },
    ],
    inspectionRecords: [
      {
        id: 'ins-s3-02',
        createTime: '2025-05-18 14:25',
        inspectorName: '刘伟',
        inspectorRole: '网格巡查员 (水利农建组)',
        isStandard: false,
        statusStr: '不合格待整改 (存在中危安全用电隐患)',
        constructionProgress: '78% (设备就位，配电接线整改中)',
        evaluationCategory: '机电设备安装接地及相序保护',
        evaluationDesc: '2号泵站主配电箱内强弱电电缆同槽交叉且无绝缘隔离层，外壳保护接地镀锌扁钢松动，责令4日内整改复查。',
        issuePhotos: [DETAIL_IMAGES.pumpStation],
        constructionPhotos: [DETAIL_IMAGES.pumpStation],
      },
    ],
  },
  {
    id: 'feat-03',
    WYBM: 'GC-2025-JL-SP-03',
    RefName: '八里庙万亩连片黑土地梨树模式深松整平区',
    gclb: '土地平整',
    constructionStatus: 1, // 施工中 (#FDF652)
    actualPercent: 85,
    actualAmount: 3200000,
    planWarn: 0,
    qualityRating: '合格',
    inputWarn: 0,
    hasMissingPhoto: true, // 预警信息: 拍照遗漏
    missingPhotos: ['大功率深松破除犁底层工序未上传作业照片 (2025-05-12)', '北斗激光平地机作业轨迹水平校核记录缺图 (2025-05-14)'],
    coordType: 'polygon',
    svgPath: 'M 220 250 L 480 255 L 470 380 L 210 370 Z',
    center: [345, 315],
    processes: [
      { id: 'p-10', name: '秸秆粉碎全量均匀覆盖还田作业', status: 'uploaded', createTime: '2024-11-20 09:30', photos: [DETAIL_IMAGES.beforeConsolidation], inspector: '宋振华' },
      { id: 'p-11', name: '大马力深松整地达35cm打破犁底层', status: 'uploaded', createTime: '2024-12-15 15:20', photos: [DETAIL_IMAGES.beforeConsolidation], inspector: '刘伟' },
      { id: 'p-12', name: '北斗卫星定位激光整平仪格田精细整平', status: 'uploaded', createTime: '2025-04-05 11:10', photos: [DETAIL_IMAGES.afterConsolidation], inspector: '程明道' },
      { id: 'p-13', name: '生物腐熟有机菌肥增施与土壤培厚', status: 'overdue_risk', createTime: undefined },
    ],
    inspectionRecords: [
      {
        id: 'ins-s3-03',
        createTime: '2025-05-10 16:00',
        inspectorName: '马培峰',
        inspectorRole: '县农建科长',
        isStandard: true,
        statusStr: '合格 (地表相对高差小于3cm)',
        constructionProgress: '85% (田块规整，支持300马力以上农机并联作业)',
        evaluationCategory: '格田激光平整度检测',
        evaluationDesc: '全区设置50个标高测点，实测格田高差极值不超过2.6cm，达到国家黑土地保护高产农田平整规范。',
        issuePhotos: [],
        constructionPhotos: [DETAIL_IMAGES.afterConsolidation],
      },
    ],
  },
  {
    id: 'feat-04',
    WYBM: 'GC-2025-JL-SP-04',
    RefName: '5.0米宽主干贯通式C25抗冻耐久混凝土机耕道',
    gclb: '田间道路',
    constructionStatus: 1, // 施工中 (#FDF652)
    actualPercent: 62,
    actualAmount: 1980000,
    planWarn: 1, // 延期预警
    qualityRating: '合格',
    inputWarn: 0,
    coordType: 'polyline',
    svgPath: 'M 215 365 L 350 370 L 490 375 L 630 380',
    center: [422, 372],
    processes: [
      { id: 'p-14', name: '黑土路基素土开挖平整与重型碾压', status: 'uploaded', createTime: '2024-12-10 14:00', photos: [DETAIL_IMAGES.droneInspection], inspector: '宋海峰' },
      { id: 'p-15', name: '18cm厚水泥稳定碎石抗冻底基层铺设', status: 'uploaded', createTime: '2025-03-08 10:30', photos: [DETAIL_IMAGES.droneInspection], inspector: '程明道' },
      { id: 'p-16', name: '20cm厚C25水泥混凝土抗冻面层浇筑', status: 'overdue_risk', createTime: undefined },
      { id: 'p-17', name: '防冻切缝填塞沥青胶与土工毡保水养护', status: 'pending', createTime: undefined },
    ],
    inspectionRecords: [],
  },
  {
    id: 'feat-05',
    WYBM: 'GC-2025-JL-SP-05',
    RefName: '后林海三北防风固沙双排樟子松+小叶杨林网',
    gclb: '节水喷灌',
    constructionStatus: 0, // 未进场 (#F09035)
    actualPercent: 25,
    actualAmount: 540000,
    planWarn: 0,
    qualityRating: '合格',
    inputWarn: 1,
    coordType: 'polygon',
    svgPath: 'M 495 240 L 650 245 L 640 370 L 485 365 Z',
    center: [565, 305],
    processes: [
      { id: 'p-18', name: '防护林带定点放线与抗冻坑槽机械开挖', status: 'uploaded', createTime: '2025-04-18 10:00', photos: [DETAIL_IMAGES.droneInspection], inspector: '刘伟' },
      { id: 'p-19', name: '耐寒樟子松优质二级壮苗进场植物检疫', status: 'overdue_risk', createTime: undefined },
      { id: 'p-20', name: '苗木栽植回填培土与封窝防冻水浇灌', status: 'pending', createTime: undefined },
    ],
    inspectionRecords: [],
  },
  {
    id: 'feat-06',
    WYBM: 'GC-2025-JL-SP-06',
    RefName: '东辽河支干渠自动化钢闸门涵闸与排涝溢流堰',
    gclb: '泵站涵闸',
    constructionStatus: 2, // 已完工 (#FF5CC4)
    actualPercent: 100,
    actualAmount: 1120000,
    planWarn: 0,
    qualityRating: '优质',
    inputWarn: 0,
    coordType: 'point',
    svgPath: 'M 500 170 L 535 170 L 535 200 L 500 200 Z',
    center: [517, 185],
    processes: [
      { id: 'p-21', name: '基础防冲槽干砌块石与防冻护底浇筑', status: 'uploaded', createTime: '2024-12-05 09:30', photos: [DETAIL_IMAGES.pumpStation], inspector: '程明道' },
      { id: 'p-22', name: '涵洞钢筋绑扎与涵身C30砼抗冻浇筑', status: 'uploaded', createTime: '2025-01-22 14:15', photos: [DETAIL_IMAGES.pumpStation], inspector: '程明道' },
      { id: 'p-23', name: '耐低温螺杆式双吊点电动启闭机安装', status: 'uploaded', createTime: '2025-03-30 16:00', photos: [DETAIL_IMAGES.pumpStation], inspector: '马培峰' },
      { id: 'p-24', name: '远程PLC与手机端自动化启闭试车通过', status: 'uploaded', createTime: '2025-04-20 11:00', photos: [DETAIL_IMAGES.pumpStation], inspector: '马培峰' },
    ],
    inspectionRecords: [
      {
        id: 'ins-s3-04',
        createTime: '2025-04-22 15:30',
        inspectorName: '马培峰',
        inspectorRole: '县农建科长',
        isStandard: true,
        statusStr: '合格 (远程自动化启闭试验一次成功)',
        constructionProgress: '100% (涵闸闭水试验无漏水，启闭顺畅)',
        evaluationCategory: '水工建筑物强度与止水性能',
        evaluationDesc: '橡胶止水条压装平整牢固，闭门后渗漏量远低于国家水利规范限值。',
        issuePhotos: [],
        constructionPhotos: [DETAIL_IMAGES.pumpStation],
      },
    ],
  },
];

// Construction Content Vo for Right Panel (6.1, 6.2, 6.3)
export const PROJECT_CONSTRUCTION_CONTENT: ConstructionContentVo[] = [
  { id: 'c-1', name: '黑土地激光平整与深松', unit: '亩', totalQuantity: 12500, completedQuantity: 10625, percent: 85 },
  { id: 'c-2', name: '防冻骨干排灌防渗渠衬砌', unit: 'km', totalQuantity: 42.0, completedQuantity: 30.2, percent: 72 },
  { id: 'c-3', name: '重型农机混凝土机耕主道', unit: 'km', totalQuantity: 18.0, completedQuantity: 10.8, percent: 60 },
  { id: 'c-4', name: '智能变频灌溉主控泵房', unit: '座', totalQuantity: 8, completedQuantity: 6, percent: 75 },
  { id: 'c-5', name: '电控升降防冻节制涵闸', unit: '座', totalQuantity: 16, completedQuantity: 14, percent: 87.5 },
  { id: 'c-6', name: '三北防风林网与生态沟渠', unit: 'km', totalQuantity: 12.0, completedQuantity: 4.8, percent: 40 },
];

export const AREA_CONSTRUCTION_CONTENT: ConstructionContentVo[] = [
  { id: 'ca-1', name: '核心片大条田深松整平', unit: '亩', totalQuantity: 6800, completedQuantity: 5780, percent: 85 },
  { id: 'ca-2', name: '梯形防渗排灌渠道贯通', unit: 'km', totalQuantity: 22.5, completedQuantity: 18.0, percent: 80 },
  { id: 'ca-3', name: '5.0m宽主干农机道', unit: 'km', totalQuantity: 9.5, completedQuantity: 6.2, percent: 65 },
  { id: 'ca-4', name: '智能水肥一体化主控泵房', unit: '座', totalQuantity: 4, completedQuantity: 3, percent: 75 },
];

export const BLOCK_CONSTRUCTION_CONTENT: ConstructionContentVo[] = [
  { id: 'cb-1', name: '格田精细激光整平作业', unit: '亩', totalQuantity: 2150, completedQuantity: 2150, percent: 100 },
  { id: 'cb-2', name: '东支干渠抗冻防渗衬砌', unit: 'km', totalQuantity: 2.5, completedQuantity: 2.5, percent: 100 },
  { id: 'cb-3', name: '2号泵站主配电控制房', unit: '座', totalQuantity: 1, completedQuantity: 0.78, percent: 78 },
  { id: 'cb-4', name: '机耕道抗冻水稳底基层', unit: 'km', totalQuantity: 3.2, completedQuantity: 2.0, percent: 62 },
];

// Management Personnel (3.7) in Jilin Province
export const SCREEN3_MANAGEMENT_PERSONNEL: ManagementPersonnel[] = [
  {
    id: 'mgt-01',
    name: '程明道',
    role: 'jl',
    roleTitle: '总监理工程师 (吉林省农业工程监理)',
    phone: '137-4341-2345',
    deviceCode: 'MCS8-JL-0102',
    isOnline: true,
  },
  {
    id: 'mgt-02',
    name: '张建军',
    role: 'jl',
    roleTitle: '现场水利质监监理员',
    phone: '139-4342-3390',
    deviceCode: 'MCS8-JL-0108',
    isOnline: true,
  },
  {
    id: 'mgt-03',
    name: '马培峰',
    role: 'jg',
    roleTitle: '县农业农村局农建科长 (监管代表)',
    phone: '139-4340-6678',
    deviceCode: 'MCS8-JG-0012',
    isOnline: true,
  },
  {
    id: 'mgt-04',
    name: '刘伟',
    role: 'jg',
    roleTitle: '孤家子片区专职网格巡查长',
    phone: '138-4340-8821',
    deviceCode: 'DSJ-T7-0482',
    isOnline: true,
  },
  {
    id: 'mgt-05',
    name: '宋海峰',
    role: 'jl',
    roleTitle: '四平市道路工程监理工程师',
    phone: '137-4321-7762',
    deviceCode: 'MCS8-JL-0205',
    isOnline: false,
  },
];

// Construction Workers (6.4) in Jilin Province
export const SCREEN3_CONSTRUCTION_WORKERS: ConstructionWorker[] = [
  { id: 'cw-1', name: '宋振华', teamName: '吉林省水利水电工程局孤家子标段总包班组', role: '施工项目经理 (一级建造师)', phone: '138-4348-9901', deviceCode: 'MCS8-SG-01', isOnline: true },
  { id: 'cw-2', name: '王铁柱', teamName: '吉林省水利水电工程局孤家子标段总包班组', role: '渠道浇筑施工作业班长', phone: '139-4344-5511', deviceCode: 'MCS8-SG-02', isOnline: true },
  { id: 'cw-3', name: '刘保国', teamName: '吉林省水利水电工程局孤家子标段总包班组', role: '机电安装与调试工长', phone: '138-4346-4422', deviceCode: 'MCS8-SG-03', isOnline: true },
  { id: 'cw-4', name: '赵振华', teamName: '吉林省水利水电工程局孤家子标段总包班组', role: '道路摊铺与机械班长', phone: '137-4349-3388', deviceCode: 'MCS8-SG-04', isOnline: false },
  { id: 'cw-5', name: '孙德海', teamName: '吉林省水利水电工程局孤家子标段总包班组', role: '大马力激光平地机机手主管', phone: '136-4318-7722', deviceCode: 'MCS8-SG-05', isOnline: true },
];

// Sample Patrol Coordinate Lines for lineLayer (§3.8)
export const SCREEN3_PATROL_LINES = [
  {
    id: 'track-jl-01',
    name: '程明道 (总监) · 今日东支干渠巡查轨迹',
    color: '#06e1f2', // Cyan
    points: [
      [200, 155],
      [280, 162],
      [360, 170],
      [440, 175],
      [520, 180],
      [600, 185],
      [660, 190],
    ],
  },
  {
    id: 'track-jg-01',
    name: '刘伟 (监管) · 2号泵站及连片深松平整田块网格巡查轨迹',
    color: '#fdf652', // Yellow
    points: [
      [340, 205],
      [370, 225],
      [365, 290],
      [340, 320],
      [420, 370],
      [500, 375],
    ],
  },
];
