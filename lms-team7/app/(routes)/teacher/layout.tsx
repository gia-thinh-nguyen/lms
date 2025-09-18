"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home, BookOpen, BarChart3, CalendarDays, Settings, Palette, Menu
} from "lucide-react";
import { ThemeProvider, useTheme } from "./context/ThemeContext";

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LayoutContent>{children}</LayoutContent>
    </ThemeProvider>
  );
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { cardClass, textClass, buttonClass } = useTheme();
  const [collapsed, setCollapsed] = useState(false);

  const links = [
    { href: "/teacher", label: "Dashboard", icon: <Home size={18} /> },
    { href: "/teacher/classes", label: "Classes", icon: <BookOpen size={18} /> },
    { href: "/teacher/assignments", label: "Assignments", icon: <CalendarDays size={18} /> },
    { href: "/teacher/reports", label: "Reports", icon: <BarChart3 size={18} /> },
    { href: "/teacher/themes", label: "Themes", icon: <Palette size={18} /> },
    { href: "/teacher/settings", label: "Settings", icon: <Settings size={18} /> },
  ] as const;

  return (
    <div className="min-h-screen grid grid-cols-[auto_1fr]">
      {/* Sidebar */}
      <aside className={`h-screen sticky top-0 p-3 ${collapsed ? "w-16" : "w-60"}`}>
        <div className={`mb-3 flex items-center justify-between ${cardClass} p-3 rounded-lg`}>
          <span className={`font-bold ${textClass}`}>{collapsed ? "L" : "LMS – Teacher"}</span>
          <button className="btn btn-ghost btn-sm" onClick={() => setCollapsed(v => !v)}>
            <Menu size={18} />
          </button>
        </div>

        <nav className="flex flex-col gap-1">
          {links.map(({ href, label, icon }) => {
            const active = pathname?.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 p-2 rounded-lg transition ${
                  active ? `shadow-sm font-semibold ${cardClass} border border-black/10` : `hover:${cardClass}`
                }`}
              >
                {icon} <span className={textClass}>{label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main */}
      <main className="p-4">
        <div className={`mb-4 p-3 rounded-lg flex items-center justify-between ${cardClass}`}>
          <h1 className={`text-lg font-semibold ${textClass}`}>Teacher Dashboard</h1>
          <Link href="/teacher/themes" className={`btn btn-sm ${buttonClass}`}>
            <span className="flex items-center gap-1">
              <Palette size={16} /> Theme
            </span>
          </Link>
        </div>

        {children}
      </main>
    </div>
  );
}
