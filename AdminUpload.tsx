"use client";
import React, { useState } from "react";
import { UploadCloud, Music, Image as ImageIcon, CheckCircle2, Sparkles } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { usePlayer } from "@/context/PlayerContext";

export default function AdminUpload() {
  const { setSongs } = usePlayer();
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [album, setAlbum] = useState("");
  const [genre, setGenre] = useState("Pop");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !artist) return;
    setLoading(true);
    setStatusMsg("");

    try {
      if (isSupabaseConfigured && supabase && audioFile && coverFile) {
        const audioExt = audioFile.name.split(".").pop();
        const coverExt = coverFile.name.split(".").pop();
        const audioPath = `${Date.now()}_track.${audioExt}`;
        const coverPath = `${Date.now()}_cover.${coverExt}`;

        const { error: audioErr } = await supabase.storage
          .from("songs")
          .upload(audioPath, audioFile);
        if (audioErr) throw audioErr;

        const { error: coverErr } = await supabase.storage
          .from("covers")
          .upload(coverPath, coverFile);
        if (coverErr) throw coverErr;

        const audioUrl = supabase.storage.from("songs").getPublicUrl(audioPath).data.publicUrl;
        const coverUrl = supabase.storage.from("covers").getPublicUrl(coverPath).data.publicUrl;

        const { data, error: dbErr } = await supabase
          .from("songs")
          .insert([
            {
              title,
              artist,
              album: album || "Single",
              genre,
              cover_url: coverUrl,
              audio_url: audioUrl,
              duration: 210,
            },
          ])
          .select()
          .single();

        if (dbErr) throw dbErr;
        if (data) setSongs((prev) => [data, ...prev]);
        setStatusMsg("อัปโหลดเพลงขึ้น Online Server สำเร็จแล้ว!");
      } else {
        // Local / Demo fallback preview
        const localAudio = audioFile
          ? URL.createObjectURL(audioFile)
          : "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3";
        const localCover = coverFile
          ? URL.createObjectURL(coverFile)
          : "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80";

        setSongs((prev) => [
          {
            id: `local-${Date.now()}`,
            title,
            artist,
            album: album || "Single",
            genre,
            cover_url: localCover,
            audio_url: localAudio,
            duration: 225,
            play_count: 1,
          },
          ...prev,
        ]);
        setStatusMsg(
          isSupabaseConfigured
            ? "เพิ่มเพลงเรียบร้อยแล้ว!"
            : "เพิ่มเพลงเข้าสู่ระบบจำลองเรียบร้อย (เชื่อมต่อ .env.local เพื่อบันทึกลง Cloud ถาวร)"
        );
      }

      setTitle("");
      setArtist("");
      setAlbum("");
      setAudioFile(null);
      setCoverFile(null);
    } catch (err: any) {
      setStatusMsg(`เกิดข้อผิดพลาด: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-4">
      <div className="bg-zinc-900/70 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Creator Upload Studio</h2>
            <p className="text-sm text-zinc-400">
              อัปโหลดไฟล์เพลง MP3 และหน้าปกอัลบั้มขึ้นสู่ระบบสตรีมมิ่งออนไลน์
            </p>
          </div>
        </div>

        <form onSubmit={handleUpload} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">ชื่อเพลง *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="เช่น คืนข้ามปี (Midnight)"
                className="w-full bg-zinc-950/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">ชื่อศิลปิน *</label>
              <input
                type="text"
                required
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder="เช่น Neon Band"
                className="w-full bg-zinc-950/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">อัลบั้ม</label>
              <input
                type="text"
                value={album}
                onChange={(e) => setAlbum(e.target.value)}
                placeholder="Single"
                className="w-full bg-zinc-950/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">แนวเพลง</label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full bg-zinc-950/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Pop">Pop</option>
                <option value="Electronic">Electronic / Synth</option>
                <option value="Lo-Fi">Lo-Fi / Chill</option>
                <option value="Indie Pop">Indie</option>
                <option value="Acoustic">Acoustic</option>
                <option value="Hip-Hop">Hip-Hop / R&B</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-white/10 hover:border-emerald-500/50 rounded-2xl bg-zinc-950/50 cursor-pointer transition">
              <Music className="w-7 h-7 text-emerald-400 mb-2" />
              <span className="text-xs font-medium text-zinc-300 text-center">
                {audioFile ? audioFile.name : "เลือกไฟล์เสียง (.MP3 / .WAV)"}
              </span>
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>

            <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-white/10 hover:border-cyan-500/50 rounded-2xl bg-zinc-950/50 cursor-pointer transition">
              <ImageIcon className="w-7 h-7 text-cyan-400 mb-2" />
              <span className="text-xs font-medium text-zinc-300 text-center">
                {coverFile ? coverFile.name : "เลือกรูปหน้าปก (.JPG / .PNG)"}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-zinc-950 font-bold text-sm shadow-lg shadow-emerald-500/25 transition flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {loading ? "กำลังอัปโหลดขึ้น Server..." : "เผยแพร่เพลงเข้าสู่ระบบ"}
          </button>

          {statusMsg && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{statusMsg}</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
