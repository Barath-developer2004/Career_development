"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search, Briefcase, Building2,
  ExternalLink, TrendingUp,
  Users, Star, Loader2, Globe, ArrowRight,
} from "lucide-react";
import { jobService } from "@/lib/services";

interface Platform {
  name: string;
  icon: string;
  color: string;
  url: string;
  description: string;
}

const platformLogos: Record<string, React.ReactNode> = {
  linkedin: <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
  indeed: <Briefcase size={20} />,
  glassdoor: <Star size={20} />,
  naukri: <Building2 size={20} />,
  internshala: <Users size={20} />,
  wellfound: <TrendingUp size={20} />,
  google: <Search size={20} />,
  github: <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>,
};

const trendingSuggestions = [
  "Frontend Developer",
  "Backend Engineer",
  "Full Stack Developer",
  "Data Scientist",
  "DevOps Engineer",
  "Machine Learning",
  "React Developer",
  "Python Developer",
];

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (q?: string) => {
    const query = q || searchTerm;
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    setSearchQuery(query);
    try {
      const res = await jobService.searchExternal(query);
      setPlatforms(res.data?.platforms || []);
    } catch (e) {
      console.error("Search failed", e);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 page-enter-stagger">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight">Job Finder</h1>
        <p className="text-muted-foreground/70">
          Search across top job platforms. Find and apply to real opportunities in one place.
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase size={18} className="text-primary" />
            <h3 className="font-bold">What job are you looking for?</h3>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="e.g., Frontend Developer, Python Engineer, Data Scientist..."
              className="flex-1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button variant="gradient" className="gap-2" onClick={() => handleSearch()} disabled={loading || !searchTerm.trim()}>
              {loading ? (
                <><Loader2 size={14} className="animate-spin" /> Searching...</>
              ) : (
                <><Search size={14} /> Search Jobs</>
              )}
            </Button>
          </div>

          {/* Suggestions */}
          {!searched && (
            <div className="mt-4">
              <p className="text-xs text-muted-foreground mb-2">Popular searches:</p>
              <div className="flex flex-wrap gap-2">
                {trendingSuggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => { setSearchTerm(s); handleSearch(s); }}
                    className="text-xs rounded-xl border border-border/40 px-3 py-1.5 text-muted-foreground hover:bg-primary/8 hover:text-primary hover:border-primary/20 transition-all cursor-pointer"
                  >
                    <Search size={10} className="inline mr-1" />
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-primary" />
        </div>
      )}

      {/* Results */}
      {!loading && searched && platforms.length > 0 && (
        <>
          <div className="flex items-center gap-2">
            <Globe size={16} className="text-primary" />
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">&ldquo;{searchQuery}&rdquo;</span> across {platforms.length} platforms
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {platforms.map((platform) => (
              <a
                key={platform.name}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <Card className="h-full hover-lift transition-all cursor-pointer border-border/40 hover:border-primary/30 hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Platform icon */}
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-md shrink-0"
                        style={{ backgroundColor: platform.color }}
                      >
                        {platformLogos[platform.icon] || <Globe size={20} />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-bold group-hover:text-primary transition-colors">
                            {platform.name}
                          </h3>
                          <ExternalLink size={14} className="text-muted-foreground/50 group-hover:text-primary transition-colors" />
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">
                          {platform.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs gap-1">
                            <Search size={10} /> {searchQuery}
                          </Badge>
                          <span className="text-xs text-primary font-medium flex items-center gap-1 ml-auto group-hover:translate-x-1 transition-transform">
                            View Jobs <ArrowRight size={12} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>

          {/* Tip */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4 flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                <Star size={14} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Pro Tip</p>
                <p className="text-xs text-muted-foreground">
                  Click on any platform above to search for &ldquo;{searchQuery}&rdquo; jobs directly on their site.
                  You can apply, save, and track your applications on each platform. Try different job titles to explore more opportunities!
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Empty initial state */}
      {!loading && !searched && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { name: "LinkedIn", color: "#0A66C2", icon: "linkedin" },
            { name: "Indeed", color: "#2164F3", icon: "indeed" },
            { name: "Naukri", color: "#4A90D9", icon: "naukri" },
            { name: "Glassdoor", color: "#0CAA41", icon: "glassdoor" },
          ].map((p) => (
            <Card key={p.name} className="text-center hover-lift transition-all cursor-pointer opacity-60">
              <CardContent className="p-6">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-md mx-auto mb-3"
                  style={{ backgroundColor: p.color }}
                >
                  {platformLogos[p.icon]}
                </div>
                <p className="text-sm font-medium">{p.name}</p>
                <p className="text-[10px] text-muted-foreground mt-1">Search to explore</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
