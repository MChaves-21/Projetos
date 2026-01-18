import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Track } from '../types/music'

interface MusicState {
    tracks: Track[]
    currentTrack: Track | null
    favorites: Track[]
    history: Track[]
    volume: number // Novo
    setTracks: (tracks: Track[]) => void
    setCurrentTrack: (track: Track) => void
    setVolume: (volume: number) => void // Novo
    toggleFavorite: (track: Track) => void
    playNext: () => void // Novo
    playPrevious: () => void // Novo
}

export const useMusicStore = create<MusicState>()(
    persist(
        (set, get) => ({
            tracks: [],
            currentTrack: null,
            favorites: [],
            history: [],
            volume: 1, // Volume máximo por padrão (0 a 1)

            setTracks: (tracks) => set({ tracks }),

            setVolume: (volume) => set({ volume }),

            setCurrentTrack: (track) => set((state) => {
                const filteredHistory = state.history.filter((t) => t.id !== track.id)
                return {
                    currentTrack: track,
                    history: [track, ...filteredHistory].slice(0, 10)
                }
            }),

            // Lógica para pular música
            playNext: () => {
                const { tracks, currentTrack, setCurrentTrack } = get()
                const currentIndex = tracks.findIndex(t => t.id === currentTrack?.id)
                if (currentIndex !== -1 && currentIndex < tracks.length - 1) {
                    setCurrentTrack(tracks[currentIndex + 1])
                } else if (tracks.length > 0) {
                    setCurrentTrack(tracks[0]) // Volta para a primeira se acabar a lista
                }
            },

            // Lógica para voltar música
            playPrevious: () => {
                const { tracks, currentTrack, setCurrentTrack } = get()
                const currentIndex = tracks.findIndex(t => t.id === currentTrack?.id)
                if (currentIndex > 0) {
                    setCurrentTrack(tracks[currentIndex - 1])
                }
            },

            toggleFavorite: (track) => set((state) => {
                const isFav = state.favorites.some((f) => f.id === track.id)
                return {
                    favorites: isFav
                        ? state.favorites.filter((f) => f.id !== track.id)
                        : [...state.favorites, track]
                }
            }),
        }),
        {
            name: 'gsa-music-storage',
            partialize: (state) => ({
                favorites: state.favorites,
                history: state.history,
                volume: state.volume
            }),
        }
    )
)