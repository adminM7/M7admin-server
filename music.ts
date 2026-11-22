export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  cover_url: string;
  audio_url: string;
  duration: number;
  play_count: number;
  created_at?: string;
}

export interface Playlist {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  cover_url?: string;
  created_at?: string;
}
