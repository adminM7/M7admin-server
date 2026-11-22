"use client";
import React, { createContext, useContext, useState, useRef, useEffect } from "react";
import { Song } from "@/types/music";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface PlayerContextType {
  songs: Song[];
  setSongs: React.Dispatch<React.SetStateAction<Song[]>>;
  currentSong: Song | null;
  isPlaying: boolean;
  progress: number;
  currentTime: number;
  duration: number;
  volume: number;
  isShuffle: boolean;
  repeatMode: "off" | "all" | "one";
  likedIds: string[];
  playSong: (song: Song) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrev: () => void;
  seek: (percentage: number) => void;
  setVolume: (vol: number) => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  toggleLike: (songId: string) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<"off" | "all" | "one">("all");
  const [likedIds, setLikedIds] = useState<string[]>(["demo-1", "demo-3"]);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audio.volume = volume;
    audioRef.current = audio;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const onEnded = () => {
      if (repeatMode === "one") {
        audio.currentTime = 0;
        audio.play();
      } else {
        playNext();
      }
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
    };
  }, [repeatMode, songs, currentSong, isShuffle]);

  const playSong = async (song: Song) => {
    if (!audioRef.current) return;
    if (currentSong?.id === song.id) {
      togglePlay();
      return;
    }
    setCurrentSong(song);
    audioRef.current.src = song.audio_url;
    try {
      await audioRef.current.play();
      setIsPlaying(true);
      setSongs((prev) =>
        prev.map((s) => (s.id === song.id ? { ...s, play_count: s.play_count + 1 } : s))
      );
      if (isSupabaseConfigured && supabase && !song.id.startsWith("demo-")) {
        await supabase.rpc("increment_play_count", { song_row_id: song.id });
      }
    } catch (err) {
      console.error("Audio playback error:", err);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current || !currentSong) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const playNext = () => {
    if (!songs.length || !currentSong) return;
    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * songs.length);
      playSong(songs[randomIndex]);
      return;
    }
    const idx = songs.findIndex((s) => s.id === currentSong.id);
    const nextIdx = idx + 1;
    if (nextIdx < songs.length) {
      playSong(songs[nextIdx]);
    } else if (repeatMode === "all") {
      playSong(songs[0]);
    } else {
      setIsPlaying(false);
    }
  };

  const playPrev = () => {
    if (!songs.length || !currentSong) return;
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }
    const idx = songs.findIndex((s) => s.id === currentSong.id);
    const prevIdx = (idx - 1 + songs.length) % songs.length;
    playSong(songs[prevIdx]);
  };

  const seek = (percentage: number) => {
    if (!audioRef.current || !audioRef.current.duration) return;
    const newTime = (percentage / 100) * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
    setProgress(percentage);
  };

  const setVolume = (vol: number) => {
    setVolumeState(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  const toggleShuffle = () => setIsShuffle((prev) => !prev);

  const cycleRepeat = () => {
    setRepeatMode((prev) => (prev === "off" ? "all" : prev === "all" ? "one" : "off"));
  };

  const toggleLike = (songId: string) => {
    setLikedIds((prev) =>
      prev.includes(songId) ? prev.filter((id) => id !== songId) : [...prev, songId]
    );
  };

  return (
    <PlayerContext.Provider
      value={{
        songs,
        setSongs,
        currentSong,
        isPlaying,
        progress,
        currentTime,
        duration,
        volume,
        isShuffle,
        repeatMode,
        likedIds,
        playSong,
        togglePlay,
        playNext,
        playPrev,
        seek,
        setVolume,
        toggleShuffle,
        cycleRepeat,
        toggleLike,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
};
