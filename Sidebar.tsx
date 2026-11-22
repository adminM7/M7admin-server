"use client";
import React from "react";
import { Home, Search, Heart, PlusCircle, UploadCloud, Disc3, ListMusic } from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  playlists: { id: string; name: string }[];
  onCreatePlaylist: () => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  playlists,
  onCreatePlaylist,
}: SidebarProps) {
  const navItems = [
    { id: "home", label: "หน้าหลัก", icon: Home },
    { id: "search", label: "ค้นหาเพลง", icon: Search },
    { id: "liked", label: "เพลงที่ถูกใจ", icon: Heart },
    { id: "admin", label: "อัปโหลดเพลง (Studio)", icon: UploadCloud },
  ];

  return (
    <aside className="w-64 bg-zinc-950/90 border-r border-white/10 flex flex-col h-full select-none shrink-0">
      {/* Brand Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-cyan-500 to-purple-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <Disc3 className="w-6 h-6 text-white animate-spin-slow" />
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            NeonWave
          </h1>
          <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-semibold">
            Cloud Streaming
          </span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-gradient-to-r from-emerald-500/20 to-cyan-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? "text-emerald-400" : ""}`} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Playlists Section */}
      <div className="mt-6 px-4 flex-1 overflow-y-auto">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3 px-2">
          <span>เพลย์ลิสต์ของคุณ</span>
          <button
            onClick={onCreatePlaylist}
            title="สร้างเพลย์ลิสต์ใหม่"
            className="text-zinc-400 hover:text-emerald-400 transition"
          >
            <PlusCircle className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-1">
          {playlists.map((pl) => (
            <button
              key={pl.id}
              onClick={() => setActiveTab(`playlist:${pl.id}`)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                activeTab === `playlist:${pl.id}`
                  ? "bg-white/10 text-white font-medium"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <ListMusic className="w-4 h-4 text-purple-400 shrink-0" />
              <span className="truncate">{pl.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Server Status Badge */}
      <div className="p-4 m-3 rounded-xl bg-zinc-900/90 border border-white/5">
        <div className="flex items-center gap-2 text-xs text-zinc-300 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Online Audio Engine</span>
        </div>
        <p className="text-[11px] text-zinc-500 mt-1">
          High-Bitrate CDN Streaming Ready
        </p>
      </div>
    </aside>
  );
}
