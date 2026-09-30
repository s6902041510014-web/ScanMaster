import type { Metadata } from "next";
import { Sarabun, Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import Navbar from "@/components/layout/Navbar";

const sarabun = Sarabun({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["thai", "latin"],
  variable: "--font-sarabun",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ระบบตรวจข้อสอบ OMR อัจฉริยะ | Smart OMR Exam Scanner",
  description: "ระบบตรวจข้อสอบผ่านกล้องมือถือและไฟล์ภาพ สำหรับอาจารย์ผู้สอน พร้อมสร้างกระดาษคำตอบ A4 และส่งออกคะแนน",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${sarabun.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col antialiased">
        <LanguageProvider>
          <Navbar />
          <main className="flex-1 w-full pb-16">{children}</main>
          <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
            <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
              <p>© 2026 OMR Examination Management Platform — All rights reserved.</p>
              <div className="flex items-center gap-4 text-slate-400">
                <span>Computer Vision OMR Engine</span>
                <span>•</span>
                <span>White-Blue High Contrast Standard</span>
              </div>
            </div>
          </footer>
        </LanguageProvider>
      </body>
    </html>
  );
}
