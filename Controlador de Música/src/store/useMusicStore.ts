import { create } from 'zustand';
import type { Track } from '../types/music';

interface MusicState {
    tracks: Track[]; // Faltava isso
    currentTrack: Track | null;
    isPlaying: boolean;
    volume: number;
    favorites: Track[];
    history: Track[];

    // Ações
    setTracks: (tracks: Track[]) => void; // Faltava isso
    setCurrentTrack: (track: Track | null) => void;
    setIsPlaying: (playing: boolean) => void;
    setVolume: (volume: number) => void;
    toggleFavorite: (track: Track) => void;
    addToHistory: (track: Track) => void;
    playNext: () => void; // Faltava isso
    playPrevious: () => void; // Faltava isso
}

export const useMusicStore = create<MusicState>((set, get) => ({
    tracks: [],
    currentTrack: null,
    isPlaying: false,
    volume: 1,
    favorites: [],
    history: [],

    setTracks: (tracks) => set({ tracks }),

    setCurrentTrack: (track) => {
        set({ currentTrack: track, isPlaying: !!track });
        if (track) get().addToHistory(track);
    },

    setIsPlaying: (playing) => set({ isPlaying: playing }),

    setVolume: (volume) => set({ volume }),

    toggleFavorite: (track) => set((state) => ({
        favorites: state.favorites.some((f) => f.id === track.id)
            ? state.favorites.filter((f) => f.id !== track.id)
            : [...state.favorites, track],
    })),

    addToHistory: (track) => set((state) => ({
        history: [track, ...state.history.filter((t) => t.id !== track.id)].slice(0, 50),
    })),

    // Lógica para avançar a música
    playNext: () => {
        const { tracks, currentTrack, setCurrentTrack } = get();
        if (!currentTrack) return;
        const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
        const nextTrack = tracks[currentIndex + 1] || tracks[0];
        setCurrentTrack(nextTrack);
    },

    // Lógica para voltar a música
    playPrevious: () => {
        const { tracks, currentTrack, setCurrentTrack } = get();
        if (!currentTrack) return;
        const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
        const prevTrack = tracks[currentIndex - 1] || tracks[tracks.length - 1];
        setCurrentTrack(prevTrack);
    },
}));