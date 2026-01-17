// src/store/useMusicStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Track } from '../types/music';

interface MusicStore {
    // Estados de Reprodução
    tracks: Track[];
    currentTrack: Track | null;
    isPlaying: boolean;

    // Estados de Funcionalidades
    favorites: Track[];
    isShuffle: boolean;

    // Ações (Actions)
    setTracks: (tracks: Track[]) => void;
    setCurrentTrack: (track: Track | null) => void;
    setIsPlaying: (isPlaying: boolean) => void;
    toggleFavorite: (track: Track) => void;
    toggleShuffle: () => void;
}

export const useMusicStore = create<MusicStore>()(
    persist(
        (set) => ({
            // Valores Iniciais
            tracks: [],
            currentTrack: null,
            isPlaying: false,
            favorites: [],
            isShuffle: false,

            // Implementação das Ações
            setTracks: (tracks) => set({ tracks }),

            setCurrentTrack: (track) => set({
                currentTrack: track,
                isPlaying: !!track // Começa a tocar automaticamente se houver uma música
            }),

            setIsPlaying: (isPlaying) => set({ isPlaying }),

            toggleFavorite: (track) => set((state) => {
                const isFavorite = state.favorites.some((f) => f.id === track.id);
                if (isFavorite) {
                    return { favorites: state.favorites.filter((f) => f.id !== track.id) };
                }
                return { favorites: [...state.favorites, track] };
            }),

            toggleShuffle: () => set((state) => ({
                isShuffle: !state.isShuffle
            })),
        }),
        {
            name: 'audius-player-storage', // Nome da chave no LocalStorage do navegador
            // Escolhemos guardar apenas os favoritos e o estado do shuffle
            partialize: (state) => ({
                favorites: state.favorites,
                isShuffle: state.isShuffle
            }),
        }
    )
)