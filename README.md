# OMR ScanMaster — ระบบตรวจข้อสอบ OMR อัจฉริยะ 📝

เว็บแอปพลิเคชันสำหรับอาจารย์ผู้สอน ช่วยในการสร้างชุดข้อสอบ กำหนดเฉลย พิมพ์กระดาษคำตอบมาตรฐาน A4 ตรวจข้อสอบผ่านกล้องมือถือ/ไฟล์ภาพด้วยเทคโนโลยี Computer Vision ในเบราว์เซอร์ 100% พร้อมรายงานสถิติและส่งออกผลสอบ CSV/PDF

---

## 🎨 UI/UX Design System Standard
- **Typography**: Google Font **Sarabun** (ไทย) + Inter (Latin)
- **Color Theme**: 70% White Surface / 30% Royal Blue Accent (`#1D4ED8`, `#1E40AF`, `#0F172A`)
- **Grid System**: 12-Column Responsive Layout (Mobile 375px → Desktop 2K)
- **Visual Hierarchy & Proximity**: จัดกลุ่มข้อมูลการ์ดและลำดับความสำคัญชัดเจน
- **High Contrast**: ปุ่ม Call-to-Action และสถานะผลสอบอ่านง่าย คมชัด

---

## 🚀 ฟังก์ชันการทำงานหลัก (Key Features)

1. **Teacher Portal Auth**:
   - ระบบเข้าสู่ระบบอาจารย์ พร้อมรองรับการใช้งานภาษาไทย 🇹🇭 และอังกฤษ 🇬🇧
2. **Dashboard รวมชุดข้อสอบ**:
   - สรุปยอดรวมชุดข้อสอบ, จำนวนแผ่นที่ตรวจแล้ว, และคะแนนเฉลี่ยรวม
   - ค้นหาและกรองตามชื่อวิชา หรือ รหัสวิชา
3. **สร้างชุดข้อสอบและเฉลยคำตอบ (Create Exam & Answer Key)**:
   - ปรับจำนวนข้อสอบได้ 5–100 ข้อ
   - ระบบเลือก **Layout กระดาษคำตอบอัตโนมัติ (ADR-003)**:
     - **Layout SM**: 1–30 ข้อ (1 คอลัมน์)
     - **Layout MD**: 31–60 ข้อ (2 คอลัมน์)
     - **Layout LG**: 61–100 ข้อ (3 คอลัมน์)
   - รองรับตัวเลือก: `ก, ข, ค, ง`, `A, B, C, D`, `1, 2, 3, 4`
   - เครื่องมือกำหนดเฉลย Quick Fill, สลับวน, คลิกเลือกรายข้อ
4. **สร้างกระดาษคำตอบมาตรฐาน A4 (PDF Generator)**:
   - จุดสี่เหลี่ยมดำ 4 มุม (**Corner Alignment Markers 10x10mm**)
   - ตารางฝนรหัสนักเรียน 8 หลัก (**Student ID Matrix 0-9**)
   - พิมพ์ขนาด A4 (100% Scale) ตรงสัดส่วน
5. **สแกนตรวจข้อสอบ (Live Camera & File Upload)**:
   - สแกนผ่านกล้องมือถือ/เว็บแคม หรือลากวางไฟล์รูปภาพ
   - ประมวลผลด้วย Computer Vision (OpenCV.js Client-Side)
   - มีระบบจำลองการตรวจ (Demo Simulator) สำหรับทดสอบทันที
6. **ตรวจทานและแก้ไขผลคะแนน (Manual Verification & Correction)**:
   - ถอดรหัสรหัสนักเรียนและคำตอบ
   - แสดงสีสถานะ: สีเขียว (ถูก), สีแดง (ผิด), สีส้ม ⚠️ (ฝนซ้ำ / ได้ 0 คะแนนตาม ADR-005)
   - แก้ไขคำตอบได้สดๆ และคะแนนจะคำนวณใหม่แบบเรียลไทม์
7. **สรุปผลคะแนนและสถิติชั้นเรียน (Class Results & Analytics)**:
   - สรุปตัวเลข: คะแนนเฉลี่ย, สูงสุด/ต่ำสุด, อัตราผ่านเกณฑ์ (≥60%)
   - **Score Distribution Histogram**: กราฟแท่งการกระจายตัวของคะแนน
   - **Item Analysis Table**: วิเคราะห์ความยากง่ายและร้อยละความถูกต้องรายข้อ
   - **Export CSV**: ส่งออกไฟล์ CSV ครบทุกคอลัมน์ (รหัส, คะแนน, คำตอบทุกข้อ, เฉลยทุกข้อ, ถูก/ผิดทุกข้อ, วันที่, วิชา) พร้อม UTF-8 BOM
   - **Export PDF**: ส่งออกรายงานสรุปชั้นเรียนและตารางคะแนน

---

## 🛠️ Tech Stack
- **Framework**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, Tailwind Animate, Lucide Icons
- **State Management**: Zustand (with localStorage persistence)
- **PDF Generation**: jsPDF, jspdf-autotable
- **Camera Capture**: react-webcam
- **OMR Engine**: Client-side Computer Vision (Canvas Image Processing)

---

## 💻 วิธีการรันโปรเจกต์ (Getting Started)

1. ติดตั้ง dependencies:
```bash
npm install
```

2. รัน Development Server:
```bash
npm run dev
```

3. เปิดเว็บเบราว์เซอร์ไปที่:
👉 `http://localhost:3000`

---

## 📄 ใบอนุญาต (License)
MIT License © 2026 OMR ScanMaster
