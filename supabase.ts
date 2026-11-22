import { createClient } from "@supabase/supabase-js";
import { Song } from "@/types/music";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured =
  supabaseUrl.startsWith("https://") &&
  !supabaseUrl.includes("your-project-id") &&
  supabaseAnonKey.length > 20;

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const DEMO_SONGS: Song[] = [
  {
    id: "demo-1",
    title: "Midnight Neon Drive",
    artist: "SynthWave Collective",
    album: "Cyber Horizons",
    genre: "Electronic",
    cover_url: "https://images.unsplash.com/photo-1614149162883-504ce4d13909?w=600&q=80",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: 372,
    play_count: 14250,
  },
  {
    id: "demo-2",
    title: "Velvet Rain in Bangkok",
    artist: "Lofi & Chill Studio",
    album: "Late Night Coffee",
    genre: "Lo-Fi",
    cover_url: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&q=80",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    duration: 425,
    play_count: 9840,
  },
  {
    id: "demo-3",
    title: "Starlight Echoes",
    artist: "Aurora Nova",
    album: "Celestial",
    genre: "Indie Pop",
    cover_url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    duration: 344,
    play_count: 21500,
  },
  {
    id: "demo-4",
    title: "Golden Hour Acoustic",
    artist: "The Sunday Acoustic",
    album: "Warm Breeze",
    genre: "Acoustic",
    cover_url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    duration: 302,
    play_count: 7630,
  },
  {
    id: "demo-5",
    title: "Deep Bass Pulse",
    artist: "Club District",
    album: "Afterhours Vol. 2",
    genre: "House",
    cover_url: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=600&q=80",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    duration: 390,
    play_count: 18920,
  },
  {
    id: "demo-6",
    title: "Dreamscape Piano",
    artist: "Clara Vance",
    album: "Solitude",
    genre: "Classical",
    cover_url: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=600&q=80",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
    duration: 315,
    play_count: 11200,
  }
];
