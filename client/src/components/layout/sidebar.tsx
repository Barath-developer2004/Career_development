"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  User,
  FileText,
  FileSearch,
  Code2,
  Bot,
  Briefcase,
  Video,
  Terminal,
  FlaskConical,
  ClipboardCheck,
  GraduationCap,
  BookOpen,
  Trophy,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  LogOut,
  Settings,
  Crown,
  X,
  Map,
  Award,
  CalendarDays,
  FileEdit,
  Search,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/stores/authStore";
import { useSidebar } from "./dashboard-layout";

const allMenuSections = [
  {
    label: "Overview",
    roles: ["job_seeker", "higher_studies"],
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Profile & Analytics", href: "/dashboard/profile", icon: User },
      { name: "Leaderboard", href: "/dashboard/leaderboard", icon: Trophy },
    ],
  },
  {
    label: "Job Seeker",
    roles: ["job_seeker"],
    items: [
      { name: "Resume Builder", href: "/dashboard/resume-builder", icon: FileText },
      { name: "ATS Analyzer", href: "/dashboard/ats-analyzer", icon: FileSearch },
      { name: "Coding Profile", href: "/dashboard/coding-profile", icon: Code2 },
      { name: "Jobs Board", href: "/dashboard/jobs", icon: Briefcase },
      { name: "Interview Practice", href: "/dashboard/interview-lab", icon: Video },
      { name: "Online Compiler", href: "/dashboard/compiler", icon: Terminal },
      { name: "Project Explorer", href: "/dashboard/ai-project-lab", icon: FlaskConical },
      { name: "Test Practice", href: "/dashboard/test-practice", icon: ClipboardCheck },
    ],
  },
  {
    label: "Higher Education",
    roles: ["higher_studies"],
    items: [
      { name: "Exam Preparation", href: "/dashboard/exam-prep", icon: GraduationCap },
      { name: "Exam MCQs", href: "/dashboard/exam-mcq", icon: BookOpen },
      { name: "University Finder", href: "/dashboard/university-finder", icon: Search },
      { name: "Scholarship Finder", href: "/dashboard/scholarship-finder", icon: Award },
      { name: "Study Planner", href: "/dashboard/study-planner", icon: CalendarDays },
      { name: "SOP Writer", href: "/dashboard/sop-writer", icon: FileEdit },
    ],
  },
  {
    label: "Tools",
    roles: ["job_seeker", "higher_studies"],
    items: [
      { name: "AI Assistant", href: "/dashboard/ai-chat", icon: Bot },
      { name: "DSA Problems", href: "/dashboard/smart-search", icon: Code2 },
      { name: "Roadmap Generator", href: "/dashboard/roadmap", icon: Map },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { mobileOpen, setMobileOpen, collapsed, setCollapsed } = useSidebar();

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem("selectedRole");
    router.push("/login");
  };

  // Filter menu sections based on user role
  const userRole = user?.role || "job_seeker";
  const menuSections = allMenuSections.filter(
    (section) => section.roles.includes(userRole)
  );

  const initials = user?.initials || user?.fullName?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "U";

  return (
    <aside
      className={cn(
        "fixed top-0 z-50 flex h-screen flex-col transition-all duration-500 ease-out",
        "bg-gradient-to-b from-[hsl(232,18%,11%)] to-[hsl(232,18%,9%)]",
        "text-sidebar-foreground border-r border-white/[0.06]",
        // Desktop: left-0, controlled by collapsed state
        "max-lg:fixed max-lg:top-0 max-lg:h-full",
        collapsed ? "lg:w-[72px]" : "lg:w-[260px]",
        // Mobile: slide in/out
        mobileOpen ? "max-lg:left-0 max-lg:w-[280px]" : "max-lg:-left-[280px]",
        "lg:left-0"
      )}
    >
      {/* Sidebar glow accent */}
      <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-primary/20 via-transparent to-primary/10" />

      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-white/[0.06]">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(238,70%,65%)] text-white font-bold text-sm shadow-[0_2px_12px_hsl(var(--primary)/0.4)] group-hover:shadow-[0_4px_20px_hsl(var(--primary)/0.5)] transition-shadow duration-300">
            C
            <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          {!collapsed && (
            <span className="text-lg font-bold tracking-tight text-white">
              Career<span className="text-transparent bg-clip-text bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(238,70%,70%)]">X</span>
            </span>
          )}
        </Link>
        {/* Desktop collapse / Mobile close */}
        <button
          onClick={() => {
            if (mobileOpen) setMobileOpen(false);
            else setCollapsed(!collapsed);
          }}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-white/40 hover:bg-white/[0.08] hover:text-white/80 transition-all duration-200 cursor-pointer"
        >
          {/* On mobile when open, show X; on desktop show collapse chevrons */}
          <span className="lg:hidden">{mobileOpen ? <X size={16} /> : null}</span>
          <span className="hidden lg:inline">{collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}</span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-6">
        {menuSections.map((section) => (
          <div key={section.label}>
            {!collapsed && (
              <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-white/20">
                {section.label}
              </p>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-300 group relative",
                        isActive
                          ? "bg-gradient-to-r from-primary/20 to-primary/5 text-white shadow-[inset_0_1px_0_hsl(var(--primary)/0.15)]"
                          : "text-white/40 hover:bg-white/[0.04] hover:text-white/70"
                      )}
                      title={collapsed ? item.name : undefined}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r-full bg-gradient-to-b from-primary to-[hsl(238,70%,65%)] shadow-[0_0_8px_hsl(var(--primary)/0.5)]" />
                      )}
                      <item.icon
                        size={17}
                        className={cn(
                          "shrink-0 transition-all duration-300",
                          isActive ? "text-primary drop-shadow-[0_0_6px_hsl(var(--primary)/0.4)]" : "text-white/30 group-hover:text-white/60"
                        )}
                      />
                      {!collapsed && (
                        <span className="truncate">{item.name}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Upgrade Card */}
      {!collapsed && (
        <div className="mx-3 mb-3 rounded-2xl overflow-hidden relative max-lg:block">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/25 via-[hsl(238,70%,62%)]/20 to-[hsl(340,75%,55%)]/15" />
          <div className="absolute inset-0 backdrop-blur-sm" />
          <div className="relative p-4 border border-white/[0.08] rounded-2xl">
            <div className="flex items-center gap-2 mb-2">
              <Crown size={15} className="text-yellow-400" />
              <span className="text-xs font-bold text-white">Upgrade to Pro</span>
            </div>
            <p className="text-[11px] text-white/40 mb-3 leading-relaxed">
              Unlock AI features, unlimited resumes, and more.
            </p>
            <button className="w-full rounded-xl bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(238,70%,65%)] py-2 text-xs font-semibold text-white hover:brightness-110 transition-all duration-300 shadow-[0_2px_12px_hsl(var(--primary)/0.3)] cursor-pointer">
              Upgrade Now
            </button>
          </div>
        </div>
      )}

      {/* User Section */}
      <div className="border-t border-white/[0.06] p-3">
        <div className="flex items-center gap-3 rounded-xl p-2 hover:bg-white/[0.04] transition-all duration-300">
          <Avatar className="h-8 w-8 ring-2 ring-primary/20">
            <AvatarFallback className="text-xs bg-gradient-to-br from-primary/30 to-[hsl(238,65%,62%)]/20 text-primary font-bold">{initials}</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.fullName || "User"}</p>
              <p className="text-[10px] text-white/30 truncate">{user?.email || ""}</p>
            </div>
          )}
          {!collapsed && (
            <div className="flex gap-0.5">
              <Link href="/dashboard/profile" onClick={() => setMobileOpen(false)}>
                <button className="p-1.5 rounded-lg text-white/25 hover:bg-white/[0.08] hover:text-white/60 transition-all duration-200 cursor-pointer">
                  <Settings size={13} />
                </button>
              </Link>
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg text-white/25 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 cursor-pointer"
              >
                <LogOut size={13} />
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
