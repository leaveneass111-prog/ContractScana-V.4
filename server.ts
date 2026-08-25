import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Increase payload limits for PDF / Image base64 scanning
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Document Scan API using Gemini 3.7 Flash
  app.post('/api/scan-document', async (req, res) => {
    try {
      const { fileBase64, mimeType, fileName, textContent } = req.body;

      if (!fileBase64 && !textContent) {
        return res.status(400).json({ error: 'ไม่พบข้อมูลไฟล์หรือข้อความสำหรับสแกน' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: 'GEMINI_API_KEY is not configured on server',
          fallbackAvailable: true,
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const systemInstruction = `คุณคือผู้เชี่ยวชาญด้านการตรวจสอบและสกัดข้อมูลจากเอกสารสัญญาจ้างก่อสร้าง บันทึกข้อความ และรายงานผลงานก่อสร้างของหน่วยงานราชการไทย (เช่น อบต., เทศบาล, กรมทางหลวง, กรมทางหลวงชนบท, กรมโยธาธิการและผังเมือง)
จงสกัดข้อมูลจากเอกสารที่ได้รับ (ไม่ว่าจะเป็นภาพ PDF ข้อความ หรือเอกสารสแกน) แล้วส่งผลลัพธ์กลับมาเป็น JSON ตามรูปแบบที่กำหนดเท่านั้น
หากไม่พบข้อมูลในหัวข้อใด ให้ปล่อยเป็นสตริงว่าง "" หรือ 0 (สำหรับตัวเลข)`;

      const promptText = `จงสแกนและดึงข้อมูลสำคัญจากเอกสารชุดนี้อย่างละเอียด โดยตอบกลับเป็น JSON เท่านั้น โครงสร้าง JSON ดังนี้:
{
  "projectName": "ชื่อโครงการก่อสร้าง",
  "contractNumber": "เลขที่สัญญา เช่น 12/2567",
  "organization": "ชื่อหน่วยงาน/ส่วนราชการ เช่น องค์การบริหารส่วนตำบล...",
  "contractAmount": 0,
  "contractDate": "วันที่ทำสัญญา เช่น 15 มกราคม 2567",
  "contractStartDate": "วันเริ่มต้นสัญญา",
  "contractEndDate": "วันสิ้นสุดสัญญา",
  "contractDuration": "ระยะเวลาก่อสร้าง เช่น 90 วัน",
  "contractorName": "ชื่อห้างหุ้นส่วนจำกัด/บริษัทผู้รับจ้าง",
  "contractorAddress": "ที่อยู่ผู้รับจ้าง",
  "contractorPhone": "เบอร์โทรศัพท์ผู้รับจ้าง",
  "contractorSupervisor": "ผู้ควบคุมงานของผู้รับจ้าง",
  "contractorRep1": "ผู้แทนผู้รับจ้าง 1 (ถ้ามี)",
  "contractorRep2": "ผู้แทนผู้รับจ้าง 2 (ถ้ามี)",
  "dimensionWidth": "ความกว้าง เช่น 5.00 เมตร",
  "dimensionLength": "ความยาว เช่น 500.00 เมตร",
  "dimensionThickness": "ความหนา เช่น 0.15 เมตร",
  "dimensionArea": "พื้นที่ เช่น 2,500 ตารางเมตร",
  "scopeSummary": "รายละเอียดขอบเขตงานโดยย่อ",
  "signatories": {
    "supervisor": { "name": "ชื่อผู้ควบคุมงาน", "position": "ตำแหน่ง เช่น นายช่างโยธา..." },
    "committeeChair": { "name": "ชื่อประธานกรรมการตรวจรับพัสดุ", "position": "ตำแหน่ง" },
    "committeeMember1": { "name": "ชื่อกรรมการตรวจรับพัสดุ คนที่ 1", "position": "ตำแหน่ง" },
    "committeeMember2": { "name": "ชื่อกรรมการตรวจรับพัสดุ คนที่ 2", "position": "ตำแหน่ง" }
  },
  "weeklyTasks": [
    {
      "taskNumber": 1,
      "description": "ชื่องาน/รายการงาน",
      "unit": "หน่วยนับ เช่น ตร.ม., ม., งาน",
      "quantity": 0,
      "previousAccum": 0,
      "thisWeek": 0,
      "totalAccum": 0,
      "status": "กำลังดำเนินการ"
    }
  ],
  "milestones": [
    {
      "installmentNumber": 1,
      "title": "งวดงานที่ 1",
      "amount": 0,
      "deadline": "กำหนดส่งมอบ"
    }
  ],
  "rawSummary": "สรุปใจความสำคัญของเอกสารที่สแกนได้ 2-3 บรรทัด"
}`;

      const parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> = [];

      if (fileBase64 && mimeType) {
        // Supported types for Gemini: images (image/png, image/jpeg, image/webp), application/pdf
        parts.push({
          inlineData: {
            mimeType: mimeType,
            data: fileBase64,
          },
        });
      }

      if (textContent) {
        parts.push({
          text: `เนื้อหาข้อความจากเอกสาร (${fileName || 'ไฟล์'}):\n\n${textContent}\n\n`,
        });
      }

      parts.push({
        text: promptText,
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: { parts },
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.1,
        },
      });

      const responseText = response.text || '{}';
      let parsedData;
      try {
        parsedData = JSON.parse(responseText);
      } catch (err) {
        // Attempt cleanup if markdown ticks remain
        const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        parsedData = JSON.parse(cleaned);
      }

      return res.json({
        success: true,
        extractedData: parsedData,
        fileName: fileName || 'document',
      });
    } catch (error: any) {
      console.error('Error scanning document with Gemini:', error);
      return res.status(500).json({
        error: error.message || 'เกิดข้อผิดพลาดในการสแกนเอกสาร',
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
