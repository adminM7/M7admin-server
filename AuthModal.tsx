"use client";
import React, { useState } from "react";
import { X, Mail, Lock, UserCheck } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (email: string) => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      if (isSupabaseConfigured && supabase) {
        if (isSignUp) {
          const { error } = await supabase.auth.signUp({ email, password });
          if (error) throw error;
          setMsg("สมัครสมาชิกสำเร็จ! กรุณาตรวจสอบอีเมลหรือเข้าสู่ระบบ");
        } else {
          const { error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) throw error;
          onSuccess(email);
          onClose();
        }
      } else {
        onSuccess(email || "guest@neonwave.io");
        onClose();
      }
    } catch (err: any) {
      setMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 border border-white/10 rounded-3xl max-w-md w-full p-7 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              {isSignUp ? "สมัครสมาชิก NeonWave" : "เข้าสู่ระบบสมาชิก"}
            </h3>
            <p className="text-xs text-zinc-400">ซิงค์เพลย์ลิสต์และเพลงโปรดของคุณบนคลาวด์</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="อีเมลของคุณ"
              className="w-full bg-zinc-950 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="รหัสผ่าน (อย่างน้อย 6 ตัวอักษร)"
              className="w-full bg-zinc-950 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {msg && <p className="text-xs text-emerald-400">{msg}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-sm transition"
          >
            {loading ? "กำลังดำเนินการ..." : isSignUp ? "สร้างบัญชีผู้ใช้" : "เข้าสู่ระบบ"}
          </button>
        </form>

        <div className="mt-5 text-center text-xs text-zinc-400">
          {isSignUp ? "มีบัญชีอยู่แล้ว? " : "ยังไม่มีบัญชีใช่ไหม? "}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-emerald-400 font-semibold hover:underline"
          >
            {isSignUp ? "เข้าสู่ระบบ" : "สมัครสมาชิกฟรี"}
          </button>
        </div>
      </div>
    </div>
  );
}
