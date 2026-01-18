import { create } from 'zustand'
import type { Track } from '../types/music'

interface MusicState {
    tracks: Track[]
    currentTrack: Track | null
    favorites: Track[]
    setTracks: (tracks: Track[]) => void
    setCurrentTrack: (track: Track) => void
    toggleFavorite: (track: Track) => void
    // NOVO: Função para tocar a próxima
    playNext: () => void
}

export const useMusicStore = create<MusicState>((set, get) => ({
    tracks: [],
    currentTrack: null,
    favorites: [],
    setTracks: (tracks) => set({ tracks }),
    setCurrentTrack: (track) => set({ currentTrack: track }),
    toggleFavorite: (track) => {
        const { favorites } = get()
        const isFavorite = favorites.some((f) => f.id === track.id)
        if (isFavorite) {
            set({ favorites: favorites.filter((f) => f.id !== track.id) })
        } else {
            set({ favorites: [...favorites, track] })
        }
    },
    playNext: () => {
        const { tracks, currentTrack } = get()
        if (!currentTrack) return

        const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id)
        const nextIndex = (currentIndex + 1) % tracks.length // Volta ao início se for a última
        set({ currentTrack: tracks[nextIndex] })
    }
}))