# CONTEXT — OMR Exam Scanner Platform

> เอกสารบริบทโปรเจกต์ — อ่านก่อน implement ทุกครั้ง

---

## What We Are Building

ระบบเว็บแอปพลิเคชันสำหรับอาจารย์ (Teacher-only) ที่ช่วย:

1. **สร้างชุดข้อสอบ** พร้อมกำหนดเฉลย
2. **Generate กระดาษคำตอบ PDF** (มาตรฐาน, มี Corner Marker) เพื่อ print แจกนักเรียน
3. **สแกนกระดาษคำตอบ** ผ่านกล้องมือถือหรือ upload ไฟล์รูปภาพ
4. **ตรวจคะแนนอัตโนมัติ** ด้วย Computer Vision (OpenCV.js — ไม่ใช้ AI/Cloud)
5. **แสดงผลรวมชั้นเรียน** + **Export CSV/PDF**

---

## Who Uses This

| ผู้ใช้ | สิทธิ์ |
|--------|-------|
| อาจารย์ (Teacher) | ทุกอย่าง — สร้าง, สแกน, ดูผล, Export |

> ไม่มี Admin, ไม่มี Student login, ไม่มี Parent — **Teacher เท่านั้น**

---

## What We Are NOT Building (MVP Scope)

- ❌ ระบบจัดการนักเรียน (Student Roster)
- ❌ Student login / ดูผลสอบตัวเอง
- ❌ Notification / Email
- ❌ Cloud sync / Multi-device
- ❌ การอ่านกระดาษคำตอบของสถาบันอื่น (ใช้ได้แค่ template ของระบบเราเท่านั้น)
- ❌ Handwritten OCR
- ❌ AI-based image recognition

---

## Critical Constraints

### Storage
- **MVP**: `localStorage` เท่านั้น — ข้อมูลอยู่ในเบราว์เซอร์เครื่องเดียว
- รูปภาพกระดาษคำตอบ **ไม่เก็บ** หลังจาก process แล้ว
- Warning เมื่อ localStorage ใกล้เต็ม (< 500KB remaining)

### Image Processing
- ทำงาน **client-side ทั้งหมด** ผ่าน OpenCV.js (WASM)
- Target: failure rate < 2% สำหรับภาพคุณภาพปานกลาง (มีรอยยับ, แสงไม่สม่ำเสมอ)
- ถ้า Corner Marker หาไม่เจอ → **แสดง error ทันที** → ให้อาจารย์ถ่ายใหม่ (ไม่มี manual alignment fallback)

### Ambiguous Answer
- ถ้านักเรียนฝนเกิน 1 วงในข้อเดียว → **ให้ 0 คะแนนข้อนั้นทันที** (ไม่ถาม อาจารย์)
- อาจารย์ยังแก้ไขได้ผ่าน Manual Correction UI ก่อน confirm

### Answer Sheet
- อาจารย์ต้องใช้ **กระดาษคำตอบที่ระบบ generate เท่านั้น**
- ระบบไม่รองรับกระดาษคำตอบจากภายนอก

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS + shadcn/ui |
| Icons | Lucide React |
| State | Zustand + localStorage persist |
| OMR Engine | OpenCV.js (WASM, client-side) |
| PDF Generation | jsPDF + jspdf-autotable |
| Camera | react-webcam |
| i18n | next-i18next (Thai + English) |
| Fonts | Inter (Latin) + Sarabun (Thai) |
| Hosting | Vercel |

---

## Answer Sheet Layouts

ระบบ generate layout อัตโนมัติตามจำนวนข้อ:

| Layout | ข้อสอบ | คอลัมน์ |
|--------|-------|---------|
| SM | 1–30 | 1 |
| MD | 31–60 | 2 |
| LG | 61–100 | 3 |

---

## CSV Export Columns (ทั้งหมด)

```
รหัสนักเรียน, คะแนนรวม, คะแนน%, Q1, Q2, ..., QN,
เฉลยQ1, เฉลยQ2, ..., เฉลยQN,
ถูก/ผิดQ1, ถูก/ผิดQ2, ..., ถูก/ผิดQN,
วันที่สแกน, ชื่อวิชา, รหัสวิชา
```

---

## Key Assumptions (Confirmed by User)

1. นักเรียนเข้าใจการฝนรหัสนักเรียนด้วย bubble grid
2. อาจารย์มีเครื่องพิมพ์และสามารถพิมพ์ PDF ได้ที่ขนาด A4 จริง
3. MVP ใช้ localStorage — ยอมรับว่าข้อมูลหายเมื่อ clear browser
4. ระบบนี้เป็น "ตัวทดลอง" — อาจ migrate ไป Supabase ในอนาคต
