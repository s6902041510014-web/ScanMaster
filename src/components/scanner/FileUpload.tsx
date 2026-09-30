"use client";

import React, { useState, useRef } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { UploadCloud, Image as ImageIcon, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  onImageSelected: (imageElement: HTMLImageElement) => void;
  onSimulate: () => void;
}

export default function FileUpload({ onImageSelected, onSimulate }: FileUploadProps) {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("กรุณาเลือกไฟล์รูปภาพ (JPG, PNG, WEBP)");
      return;
    }

    setSelectedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setPreviewSrc(dataUrl);

      const img = new Image();
      img.src = dataUrl;
      img.onload = () => {
        onImageSelected(img);
      };
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
      {/* Drag & Drop Surface (Proximity & Contrast) */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`w-full min-h-[300px] flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center bg-white shadow-sm ${
          dragOver
            ? "border-blue-700 bg-blue-50/60 scale-[1.01]"
            : "border-slate-300 hover:border-blue-500 hover:bg-slate-50/80"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleFile(e.target.files[0]);
            }
          }}
        />

        {previewSrc ? (
          <div className="flex flex-col items-center">
            <div className="relative h-44 w-auto rounded-lg overflow-hidden border border-slate-300 shadow-md mb-3">
              <img
                src={previewSrc}
                alt="Uploaded Sheet Preview"
                className="h-full w-auto object-contain"
              />
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <CheckCircle2 className="h-4 w-4" />
              <span>{selectedFileName}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">คลิกเพื่อเปลี่ยนรูปภาพใหม่</p>
          </div>
        ) : (
          <>
            <div className="h-16 w-16 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4 shadow-inner">
              <UploadCloud className="h-8 w-8 text-blue-600" />
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-1">
              {t.scanner.dragDropText}
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mb-4">
              {t.scanner.fileSupported}
            </p>
            <Button variant="secondary" size="md" className="gap-2 pointer-events-none">
              <ImageIcon className="h-4 w-4 text-blue-700" />
              เลือกไฟล์จากเครื่อง
            </Button>
          </>
        )}
      </div>

      {/* Simulator Shortcut */}
      <div className="mt-4 flex items-center justify-center w-full">
        <Button
          variant="secondary"
          size="md"
          onClick={onSimulate}
          className="text-xs font-semibold border-blue-200 text-blue-900 hover:bg-blue-50 gap-2"
        >
          <Sparkles className="h-4 w-4 text-amber-500" />
          <span>ทดลองด้วยการจำลองผลสแกน (Demo Scan)</span>
        </Button>
      </div>
    </div>
  );
}
