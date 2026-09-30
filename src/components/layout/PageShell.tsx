import * as React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageShellProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export default function PageShell({
  title,
  subtitle,
  badge,
  breadcrumbs,
  actions,
  children,
  className,
}: PageShellProps) {
  return (
    <div className={cn("container mx-auto px-4 lg:px-8 py-8 max-w-7xl", className)}>
      {/* Breadcrumb Section (Alignment & Proximity) */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex items-center space-x-2 text-xs font-medium text-slate-500">
            {breadcrumbs.map((item, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <li key={index} className="flex items-center space-x-2">
                  {index > 0 && <ChevronRight className="h-3 w-3 text-slate-400" />}
                  {item.href && !isLast ? (
                    <Link
                      href={item.href}
                      className="hover:text-blue-700 transition-colors"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className={cn(isLast ? "font-bold text-blue-900" : "")}>
                      {item.label}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      )}

      {/* Header Section (Visual Hierarchy & High Contrast) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-200">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {title}
            </h1>
            {badge && <div>{badge}</div>}
          </div>
          {subtitle && (
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl font-normal">
              {subtitle}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {actions}
          </div>
        )}
      </div>

      {/* Main Content Area (Grid & Proximity Layout) */}
      <div className="w-full">{children}</div>
    </div>
  );
}
