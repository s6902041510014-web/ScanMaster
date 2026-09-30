"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useAuthStore } from "@/lib/store/authStore";
import {
  FileCheck2,
  PlusCircle,
  LayoutDashboard,
  Globe,
  UserCheck,
  LogOut,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const pathname = usePathname();
  const { locale, toggleLocale, t } = useLanguage();
  const { user, isAuthenticated, logout } = useAuthStore();

  const isLoginPage = pathname === "/login";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-blue-900/40 bg-blue-900 text-white shadow-md">
      <div className="container mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <Link
          href="/dashboard"
          className="flex items-center gap-3 group transition-transform active:scale-95"
        >
          <div className="h-10 w-10 rounded-xl bg-white text-blue-800 flex items-center justify-center shadow-md font-bold text-xl group-hover:bg-blue-50 transition-colors">
            <FileCheck2 className="h-6 w-6 text-blue-700" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white">
                OMR ScanMaster
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-blue-800/80 px-2.5 py-0.5 text-[11px] font-semibold text-blue-200 border border-blue-700">
                <Sparkles className="h-3 w-3 text-amber-300" />
                Smart Vision
              </span>
            </div>
            <p className="text-[11px] text-blue-200 hidden sm:block">
              {t.app.teacherPortal}
            </p>
          </div>
        </Link>

        {/* Main Navigation (when authenticated and not in login) */}
        {!isLoginPage && isAuthenticated && (
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              href="/dashboard"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === "/dashboard"
                  ? "bg-blue-800 text-white shadow-inner font-semibold"
                  : "text-blue-100 hover:bg-blue-800/60 hover:text-white"
              }`}
            >
              <LayoutDashboard className="h-4 w-4 text-blue-300" />
              {t.nav.dashboard}
            </Link>
            <Link
              href="/exams/new"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === "/exams/new"
                  ? "bg-blue-800 text-white shadow-inner font-semibold"
                  : "text-blue-100 hover:bg-blue-800/60 hover:text-white"
              }`}
            >
              <PlusCircle className="h-4 w-4 text-emerald-300" />
              {t.nav.newExam}
            </Link>
          </nav>
        )}

        {/* Right Action Bar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switcher */}
          <button
            onClick={toggleLocale}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-700 bg-blue-800/80 hover:bg-blue-700 text-xs font-semibold text-white transition-colors shadow-sm"
            title="Switch Language / สลับภาษา"
          >
            <Globe className="h-3.5 w-3.5 text-blue-300" />
            <span>{locale === "th" ? "🇹🇭 TH" : "🇬🇧 EN"}</span>
          </button>

          {/* User Profile / Logout */}
          {!isLoginPage && isAuthenticated && user && (
            <div className="flex items-center gap-2 pl-2 border-l border-blue-800">
              <div className="hidden lg:flex flex-col text-right">
                <span className="text-xs font-bold text-white leading-tight">
                  {user.name}
                </span>
                <span className="text-[10px] text-blue-300">
                  {user.department}
                </span>
              </div>
              <div className="h-8 w-8 rounded-full bg-blue-800 border border-blue-600 flex items-center justify-center text-white">
                <UserCheck className="h-4 w-4 text-emerald-300" />
              </div>
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => logout()}
                  className="text-blue-200 hover:text-white hover:bg-blue-800 p-2 h-8 w-8"
                  title={t.nav.logout}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}

          {isLoginPage && (
            <div className="text-xs text-blue-200 font-medium hidden sm:block">
              {t.nav.themeWhiteBlue}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
