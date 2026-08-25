import { ContractProjectData, StoredProjectItem, LaborMatrixRow } from '../types';
import { initialProjectData } from '../data/initialData';
import { calculateProjectSummary } from './calculations';

export const PROJECTS_COLLECTION_KEY = 'contractscan_projects_collection_v2';
export const ACTIVE_PROJECT_ID_KEY = 'contractscan_active_project_id_v2';

export const generateProjectId = (): string => {
  return `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
};

export const formatThaiDateTime = (isoDateStr?: string): string => {
  if (!isoDateStr) return '-';
  try {
    const d = new Date(isoDateStr);
    if (isNaN(d.getTime())) return isoDateStr;
    const thaiMonths = [
      'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
      'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ];
    const day = d.getDate();
    const month = thaiMonths[d.getMonth()];
    const year = d.getFullYear() + 543;
    const hours = d.getHours().toString().padStart(2, '0');
    const mins = d.getMinutes().toString().padStart(2, '0');
    return `${day} ${month} ${year} ${hours}:${mins} น.`;
  } catch {
    return isoDateStr;
  }
};

/**
 * Creates a blank new project template
 */
export const createNewBlankProject = (
  projectName = '',
  contractNumber = '',
  organization = ''
): ContractProjectData => {
  const id = generateProjectId();
  const now = new Date().toISOString();
  return {
    ...initialProjectData,
    id,
    updatedAt: now,
    projectName: projectName || 'โครงการใหม่ (ยังไม่ได้ระบุชื่อ)',
    contractNumber: contractNumber || '',
    organization: organization || '',
    docDate: new Date().toISOString().split('T')[0],
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
    totalDurationDays: 90,
  };
};

/**
 * Creates a sample project preloaded with realistic Thai govt road construction sample mock data
 */
export const createSampleProject = (): ContractProjectData => {
  const id = generateProjectId();
  const now = new Date().toISOString();
  return {
    ...initialProjectData,
    id,
    updatedAt: now,
    organization: 'องค์การบริหารส่วนตำบลตัวอย่างพัฒนา',
    docNumber: 'ตย 78201/2567',
    docDate: '2024-08-20',
    subjectWeekly: 'รายงานผลการปฏิบัติงานของผู้ควบคุมงานประจำสัปดาห์',
    subjectMonthly: 'รายงานผลการปฏิบัติงานและติดตามความก้าวหน้าประจำเดือน',
    reportWeekNo: 4,
    periodStart: '2024-08-14',
    periodEnd: '2024-08-20',
    projectName: 'โครงการก่อสร้างถนนคอนกรีตเสริมเหล็ก สายบ้านตัวอย่าง - หนองหว้า หมู่ที่ 4',
    location: 'หมู่ที่ 4 ตำบลตัวอย่างพัฒนา อำเภอเมือง จังหวัดตัวอย่าง',
    contractNumber: '12/2567',
    contractDate: '2024-06-01',
    startDate: '2024-06-05',
    endDate: '2024-09-02',
    totalDurationDays: 90,
    dailyPenaltyRate: 1875,
    budgetYear: '2567',
    totalBudget: 750000,
    contractAmount: 748000,
    disbursedAmount: 224400,
    totalInstallments: 3,
    inspectedInstallments: 1,
    dimensionWidth: '5.00',
    dimensionLength: '850.00',
    dimensionThickness: '0.15',
    dimensionArea: '4,250.00',
    scopeSummary: 'ก่อสร้างถนนคอนกรีตเสริมเหล็ก กว้าง 5.00 เมตร ยาว 850.00 เมตร หนา 0.15 เมตร หรือมีพื้นที่คอนกรีตไม่น้อยกว่า 4,250 ตร.ม. พร้อมไหล่ทางหินคลุกข้างละ 0.50 เมตร และป้ายประชาสัมพันธ์โครงการ',
    employerName: 'องค์การบริหารส่วนตำบลตัวอย่างพัฒนา',
    designerName: 'กองช่าง องค์การบริหารส่วนตำบลตัวอย่างพัฒนา',
    contractorName: 'ห้างหุ้นส่วนจำกัด ตัวอย่างการโยธาและก่อสร้าง',
    contractorAddress: 'เลขที่ 99/4 หมู่ 2 ต.ตัวอย่าง อ.เมือง จ.ตัวอย่าง',
    contractorPhone: '02-999-9999',
    contractorSupervisor: 'นายตัวอย่าง ปฏิบัติงาน (สย. 99999)',
    signatories: {
      supervisor: {
        roleTitle: 'ผู้ควบคุมงาน',
        name: 'นายสมชาย ตัวอย่างช่าง',
        position: 'นายช่างโยธาชำนาญงาน',
        agency: 'กองช่าง อบต.ตัวอย่างพัฒนา',
        signedDate: '2024-08-20',
      },
      committeeChair: {
        roleTitle: 'ประธานกรรมการตรวจรับพัสดุ',
        name: 'นายวิชัย ตัวอย่างดี',
        position: 'ผู้อำนวยการกองช่าง',
        agency: 'อบต.ตัวอย่างพัฒนา',
        signedDate: '2024-08-20',
      },
      committeeMember1: {
        roleTitle: 'กรรมการตรวจรับพัสดุ',
        name: 'นายประสิทธิ์ ตัวอย่างงาน',
        position: 'นักจัดการงานช่าง',
        agency: 'อบต.ตัวอย่างพัฒนา',
        signedDate: '2024-08-20',
      },
      committeeMember2: {
        roleTitle: 'กรรมการตรวจรับพัสดุ',
        name: 'นางสาวกานดา ตัวอย่างรู้',
        position: 'นักวิชาการเงินและบัญชี',
        agency: 'อบต.ตัวอย่างพัฒนา',
        signedDate: '2024-08-20',
      },
    },
    weeklyTasks: [
      {
        id: 'wt-1',
        wn: 1,
        wd: 'งานปรับเกลี่ยและบดอัดดินคันทางเดิม',
        ww: 15,
        wp: 15,
        wt: 0,
        wc: 15,
        wr: 0,
        remarks: 'แล้วเสร็จ 100%',
      },
      {
        id: 'wt-2',
        wn: 2,
        wd: 'งานลงหินคลุกและทรายรองพื้นหนา 0.05 ม.',
        ww: 20,
        wp: 20,
        wt: 0,
        wc: 20,
        wr: 0,
        remarks: 'แล้วเสร็จ 100%',
      },
      {
        id: 'wt-3',
        wn: 3,
        wd: 'งานเข้าแบบและผูกเหล็กตะแกรง Wire Mesh 6 มม.',
        ww: 25,
        wp: 10,
        wt: 15,
        wc: 25,
        wr: 0,
        remarks: 'กำลังดำเนินการช่วง กม. 0+400 - 0+850',
      },
      {
        id: 'wt-4',
        wn: 4,
        wd: 'งานเทคอนกรีตผิวทางหนา 0.15 ม. (กำลังอัด 240 ksc)',
        ww: 30,
        wp: 5,
        wt: 12,
        wc: 17,
        wr: 13,
        remarks: 'เทได้ระยะทาง 420 เมตร',
      },
      {
        id: 'wt-5',
        wn: 5,
        wd: 'งานตัด Joint หยอดรอยต่อยางมะตอย และไหล่ทางหินคลุก',
        ww: 10,
        wp: 0,
        wt: 0,
        wc: 0,
        wr: 10,
        remarks: 'รอดำเนินการหลังบ่มคอนกรีต',
      },
    ],
    hasObstacleWeekly: false,
    obstacleWeeklyDetail: '',
    dailyLogs: [
      { dayNumber: 1, dateStr: '14 ส.ค. 67', morning: 'sunny', afternoon: 'sunny', workDescription: 'เข้าแบบเหล็กและวางลูกปูนหนุนตะแกรงเหล็ก กม. 0+400 ถึง 0+550' },
      { dayNumber: 2, dateStr: '15 ส.ค. 67', morning: 'sunny', afternoon: 'sunny', workDescription: 'เทคอนกรีตผสมเสร็จ 240 ksc ช่วง กม. 0+400 ถึง 0+550 รวม 150 ม.' },
      { dayNumber: 3, dateStr: '16 ส.ค. 67', morning: 'sunny', afternoon: 'overcast', workDescription: 'บ่มคอนกรีตด้วยกระสอบชุ่มน้ำ และเข้าแบบช่วง กม. 0+550 ถึง 0+700' },
      { dayNumber: 4, dateStr: '17 ส.ค. 67', morning: 'sunny', afternoon: 'rain', workDescription: 'ผูกเหล็ก Wire Mesh และตัดรอยต่อคอนกรีตช่วงแรก หยุดเทเนื่องจากฝนตกบ่าย' },
      { dayNumber: 5, dateStr: '18 ส.ค. 67', morning: 'sunny', afternoon: 'sunny', workDescription: 'เทคอนกรีตผสมเสร็จ ช่วง กม. 0+550 ถึง 0+700 รวม 150 ม.' },
      { dayNumber: 6, dateStr: '19 ส.ค. 67', morning: 'sunny', afternoon: 'sunny', workDescription: 'บ่มผิวทางคอนกรีต และเกลี่ยหินคลุกไหล่ทาง กม. 0+000 ถึง 0+300' },
      { dayNumber: 7, dateStr: '20 ส.ค. 67', morning: 'sunny', afternoon: 'overcast', workDescription: 'ตรวจวัดระดับความหนาผิวทาง และเก็บกวาดทำความสะอาดพื้นที่' },
    ],
    laborMatrix: [
      {
        id: 'lm-1',
        category: 'supervision',
        name: 'หัวหน้าคนงาน / โฟร์แมน',
        unit: 'คน',
        counts: [1, 1, 1, 1, 1, 1, 1],
      },
      {
        id: 'lm-2',
        category: 'labor',
        name: 'กรรมกร',
        unit: 'คน',
        counts: [4, 5, 4, 3, 5, 4, 2],
      },
    ],
    selectedMonth: 'สิงหาคม 2567',
    monthlySummaryNarrative: 'ผู้รับจ้างได้เข้าปฏิบัติงานตามแผนงานอย่างต่อเนื่อง ความก้าวหน้าสะสมคิดเป็นร้อยละ 77.00 เร็วกว่าแผนงานร้อยละ 2.00 คุณภาพงานเป็นไปตามแบบรูปรายการละเอียด',
    monthlyDisbursementStatus: 'เบิกจ่ายงวดที่ 1 เรียบร้อยแล้ว อยู่ระหว่างเตรียมการตรวจรับงวดที่ 2',
  };
};

/**
 * Sanitizes labor matrix to ensure default only shows หัวหน้าคนงาน / โฟร์แมน and กรรมกร
 */
export const sanitizeLaborMatrix = (matrix?: LaborMatrixRow[]): LaborMatrixRow[] => {
  if (!matrix || matrix.length === 0) {
    return [
      {
        id: 'lm-1',
        category: 'supervision',
        name: 'หัวหน้าคนงาน / โฟร์แมน',
        unit: 'คน',
        counts: [1, 1, 1, 1, 1, 1, 1],
      },
      {
        id: 'lm-2',
        category: 'labor',
        name: 'กรรมกร',
        unit: 'คน',
        counts: [4, 5, 4, 3, 5, 4, 2],
      },
    ];
  }

  // If it matches the old 6 default rows template with engineers and concrete workers
  if (
    matrix.length === 6 &&
    matrix.some((m) => m.name.includes('วิศวกรโยธา')) &&
    matrix.some((m) => m.name.includes('ช่างปูน'))
  ) {
    const foremanRow = matrix.find((m) => m.name.includes('หัวหน้าคนงาน'))?.counts || [1, 1, 1, 1, 1, 1, 1];
    const laborerRow = matrix.find((m) => m.name.includes('กรรมกร'))?.counts || [4, 5, 4, 3, 5, 4, 2];
    return [
      {
        id: 'lm-1',
        category: 'supervision',
        name: 'หัวหน้าคนงาน / โฟร์แมน',
        unit: 'คน',
        counts: foremanRow,
      },
      {
        id: 'lm-2',
        category: 'labor',
        name: 'กรรมกร',
        unit: 'คน',
        counts: laborerRow,
      },
    ];
  }

  return matrix;
};

/**
 * Loads the full project collection from LocalStorage
 */
export const loadProjectsCollection = (): StoredProjectItem[] => {
  try {
    const raw = localStorage.getItem(PROJECTS_COLLECTION_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Sanitize projects
        return parsed.map((item: StoredProjectItem) => ({
          ...item,
          data: {
            ...item.data,
            laborMatrix: sanitizeLaborMatrix(item.data?.laborMatrix),
          },
        }));
      }
    }
  } catch (err) {
    console.error('Failed to parse projects collection from localStorage', err);
  }

  // Fallback: check legacy single project storage
  try {
    const legacy = localStorage.getItem('contractscan_project_data');
    if (legacy) {
      const parsedLegacy: ContractProjectData = JSON.parse(legacy);
      parsedLegacy.laborMatrix = sanitizeLaborMatrix(parsedLegacy.laborMatrix);
      const sampleItem = convertProjectToStoredItem(parsedLegacy);
      saveProjectsCollection([sampleItem]);
      return [sampleItem];
    }
  } catch {
    // ignore
  }

  // Initial default: create sample project and save
  const defaultProj = createSampleProject();
  const defaultItem = convertProjectToStoredItem(defaultProj);
  saveProjectsCollection([defaultItem]);
  return [defaultItem];
};

/**
 * Saves project collection to LocalStorage
 */
export const saveProjectsCollection = (items: StoredProjectItem[]): void => {
  try {
    localStorage.setItem(PROJECTS_COLLECTION_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save projects collection to localStorage', err);
  }
};

/**
 * Converts a ContractProjectData object to a StoredProjectItem with metadata
 */
export const convertProjectToStoredItem = (project: ContractProjectData): StoredProjectItem => {
  const summary = calculateProjectSummary(project);
  const id = project.id || generateProjectId();
  const now = new Date().toISOString();
  const projectWithId: ContractProjectData = {
    ...project,
    id,
    updatedAt: now,
  };

  return {
    id,
    projectName: project.projectName || 'โครงการ (ยังไม่ได้ระบุชื่อ)',
    contractNumber: project.contractNumber || 'ไม่ระบุเลขที่สัญญา',
    organization: project.organization || 'ไม่ระบุหน่วยงาน',
    contractAmount: Number(project.contractAmount) || 0,
    progressPct: Number(summary.currentActualProgress.toFixed(1)) || 0,
    updatedAt: now,
    createdAt: project.docDate || now,
    data: projectWithId,
  };
};

/**
 * Upserts a project into the collection
 */
export const upsertProject = (
  project: ContractProjectData,
  currentList: StoredProjectItem[]
): { updatedList: StoredProjectItem[]; savedItem: StoredProjectItem } => {
  const targetId = project.id || generateProjectId();
  const projectToSave: ContractProjectData = {
    ...project,
    id: targetId,
    updatedAt: new Date().toISOString(),
  };
  const storedItem = convertProjectToStoredItem(projectToSave);

  const existingIndex = currentList.findIndex((item) => item.id === targetId);
  let updatedList: StoredProjectItem[];

  if (existingIndex >= 0) {
    updatedList = [...currentList];
    updatedList[existingIndex] = storedItem;
  } else {
    updatedList = [storedItem, ...currentList];
  }

  saveProjectsCollection(updatedList);
  return { updatedList, savedItem: storedItem };
};

/**
 * Deletes a project by ID from the collection
 */
export const deleteProject = (
  projectId: string,
  currentList: StoredProjectItem[]
): { updatedList: StoredProjectItem[]; nextActiveProject: ContractProjectData } => {
  const remaining = currentList.filter((item) => item.id !== projectId);
  
  if (remaining.length === 0) {
    // If deleted last project, create a fresh empty project
    const fresh = createNewBlankProject();
    const freshItem = convertProjectToStoredItem(fresh);
    const newList = [freshItem];
    saveProjectsCollection(newList);
    return { updatedList: newList, nextActiveProject: fresh };
  }

  saveProjectsCollection(remaining);
  return { updatedList: remaining, nextActiveProject: remaining[0].data };
};

/**
 * Duplicates a project
 */
export const duplicateProject = (
  projectId: string,
  currentList: StoredProjectItem[]
): { updatedList: StoredProjectItem[]; duplicatedProject: ContractProjectData } => {
  const source = currentList.find((item) => item.id === projectId);
  const baseData = source ? source.data : initialProjectData;
  const newId = generateProjectId();
  const now = new Date().toISOString();

  const duplicatedData: ContractProjectData = {
    ...JSON.parse(JSON.stringify(baseData)),
    id: newId,
    updatedAt: now,
    projectName: `${baseData.projectName || 'โครงการ'} (สำเนา)`,
    contractNumber: baseData.contractNumber ? `${baseData.contractNumber}-COPY` : '',
    docNumber: baseData.docNumber ? `${baseData.docNumber}-COPY` : '',
  };

  const storedItem = convertProjectToStoredItem(duplicatedData);
  const updatedList = [storedItem, ...currentList];
  saveProjectsCollection(updatedList);

  return { updatedList, duplicatedProject: duplicatedData };
};
