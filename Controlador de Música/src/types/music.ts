// src/types/music.ts

export interface Track {
    id: string;
    title: string;
    stream_url: string | undefined;
    user: {
        name: string;
    };
    artwork: {
        "150x150"?: string; // Adicionado como opcional
        "480x480": string;
    };
    duration: number;
}

export interface MusicState {
    currentTrack: Track | null;
    isPlaying: boolean;
    tracks: Track[];
    setTracks: (tracks: Track[]) => void;
    setCurrentTrack: (track: Track) => void;
    setIsPlaying: (status: boolean) => void;
}
export interface Playlist {
    id: string;
    name: string;
    tracks: Track[];
}