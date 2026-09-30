"use client";

import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Camera, RefreshCw, Sparkles, SwitchCamera } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CameraCaptureProps {
  onCapture: (imageElement: HTMLImageElement) => void;
  onSimulate: () => void;
}

export default function CameraCapture({ onCapture, onSimulate }: CameraCaptureProps) {
  const webcamRef = useRef<Webcam>(null);
  const { t } = useLanguage();
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [cameraError, setCameraError] = useState<string | null>(null);

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  const captureFrame = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      const img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        onCapture(img);
      };
    }
  }, [webcamRef, onCapture]);

  const videoConstraints = {
    facingMode,
    width: { ideal: 1920 },
    height: { ideal: 1080 },
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
      {/* Viewfinder Canvas Area (Visual Hierarchy & Proximity) */}
      <div className="relative w-full aspect-[3/4] sm:aspect-[4/5] bg-slate-950 rounded-2xl overflow-hidden border-2 border-blue-600 shadow-elevated">
        {cameraError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white bg-slate-900">
            <Camera className="h-12 w-12 text-slate-500 mb-3" />
            <p className="text-sm font-semibold mb-2">ไม่สามารถเข้าถึงกล้องได้</p>
            <p className="text-xs text-slate-400 max-w-xs mb-4">
              กรุณาอนุญาตการใช้งานกล้องในเบราว์เซอร์ หรือใช้วิธีอัปโหลดไฟล์รูปภาพแทน
            </p>
            <Button variant="secondary" size="sm" onClick={() => setCameraError(null)}>
              <RefreshCw className="h-4 w-4 mr-1.5" /> ลองใหม่
            </Button>
          </div>
        ) : (
          <>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              onUserMediaError={() => setCameraError("Permission denied or camera unavailable")}
              className="w-full h-full object-cover"
            />

            {/* Viewfinder Corner Overlays */}
            <div className="absolute inset-6 sm:inset-10 pointer-events-none border-2 border-blue-400/40 rounded-xl flex flex-col justify-between p-2">
              <div className="flex justify-between">
                <div className="w-8 h-8 border-t-4 border-l-4 border-blue-400 rounded-tl-lg" />
                <div className="w-8 h-8 border-t-4 border-r-4 border-blue-400 rounded-tr-lg" />
              </div>
              <div className="text-center">
                <span className="inline-block bg-blue-900/80 backdrop-blur-sm text-white text-[11px] font-semibold px-3 py-1 rounded-full border border-blue-500/50 shadow-sm">
                  {t.scanner.cameraGuide}
                </span>
              </div>
              <div className="flex justify-between">
                <div className="w-8 h-8 border-b-4 border-l-4 border-blue-400 rounded-bl-lg" />
                <div className="w-8 h-8 border-b-4 border-r-4 border-blue-400 rounded-br-lg" />
              </div>
            </div>

            {/* Switch Camera Button (Mobile) */}
            <button
              onClick={toggleFacingMode}
              className="absolute top-4 right-4 bg-slate-900/80 hover:bg-slate-800 text-white p-2.5 rounded-full border border-slate-700 shadow-md backdrop-blur-sm transition-transform active:scale-95"
              title={t.scanner.switchCamera}
            >
              <SwitchCamera className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Action Controls (Contrast & Repetition) */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full mt-6">
        <Button
          variant="primary"
          size="lg"
          onClick={captureFrame}
          disabled={Boolean(cameraError)}
          className="w-full sm:flex-1 h-14 text-base font-bold shadow-blueGlow gap-2 bg-blue-700 hover:bg-blue-800"
        >
          <Camera className="h-6 w-6" />
          {t.scanner.captureButton}
        </Button>

        {/* Instant Simulator Button for dev/testing */}
        <Button
          variant="secondary"
          size="lg"
          onClick={onSimulate}
          className="w-full sm:w-auto h-14 px-6 text-sm font-semibold border-blue-300 text-blue-900 hover:bg-blue-50 gap-2 shrink-0"
          title="จำลองการสแกนด้วยชุดคำตอบทดสอบ"
        >
          <Sparkles className="h-4 w-4 text-amber-500" />
          <span>จำลองการสแกน (Demo)</span>
        </Button>
      </div>
    </div>
  );
}
