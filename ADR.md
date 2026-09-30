# Architecture Decision Records (ADRs)

> บันทึกการตัดสินใจสถาปัตยกรรมที่สำคัญ — แต่ละ ADR มีบริบท ทางเลือก และเหตุผลที่เลือก

---

## ADR-001 — Storage: localStorage Only (No Backend for MVP)

**Status**: ✅ Accepted  
**Date**: 2026-09-30  
**Decider**: User (Teacher/อาจารย์)

### Context
ระบบต้องการเก็บ Exam และ ScanResult ต้องเลือกระหว่าง backend database กับ client-side storage

### Options Considered
- **A) Supabase (PostgreSQL)** — persistent, multi-device, multi-user
- **B) localStorage (Zustand persist)** — simple, no server, single-device only
- **C) IndexedDB** — larger capacity, same device limitation

### Decision
**B) localStorage** เลือกสำหรับ MVP

### Rationale
- ระบบเป็น "ตัวทดลอง" — ความเรียบง่ายสำคัญกว่า persistence
- ไม่ต้องการ backend infrastructure ในระยะแรก
- ผู้ใช้รับทราบข้อจำกัด (ข้อมูลหายเมื่อ clear browser)
- สามารถ migrate ไป Supabase ได้ในอนาคตโดย replace store layer

### Consequences
- ⚠️ ข้อมูลหายถ้า clear browser หรือเปลี่ยนเครื่อง
- ⚠️ จำกัดที่ ~5MB (เพียงพอสำหรับ exam + results ไม่มีรูป)
- ✅ Deploy ง่าย ไม่ต้องการ env secrets
- ✅ Processing เร็ว ไม่ต้อง network request

---

## ADR-002 — Image Storage: Discard After Processing

**Status**: ✅ Accepted  
**Date**: 2026-09-30

### Context
หลัง OMR process แล้ว ต้องเลือกว่าจะเก็บรูปภาพต้นฉบับไว้ไหม

### Decision
**ไม่เก็บรูปภาพ** หลัง process เสร็จ

### Rationale
- localStorage จำกัดที่ ~5MB — รูป 1 ใบ (JPEG) ≈ 500KB–2MB
- ถ้าเก็บรูปจะ overflow storage หลังสแกนไม่กี่ใบ
- ผู้ใช้เลือก Option B (ไม่เก็บ) อย่างชัดเจน
- ยังมี Manual Correction UI ให้แก้ไขก่อน discard

### Consequences
- ✅ localStorage ใช้ได้นานขึ้นมาก
- ⚠️ ไม่สามารถ audit รูปต้นฉบับย้อนหลังได้

---

## ADR-003 — Answer Sheet Layout: Size-Based Auto-Selection

**Status**: ✅ Accepted  
**Date**: 2026-09-30

### Context
ผู้ใช้ต้องการรองรับ "หลายรูปแบบ" ของกระดาษคำตอบ (Q3 = D)
หมายถึง layout ที่ต่างกันตามจำนวนข้อสอบ ไม่ใช่แค่ choice style

### Decision
**Auto-select layout** ตามจำนวนข้อที่อาจารย์กำหนด:

| Layout ID | Questions | Columns | Description |
|-----------|-----------|---------|-------------|
| `SM` | 1–30 | 1 | Single column, large bubbles |
| `MD` | 31–60 | 2 | Dual column |
| `LG` | 61–100 | 3 | Triple column, small bubbles |

### Rationale
- อาจารย์ไม่ต้องเลือก layout เอง — ระบบเลือกให้อัตโนมัติ
- แต่ละ layout มี grid coordinates ที่กำหนดไว้แน่นอนใน `GRID_CONFIG`
- OMR engine ใช้ layout ID เพื่อ lookup bubble positions

### Consequences
- OMR detector ต้องรู้ว่า Exam ใช้ Layout ใด ก่อน detect
- `GRID_CONFIG` ต้องถูก calibrate ให้ตรงกับ PDF output จริง
- ⚠️ ถ้า print scale ผิด → grid coordinates ผิด → detect ผิด (documented in CONTEXT.md)

---

## ADR-004 — OMR Engine: OpenCV.js Client-Side Only

**Status**: ✅ Accepted  
**Date**: 2026-09-30

### Context
ต้องเลือก engine สำหรับ detect bubble marks จากภาพถ่าย

### Options Considered
- **A) Google Cloud Vision API** — แม่นยำสูง, ต้องใช้ API key, มีค่าใช้จ่าย, ส่งข้อมูลออก
- **B) OpenAI GPT-4o Vision** — แม่นยำมาก, แพง, ช้า, ส่งข้อมูลออก
- **C) OpenCV.js (WASM, client-side)** — ฟรี, privacy ดี, ไม่ต้อง network
- **D) Tesseract.js** — ออกแบบมาสำหรับ text OCR ไม่เหมาะกับ bubble detection

### Decision
**C) OpenCV.js** — ทำงานใน browser ทั้งหมด ไม่ส่งข้อมูลออก

### Rationale
- ผู้ใช้ระบุชัดเจน: "ไม่ใช้ AI — ใช้การตรวจจับ pattern แบบ Computer Vision ปกติ"
- ข้อมูลกระดาษคำตอบเป็นข้อมูลสอบ — privacy สำคัญ
- ไม่มีค่าใช้จ่าย API
- เหมาะกับ structured OMR ที่มี known grid positions

### Consequences
- ⚠️ WASM load time 5–15 วินาทีครั้งแรก → ต้องมี loading indicator
- ⚠️ accuracy ขึ้นอยู่กับคุณภาพภาพ — target failure rate < 2%
- ✅ ทำงาน offline ได้
- ✅ ไม่ต้องการ API keys หรือ environment secrets

---

## ADR-005 — Ambiguous Fill: Zero Score Immediately

**Status**: ✅ Accepted  
**Date**: 2026-09-30

### Context
ถ้านักเรียนฝน > 1 วงในข้อเดียว ระบบต้องตัดสินใจว่าจะทำอะไร

### Decision
**ให้ 0 คะแนนข้อนั้นทันที** โดยไม่ถามอาจารย์

### Rationale
- เป็น standard practice ใน OMR ระบบสอบทั่วไป (เช่น O-NET, GAT)
- อาจารย์ยังสามารถแก้ไขได้ใน Manual Correction UI ก่อน confirm
- หลีกเลี่ยง ambiguity ใน business logic

### Consequences
- ⚠️ อาจารย์ต้องตรวจสอบ Manual Correction อย่างรอบคอบ
- ✅ Logic ชัดเจน ไม่มี edge case ซับซ้อน

---

## ADR-006 — Corner Detection Failure: Hard Error (No Manual Fallback)

**Status**: ✅ Accepted  
**Date**: 2026-09-30

### Context
ถ้า OpenCV หา Corner Marker ไม่เจอ ต้องตัดสินใจว่าจะ fallback อย่างไร

### Options Considered
- **A) แสดง error → ให้ถ่ายใหม่** — simple, ต้องภาพดี
- **B) Manual alignment UI** — complex, ต้องทำ UI เพิ่ม, อาจ error สะสม
- **C) A + B combined** — ซับซ้อน เกิน MVP scope

### Decision
**A) Hard error — แสดง error message ให้อาจารย์ถ่ายใหม่**

### Rationale
- ผู้ใช้เลือก Option A อย่างชัดเจน
- Manual alignment เพิ่ม complexity และ error surface มาก
- เป็น MVP — ความเรียบง่ายสำคัญ
- Error message ที่ดีพร้อม tips จะช่วยได้มากกว่า complex fallback

### Consequences
- ✅ Implementation ง่ายกว่ามาก
- ⚠️ ถ้าแสงไม่ดีมาก อาจต้องถ่ายใหม่หลายครั้ง
- Error message ต้องมี tips ชัดเจน: "ถ่ายในที่แสงสว่าง, วางกระดาษบนพื้นเรียบ"

---

## ADR-007 — i18n: Bilingual Thai/English

**Status**: ✅ Accepted  
**Date**: 2026-09-30

### Decision
ใช้ **next-i18next** รองรับ 2 ภาษา: Thai (default) + English

### Consequences
- UI labels ทั้งหมดต้องมีใน `th.json` และ `en.json`
- ห้าม hardcode Thai/English string ใน component
- Language toggle ใน Navbar ทุกหน้า
