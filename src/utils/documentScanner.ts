import PizZip from 'pizzip';
import { ContractProjectData } from '../types';

export interface ScanResult {
  fileName: string;
  fileSize: number;
  fileType: string;
  previewUrl?: string;
  extractedText?: string;
  extractedData: Partial<ContractProjectData>;
  rawSummary?: string;
  method: 'gemini-ai' | 'client-ocr-parser' | 'text-extractor';
  confidence: number;
}

/**
 * Read File as Base64 string (without data: URL prefix)
 */
export function readFileAsBase64(file: File): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64Index = result.indexOf(';base64,');
      if (base64Index !== -1) {
        const mimeType = result.substring(5, base64Index);
        const base64 = result.substring(base64Index + 8);
        resolve({ base64, mimeType });
      } else {
        resolve({ base64: result, mimeType: file.type || 'application/octet-stream' });
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

/**
 * Read plain text file content (TXT, CSV, JSON, Markdown)
 */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string) || '');
    reader.onerror = (error) => reject(error);
    reader.readAsText(file, 'utf-8');
  });
}

/**
 * Extract raw text from Word .docx file using PizZip
 */
export async function extractTextFromDocx(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const zip = new PizZip(arrayBuffer);
    const documentXml = zip.file('word/document.xml')?.asText();
    if (!documentXml) return '';

    // Extract all text within <w:t> tags
    const textMatches = documentXml.match(/<w:t[^>]*>(.*?)<\/w:t>/g);
    if (!textMatches) return '';

    const text = textMatches
      .map((tag) => tag.replace(/<[^>]+>/g, ''))
      .join(' ')
      .replace(/\s+/g, ' ');

    return text;
  } catch (error) {
    console.warn('Could not extract text from docx:', error);
    return '';
  }
}

/**
 * Client-Side Heuristic Thai Construction Regex Parser (Instant fallback)
 */
export function parseThaiConstructionText(text: string): Partial<ContractProjectData> {
  const result: Partial<ContractProjectData> = {
    signatories: {
      supervisor: { roleTitle: 'ผู้ควบคุมงาน', name: '', position: '' },
      committeeChair: { roleTitle: 'ประธานกรรมการตรวจรับพัสดุ', name: '', position: '' },
      committeeMember1: { roleTitle: 'กรรมการตรวจรับพัสดุ', name: '', position: '' },
      committeeMember2: { roleTitle: 'กรรมการตรวจรับพัสดุ', name: '', position: '' },
    },
  };

  if (!text) return result;

  // Project Name
  const projectMatch = text.match(/(?:โครงการ|ชื่อโครงการ|งานจ้างก่อสร้าง)[:\s]+([^\n\r,]+)/i);
  if (projectMatch && projectMatch[1]) {
    result.projectName = projectMatch[1].trim();
  }

  // Contract Number
  const contractMatch = text.match(/(?:สัญญาเลขที่|เลขที่สัญญา|สัญญาจ้างเลขที่)[:\s]+([^\n\r,\s]+)/i);
  if (contractMatch && contractMatch[1]) {
    result.contractNumber = contractMatch[1].trim();
  }

  // Organization
  const orgMatch = text.match(/(?:ส่วนราชการ|หน่วยงาน|ผู้ว่าจ้าง|องค์การบริหารส่วนตำบล|เทศบาลตำบล|เทศบาลเมือง)[:\s]+([^\n\r,]+)/i);
  if (orgMatch && orgMatch[1]) {
    result.organization = orgMatch[1].trim();
    result.employerName = orgMatch[1].trim();
  }

  // Contractor Name
  const contractorMatch = text.match(/(?:ผู้รับจ้าง|ห้างหุ้นส่วนจำกัด|หจก\.|บริษัท)[:\s]+([^\n\r,]+)/i);
  if (contractorMatch && contractorMatch[1]) {
    result.contractorName = contractorMatch[1].trim();
  }

  // Contract Amount (numeric / string with commas)
  const amountMatch = text.match(/(?:วงเงินค่าก่อสร้าง|จำนวนเงิน|ค่าจ้าง|เป็นเงินทั้งสิ้น|วงเงินตามสัญญา)[:\s]+([\d,]+(?:\.\d{1,2})?)/i);
  if (amountMatch && amountMatch[1]) {
    const numericAmount = parseFloat(amountMatch[1].replace(/,/g, ''));
    if (!isNaN(numericAmount)) {
      result.contractAmount = numericAmount;
    }
  }

  // Dates
  const startDateMatch = text.match(/(?:เริ่มสัญญาวันที่|เริ่มต้นสัญญา|วันเริ่มต้น)[:\s]+([^\n\r,]+)/i);
  if (startDateMatch && startDateMatch[1]) {
    result.contractStartDate = startDateMatch[1].trim();
  }

  const endDateMatch = text.match(/(?:สิ้นสุดสัญญาวันที่|สิ้นสุดสัญญา|วันสิ้นสุด)[:\s]+([^\n\r,]+)/i);
  if (endDateMatch && endDateMatch[1]) {
    result.contractEndDate = endDateMatch[1].trim();
  }

  const durationMatch = text.match(/(?:ระยะเวลาทำการ|กำหนดเวลาแล้วเสร็จภายใน|รวมระยะเวลา)[:\s]+([^\n\r,]+)/i);
  if (durationMatch && durationMatch[1]) {
    result.contractDuration = durationMatch[1].trim();
  }

  // Dimensions
  const widthMatch = text.match(/(?:ขนาดกว้าง|กว้าง)[:\s]+([^\n\r,]+(?:เมตร|ม\.))/i);
  if (widthMatch && widthMatch[1]) result.dimensionWidth = widthMatch[1].trim();

  const lengthMatch = text.match(/(?:ความยาว|ยาว)[:\s]+([^\n\r,]+(?:เมตร|ม\.))/i);
  if (lengthMatch && lengthMatch[1]) result.dimensionLength = lengthMatch[1].trim();

  const thicknessMatch = text.match(/(?:ความหนา|หนา)[:\s]+([^\n\r,]+(?:เมตร|ม\.|ซม\.))/i);
  if (thicknessMatch && thicknessMatch[1]) result.dimensionThickness = thicknessMatch[1].trim();

  const areaMatch = text.match(/(?:พื้นที่|พื้นที่ไม่น้อยกว่า)[:\s]+([^\n\r,]+(?:ตร\.ม\.|ตารางเมตร))/i);
  if (areaMatch && areaMatch[1]) result.dimensionArea = areaMatch[1].trim();

  // Scope Summary
  const scopeMatch = text.match(/(?:ขอบเขตงาน|รายละเอียดงาน|ลักษณะงาน)[:\s]+([^\n\r]+)/i);
  if (scopeMatch && scopeMatch[1]) result.scopeSummary = scopeMatch[1].trim();

  // Supervisor
  const supMatch = text.match(/(?:ผู้ควบคุมงาน|นายช่างผู้ควบคุมงาน)[:\s]+([^\n\r(]+)(?:\(([^)]+)\))?/i);
  if (supMatch && supMatch[1]) {
    result.signatories!.supervisor.name = supMatch[1].trim();
    if (supMatch[2]) result.signatories!.supervisor.position = supMatch[2].trim();
  }

  // Committee Chair
  const chairMatch = text.match(/(?:ประธานกรรมการ|ประธานกรรมการตรวจรับพัสดุ)[:\s]+([^\n\r(]+)(?:\(([^)]+)\))?/i);
  if (chairMatch && chairMatch[1]) {
    result.signatories!.committeeChair.name = chairMatch[1].trim();
    if (chairMatch[2]) result.signatories!.committeeChair.position = chairMatch[2].trim();
  }

  // Committee Member 1
  const m1Match = text.match(/(?:กรรมการตรวจรับพัสดุ|กรรมการ)[:\s]+([^\n\r(]+)(?:\(([^)]+)\))?/i);
  if (m1Match && m1Match[1] && m1Match[1].trim() !== result.signatories!.committeeChair.name) {
    result.signatories!.committeeMember1.name = m1Match[1].trim();
    if (m1Match[2]) result.signatories!.committeeMember1.position = m1Match[2].trim();
  }

  return result;
}

/**
 * Scan document through Gemini API or client-side fallback
 */
export async function processUploadedFile(file: File): Promise<ScanResult> {
  const fileType = file.type || '';
  const fileName = file.name || 'document';
  const fileSize = file.size || 0;

  let previewUrl: string | undefined;
  let textContent = '';
  let base64Data = '';
  let mimeType = fileType;

  // Generate preview for images
  if (fileType.startsWith('image/')) {
    previewUrl = URL.createObjectURL(file);
    const b64Res = await readFileAsBase64(file);
    base64Data = b64Res.base64;
    mimeType = b64Res.mimeType;
  } else if (fileType === 'application/pdf' || fileName.toLowerCase().endsWith('.pdf')) {
    mimeType = 'application/pdf';
    const b64Res = await readFileAsBase64(file);
    base64Data = b64Res.base64;
  } else if (
    fileType.includes('text') ||
    fileName.endsWith('.txt') ||
    fileName.endsWith('.json') ||
    fileName.endsWith('.csv') ||
    fileName.endsWith('.md')
  ) {
    textContent = await readFileAsText(file);
  } else if (fileName.endsWith('.docx')) {
    textContent = await extractTextFromDocx(file);
  } else {
    // Fallback binary as base64
    const b64Res = await readFileAsBase64(file);
    base64Data = b64Res.base64;
  }

  // Step 1: Attempt Gemini 3.7 Flash Server-side AI Document Scan
  try {
    const payload: any = {
      fileName,
      mimeType: mimeType || 'application/octet-stream',
    };

    if (base64Data) {
      payload.fileBase64 = base64Data;
    }
    if (textContent) {
      payload.textContent = textContent;
    }

    const response = await fetch('/api/scan-document', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.extractedData) {
        const ext = data.extractedData;
        return {
          fileName,
          fileSize,
          fileType: mimeType,
          previewUrl,
          extractedText: textContent || ext.scopeSummary || '',
          extractedData: ext,
          rawSummary: ext.rawSummary || `สแกนเอกสาร ${fileName} สำเร็จด้วย AI อัตโนมัติ`,
          method: 'gemini-ai',
          confidence: 0.95,
        };
      }
    }
  } catch (err) {
    console.warn('Gemini API call failed, falling back to local extractor:', err);
  }

  // Step 2: Fallback to Client-Side Heuristic Text Extractor
  if (textContent) {
    const localData = parseThaiConstructionText(textContent);
    return {
      fileName,
      fileSize,
      fileType: mimeType,
      previewUrl,
      extractedText: textContent,
      extractedData: localData,
      rawSummary: `สกัดข้อมูลจากข้อความในไฟล์ ${fileName} สำเร็จ (ระบบคัดกรองอัตโนมัติ)`,
      method: 'client-ocr-parser',
      confidence: 0.75,
    };
  }

  // Step 3: Minimal fallback for binary / image without AI server
  return {
    fileName,
    fileSize,
    fileType: mimeType,
    previewUrl,
    extractedData: {},
    rawSummary: `อัปโหลดไฟล์ ${fileName} เรียบร้อย (กรุณาเชื่อมต่อ Gemini API เพื่อสแกนภาพ/PDF ขั้นสูง)`,
    method: 'text-extractor',
    confidence: 0.5,
  };
}

/**
 * Sample test document text generator for instant user demonstration
 */
export function getSampleConstructionDocument(): string {
  return `บันทึกข้อความ ส่วนราชการ องค์การบริหารส่วนตำบลด่านขุนทด อำเภอด่านขุนทด จังหวัดนครราชสีมา
ที่ นม 78203/2567 วันที่ 15 พฤษภาคม 2567
เรื่อง รายงานข้อมูลโครงการและสัญญาจ้างก่อสร้างถนน คสล. สายบ้านหนองแวง หมู่ที่ 4

เรียน นายกองค์การบริหารส่วนตำบลด่านขุนทด

ตามที่ องค์การบริหารส่วนตำบลด่านขุนทด ได้ทำสัญญาจ้างก่อสร้าง สัญญาเลขที่ 45/2567 ลงวันที่ 2 พฤษภาคม 2567
กับ ห้างหุ้นส่วนจำกัด ขุนทดคอนสตรัคชั่น (ผู้รับจ้าง) ตั้งอยู่เลขที่ 124 หมู่ 2 ต.ด่านขุนทด อ.ด่านขุนทด จ.นครราชสีมา เบอร์โทรศัพท์ 044-123456
ในโครงการก่อสร้างถนนคอนกรีตเสริมเหล็ก สายบ้านหนองแวง หมู่ที่ 4
วงเงินค่าก่อสร้างตามสัญญา 1,850,000 บาท (หนึ่งล้านแปดแสนห้าหมื่นบาทถ้วน)
กำหนดระยะเวลาก่อสร้าง 90 วัน
วันเริ่มต้นสัญญา 3 พฤษภาคม 2567 วันสิ้นสุดสัญญา 31 กรกฎาคม 2567

ลักษณะและขอบเขตงาน:
ก่อสร้างถนน คสล. ขนาดกว้าง 5.00 เมตร ความยาว 850.00 เมตร ความหนา 0.15 เมตร หรือมีพื้นที่ไม่น้อยกว่า 4,250.00 ตารางเมตร พร้อมลงไหล่ทางหินคลุกข้างละ 0.50 เมตร และติดตั้งป้ายประชาสัมพันธ์โครงการตามแบบมาตรฐาน

ผู้ควบคุมงานของผู้ว่าจ้าง: นายสุรเชษฐ์ เจริญสุข ตำแหน่ง นายช่างโยธาชำนาญงาน
คณะกรรมการตรวจรับพัสดุ:
1. นายสมศักดิ์ วงศ์สว่าง ตำแหน่ง ผู้อำนวยการกองช่าง (ประธานกรรมการตรวจรับพัสดุ)
2. นางสาวนภาลักษณ์ พันธุ์ดี ตำแหน่ง นักวิชาการเงินและบัญชีชำนาญการ (กรรมการตรวจรับพัสดุ)
3. นายอานนท์ ภักดีไทย ตำแหน่ง นักวิเคราะห์นโยบายและแผนปฏิบัติการ (กรรมการตรวจรับพัสดุ)

ผู้แทนผู้รับจ้าง: นายเกียรติศักดิ์ ศรีวิชัย (ผู้จัดการโครงการ) และ นายวิชาญ มั่นคง (วิศวกรผู้ควบคุมงาน)`;
}
