"use client";

import React, { useEffect, useState, createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./sidebar";
import Header from "./header";
import { useAuthStore } from "@/stores/authStore";
import { Loader2 } from "lucide-react";

interface SidebarContextType {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const SidebarContext = createContext<SidebarContextType>({
  mobileOpen: false,
  setMobileOpen: () => {},
  collapsed: false,
  setCollapsed: () => {},
});

export const useSidebar = () => useContext(SidebarContext);

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading, fetchUser } = useAuthStore();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetchUser().finally(() => setReady(true));
  }, [fetchUser]);

  useEffect(() => {
    if (ready && !isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [ready, isLoading, isAuthenticated, router]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [children]);

  if (!ready || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading CareerX...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <SidebarContext.Provider value={{ mobileOpen, setMobileOpen, collapsed, setCollapsed }}>
      <div className="min-h-screen bg-background">
        {/* Subtle background mesh */}
        <div className="fixed inset-0 -z-10 gradient-mesh opacity-50" />
        <div className="fixed inset-0 -z-10 dot-pattern opacity-30" />

        {/* Mobile overlay */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        <Sidebar />
        <div className={`transition-all duration-500 ${collapsed ? "lg:pl-[72px]" : "lg:pl-[260px]"}`}>
          <Header />
          <main className="p-4 sm:p-6 max-w-[1600px] page-enter-stagger">{children}</main>
        </div>
      </div>
    </SidebarContext.Provider>
  );
}
