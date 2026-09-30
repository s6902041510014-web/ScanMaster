"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useAuthStore } from "@/lib/store/authStore";
import {
  FileCheck2,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { login } = useAuthStore();
  const [email, setEmail] = useState("teacher.somchai@university.ac.th");
  const [password, setPassword] = useState("12345678");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email || "teacher@university.ac.th");
    router.push("/dashboard");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-50">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden shadow-elevated border border-slate-200 bg-white">
        {/* Left Column: 30% Royal Blue Brand Hero */}
        <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 p-8 text-white flex flex-col justify-between border-r border-blue-900">
          <div>
            <div className="h-12 w-12 rounded-xl bg-white text-blue-900 flex items-center justify-center shadow-lg font-bold text-2xl mb-6">
              <FileCheck2 className="h-7 w-7 text-blue-700" />
            </div>

            <span className="inline-flex items-center gap-1 rounded-full bg-blue-700/60 px-3 py-1 text-xs font-semibold text-blue-200 border border-blue-500/40 mb-3">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              Teacher Examination Platform
            </span>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-3">
              {t.app.title}
            </h2>
            <p className="text-sm text-blue-200 leading-relaxed">
              {t.app.subtitle}
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-blue-800/80 space-y-3 text-xs text-blue-200">
            {t.auth.featuresList.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: 70% White Login Form */}
        <div className="p-8 sm:p-10 flex flex-col justify-center bg-white">
          <div className="mb-6">
            <h3 className="text-xl font-extrabold text-slate-900 mb-1">
              {t.auth.title}
            </h3>
            <p className="text-xs text-slate-500">{t.auth.subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs text-slate-700">
                {t.auth.emailLabel}
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder={t.auth.emailPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs text-slate-700">
                {t.auth.passwordLabel}
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  required
                  placeholder={t.auth.passwordPlaceholder}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-[11px] text-blue-900 font-medium leading-normal">
              {t.auth.demoHint}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full gap-2 text-base font-bold bg-blue-700 hover:bg-blue-800 shadow-blueGlow mt-2"
            >
              <span>{t.auth.loginButton}</span>
              <ArrowRight className="h-5 w-5" />
            </Button>
          </form>

          <div className="mt-8 text-center flex items-center justify-center gap-1.5 text-xs text-slate-400">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Client-side Secure Local Storage Session</span>
          </div>
        </div>
      </div>
    </div>
  );
}
