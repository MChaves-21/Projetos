// src/types/music.ts

export interface Track {
    id: string;
    title: string;
    user: {
        name: string;
    };
    artwork: {
        "480x480": string;
    };
    duration: number;
}

// Movendo a lógica de tipos para cá
export interface MusicState {
    currentTrack: Track | null;
    isPlaying: boolean;
    tracks: Track[];
    setTracks: (tracks: Track[]) => void;
    setCurrentTrack: (track: Track) => void;
    setIsPlaying: (status: boolean) => void;
}