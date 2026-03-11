"use client";

import React from "react";
import { Bell, Search, Moon, Sun, Command, Menu, Flame, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/stores/authStore";
import { useSidebar } from "./dashboard-layout";

export default function Header() {
  const [dark, setDark] = React.useState(true);
  const { user } = useAuthStore();
  const { setMobileOpen } = useSidebar();

  const toggleTheme = () => {
    setDark(!dark);
    if (dark) {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/40 bg-background/60 backdrop-blur-xl px-4 sm:px-6 animate-slide-down">
      {/* Mobile hamburger + Search */}
      <div className="flex items-center gap-2 flex-1 max-w-lg">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden rounded-xl h-9 w-9 text-muted-foreground hover:text-foreground shrink-0"
          onClick={() => setMobileOpen(true)}
        >
          <Menu size={20} />
        </Button>
        <div className="relative flex-1 group">
          <Input
            icon={<Search size={15} />}
            placeholder="Search anything..."
            className="bg-muted/40 border-border/40 h-9 text-sm pr-20 transition-all duration-300 focus:bg-muted/60 focus:border-primary/30 focus:shadow-[0_0_12px_hsl(var(--primary)/0.08)]"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-0.5 rounded-md border border-border/40 bg-muted/60 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
            <Command size={10} /> K
          </kbd>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-1.5">
        {/* Streak Badge */}
        <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-muted/60 border border-border/60 px-3 py-1.5 mr-1">
          <Flame size={13} className="text-orange-500" />
          <span className="text-xs font-semibold text-muted-foreground">{user?.loginStreak ?? 0}</span>
        </div>

        {/* Theme Toggle */}
        <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-lg h-9 w-9 text-muted-foreground hover:text-foreground">
          {dark ? <Sun size={16} /> : <Moon size={16} />}
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="rounded-lg h-9 w-9 relative text-muted-foreground hover:text-foreground">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
        </Button>

        {/* XP Badge */}
        <Badge variant="default" className="ml-1 hidden sm:inline-flex gap-1 py-1 px-3">
          <Zap size={12} /> <span className="stat-number">{user?.totalXP?.toLocaleString() ?? "0"} XP</span>
        </Badge>
      </div>
    </header>
  );
}
