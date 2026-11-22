"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import MusicPlayer from "@/components/MusicPlayer";
import AdminUpload from "@/components/AdminUpload";
import AuthModal from "@/components/AuthModal";
import { usePlayer } from "@/context/PlayerContext";
import { DEMO_SONGS, supabase, isSupabaseConfigured } from "@/lib/supabase";
import {
  Play,
  Pause,
  Heart,
  Search,
  Headphones,
  Sparkles,
  User,
  Plus,
  Flame,
} from "lucide-react";

export default function HomePage() {
  const {
    songs,
    setSongs,
    currentSong,
    isPlaying,
    likedIds,
    playSong,
    toggleLike,
  } = usePlayer();

  const [activeTab, setActiveTab] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [authOpen, setAuthOpen] = useState(false);

  const [playlists, setPlaylists] = useState([
    { id: "pl-1", name: "Chill Coding Beats", songIds: ["demo-1", "demo-2"] },
    { id: "pl-2", name: "Late Night Vibes", songIds: ["demo-3", "demo-6"] },
  ]);

  useEffect(() => {
    async function loadSongs() {
      if (isSupabaseConfigured && supabase) {
        const { data } = await supabase
          .from("songs")
          .select("*")
          .order("created_at", { ascending: false });
        if (data && data.length > 0) {
          setSongs(data);
          return;
        }
      }
      setSongs(DEMO_SONGS);
    }
    loadSongs();
  }, [setSongs]);

  const handleCreatePlaylist = () => {
    const name = prompt("ตั้งชื่อเพลย์ลิสต์ใหม่ของคุณ:");
    if (!name) return;
    setPlaylists((prev) => [
      ...prev,
      { id: `pl-${Date.now()}`, name, songIds: currentSong ? [currentSong.id] : [] },
    ]);
  };

  const addSongToPlaylist = (playlistId: string, songId: string) => {
    setPlaylists((prev) =>
      prev.map((pl) =>
        pl.id === playlistId && !pl.songIds.includes(songId)
          ? { ...pl, songIds: [...pl.songIds, songId] }
          : pl
      )
    );
  };

  const genres = ["All", "Electronic", "Lo-Fi", "Indie Pop", "Acoustic", "House", "Classical"];

  const getDisplayedSongs = () => {
    let list = songs;
    if (activeTab === "liked") {
      list = songs.filter((s) => likedIds.includes(s.id));
    } else if (activeTab.startsWith("playlist:")) {
      const plId = activeTab.split(":")[1];
      const pl = playlists.find((p) => p.id === plId);
      list = pl ? songs.filter((s) => pl.songIds.includes(s.id)) : [];
    }

    if (selectedGenre !== "All" && activeTab === "home") {
      list = list.filter((s) => s.genre === selectedGenre);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.artist.toLowerCase().includes(q) ||
          s.album.toLowerCase().includes(q)
      );
    }
    return list;
  };

  const displayedSongs = getDisplayedSongs();
  const featuredSong = songs[0];

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-white">
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          playlists={playlists}
          onCreatePlaylist={handleCreatePlaylist}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-emerald-950/30 via-zinc-950 to-zinc-950 p-6 md:p-8">
          {/* Top Header */}
          <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="relative w-full max-w-md">
              <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activeTab === "admin") setActiveTab("search");
                }}
                placeholder="ค้นหาชื่อเพลง, ศิลปิน, อัลบั้ม..."
                className="w-full bg-white/5 hover:bg-white/10 focus:bg-zinc-900 border border-white/10 rounded-full pl-11 pr-4 py-2.5 text-sm text-white placeholder-zinc-400 focus:outline-none focus:border-emerald-500 transition"
              />
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`text-xs px-3 py-1.5 rounded-full border ${
                  isSupabaseConfigured
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : "bg-amber-500/10 border-amber-500/30 text-amber-300"
                }`}
              >
                {isSupabaseConfigured ? "Cloud DB Connected" : "Demo Mode (พร้อมเชื่อม Supabase)"}
              </span>

              <button
                onClick={() => setAuthOpen(true)}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/10 px-4 py-2 rounded-full text-sm font-medium transition"
              >
                <User className="w-4 h-4 text-emerald-400" />
                <span>{userEmail ? userEmail.split("@")[0] : "เข้าสู่ระบบ"}</span>
              </button>
            </div>
          </header>

          {/* Dynamic View */}
          {activeTab === "admin" ? (
            <AdminUpload />
          ) : (
            <div className="space-y-8">
              {/* Hero Banner on Home */}
              {activeTab === "home" && featuredSong && !searchQuery && (
                <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-600/30 via-cyan-600/20 to-purple-700/30 border border-white/10 p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 shadow-2xl">
                  <img
                    src={featuredSong.cover_url}
                    alt={featuredSong.title}
                    className="w-40 h-40 md:w-48 md:h-48 rounded-2xl object-cover shadow-2xl"
                  />
                  <div className="space-y-3 text-center md:text-left">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                      <Flame className="w-3.5 h-3.5" />
                      <span>กำลังมาแรงสัปดาห์นี้</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                      {featuredSong.title}
                    </h2>
                    <p className="text-zinc-300 text-sm md:text-base">
                      {featuredSong.artist} • อัลบั้ม {featuredSong.album} •{" "}
                      {featuredSong.play_count.toLocaleString()} ครั้ง
                    </p>
                    <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
                      <button
                        onClick={() => playSong(featuredSong)}
                        className="px-7 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition"
                      >
                        <Play className="w-4 h-4 fill-current" />
                        เล่นทันที
                      </button>
                      <button
                        onClick={() => toggleLike(featuredSong.id)}
                        className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition"
                      >
                        {likedIds.includes(featuredSong.id) ? "ถูกใจแล้ว ♥" : "+ เพิ่มในรายการโปรด"}
                      </button>
                    </div>
                  </div>
                </section>
              )}

              {/* Genre Filter Pills */}
              {activeTab === "home" && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {genres.map((g) => (
                    <button
                      key={g}
                      onClick={() => setSelectedGenre(g)}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                        selectedGenre === g
                          ? "bg-white text-zinc-950"
                          : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              )}

              {/* Section Title */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-400" />
                    <span>
                      {activeTab === "liked"
                        ? "เพลงที่คุณกดถูกใจ"
                        : activeTab.startsWith("playlist:")
                        ? playlists.find((p) => `playlist:${p.id}` === activeTab)?.name
                        : searchQuery
                        ? `ผลการค้นหา "${searchQuery}"`
                        : "รายการเพลงแนะนำทั้งหมด"}
                    </span>
                  </h3>
                  <span className="text-xs text-zinc-400">{displayedSongs.length} เพลง</span>
                </div>

                {/* Song Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {displayedSongs.map((song) => {
                    const active = currentSong?.id === song.id;
                    const liked = likedIds.includes(song.id);
                    return (
                      <div
                        key={song.id}
                        className={`group p-4 rounded-2xl border transition-all flex items-center gap-4 ${
                          active
                            ? "bg-emerald-500/15 border-emerald-500/40"
                            : "bg-white/[0.03] hover:bg-white/[0.07] border-white/5"
                        }`}
                      >
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                          <img
                            src={song.cover_url}
                            alt={song.title}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => playSong(song)}
                            className={`absolute inset-0 bg-black/50 flex items-center justify-center transition ${
                              active ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                            }`}
                          >
                            {active && isPlaying ? (
                              <Pause className="w-6 h-6 text-emerald-400 fill-current" />
                            ) : (
                              <Play className="w-6 h-6 text-white fill-current ml-0.5" />
                            )}
                          </button>
                        </div>

                        <div className="min-w-0 flex-1">
                          <h4
                            onClick={() => playSong(song)}
                            className={`font-semibold text-sm truncate cursor-pointer ${
                              active ? "text-emerald-400" : "text-white"
                            }`}
                          >
                            {song.title}
                          </h4>
                          <p className="text-xs text-zinc-400 truncate mt-0.5">{song.artist}</p>
                          <div className="flex items-center gap-3 mt-2 text-[11px] text-zinc-500">
                            <span className="flex items-center gap-1">
                              <Headphones className="w-3 h-3" />
                              {song.play_count.toLocaleString()}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-white/5 text-zinc-400">
                              {song.genre}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col items-center gap-2">
                          <button
                            onClick={() => toggleLike(song.id)}
                            className={`p-1.5 rounded-full transition ${
                              liked ? "text-rose-500" : "text-zinc-500 hover:text-white"
                            }`}
                            title="ถูกใจ"
                          >
                            <Heart className={`w-4 h-4 ${liked ? "fill-rose-500" : ""}`} />
                          </button>
                          {playlists[0] && (
                            <button
                              onClick={() => addSongToPlaylist(playlists[0].id, song.id)}
                              className="p-1.5 rounded-full text-zinc-500 hover:text-emerald-400 transition"
                              title={`เพิ่มเข้าเพลย์ลิสต์ ${playlists[0].name}`}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Bottom Sticky Global Player */}
      <MusicPlayer />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={(email) => setUserEmail(email)}
      />
    </div>
  );
}
