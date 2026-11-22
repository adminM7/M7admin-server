"use client";
import React from "react";
import { usePlayer } from "@/context/PlayerContext";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  VolumeX,
  Heart,
} from "lucide-react";

function formatTime(sec: number) {
  if (!sec || isNaN(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

export default function MusicPlayer() {
  const {
    currentSong,
    isPlaying,
    progress,
    currentTime,
    duration,
    volume,
    isShuffle,
    repeatMode,
    likedIds,
    togglePlay,
    playNext,
    playPrev,
    seek,
    setVolume,
    toggleShuffle,
    cycleRepeat,
    toggleLike,
  } = usePlayer();

  if (!currentSong) {
    return (
      <div className="h-24 bg-zinc-950/95 backdrop-blur-xl border-t border-white/10 px-6 flex items-center justify-center text-sm text-zinc-500">
        เลือกเพลงที่ต้องการฟังจากรายการด้านบนเพื่อเริ่มต้นสตรีมมิ่ง
      </div>
    );
  }

  const isLiked = likedIds.includes(currentSong.id);

  return (
    <div className="h-24 bg-zinc-950/95 backdrop-blur-2xl border-t border-white/10 px-4 md:px-8 flex items-center justify-between gap-4 z-50">
      {/* Track Info */}
      <div className="flex items-center gap-3.5 w-1/3 min-w-[180px]">
        <div className="relative group w-14 h-14 rounded-xl overflow-hidden shadow-lg shrink-0">
          <img
            src={currentSong.cover_url}
            alt={currentSong.title}
            className={`w-full h-full object-cover transition-transform duration-700 ${
              isPlaying ? "scale-105" : ""
            }`}
          />
        </div>
        <div className="min-w-0">
          <h4 className="font-semibold text-sm text-white truncate">{currentSong.title}</h4>
          <p className="text-xs text-zinc-400 truncate mt-0.5">{currentSong.artist}</p>
        </div>
        <button
          onClick={() => toggleLike(currentSong.id)}
          className={`p-2 rounded-full transition ${
            isLiked ? "text-rose-500" : "text-zinc-400 hover:text-white"
          }`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? "fill-rose-500" : ""}`} />
        </button>
      </div>

      {/* Center Controls */}
      <div className="flex flex-col items-center max-w-xl w-full gap-1.5">
        <div className="flex items-center gap-5">
          <button
            onClick={toggleShuffle}
            className={`transition ${
              isShuffle ? "text-emerald-400" : "text-zinc-400 hover:text-white"
            }`}
            title="สุ่มเพลง"
          >
            <Shuffle className="w-4 h-4" />
          </button>
          <button
            onClick={playPrev}
            className="text-zinc-300 hover:text-white transition"
            title="เพลงก่อนหน้า"
          >
            <SkipBack className="w-5 h-5 fill-current" />
          </button>
          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-white text-black hover:scale-105 active:scale-95 flex items-center justify-center shadow-lg shadow-white/10 transition"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>
          <button
            onClick={playNext}
            className="text-zinc-300 hover:text-white transition"
            title="เพลงถัดไป"
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </button>
          <button
            onClick={cycleRepeat}
            className={`transition ${
              repeatMode !== "off" ? "text-emerald-400" : "text-zinc-400 hover:text-white"
            }`}
            title="เล่นซ้ำ"
          >
            {repeatMode === "one" ? (
              <Repeat1 className="w-4 h-4" />
            ) : (
              <Repeat className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full flex items-center gap-2.5 text-[11px] text-zinc-400 font-mono">
          <span className="w-10 text-right">{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={progress || 0}
            onChange={(e) => seek(Number(e.target.value))}
            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
          />
          <span className="w-10">{formatTime(duration || currentSong.duration)}</span>
        </div>
      </div>

      {/* Volume */}
      <div className="hidden md:flex items-center justify-end gap-2.5 w-1/3">
        <button
          onClick={() => setVolume(volume > 0 ? 0 : 0.8)}
          className="text-zinc-400 hover:text-white transition"
        >
          {volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.02"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="w-28 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
        />
      </div>
    </div>
  );
}
