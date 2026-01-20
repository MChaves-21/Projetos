import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Track } from '../types/music'

interface Playlist {
    id: string
    name: string
    tracks: Track[]
}

interface MusicStore {
    tracks: Track[]
    loading: boolean
    error: string | null
    favorites: Track[]
    history: Track[]
    playlists: Playlist[]
    currentTrack: Track | null
    isPlaying: boolean
    isShuffle: boolean
    isLooping: boolean
    volume: number

    setTracks: (tracks: Track[]) => void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
    setCurrentTrack: (track: Track) => void
    setIsPlaying: (isPlaying: boolean) => void
    toggleFavorite: (track: Track) => void
    toggleShuffle: () => void
    toggleLoop: () => void
    setVolume: (vol: number) => void
    createPlaylist: (name: string) => void
    removePlaylist: (id: string) => void
    addTrackToPlaylist: (playlistId: string, track: Track) => void
    removeTrackFromPlaylist: (playlistId: string, trackId: string) => void
}

export const useMusicStore = create<MusicStore>()(
    persist(
        (set) => ({
            tracks: [],
            loading: false,
            error: null,
            favorites: [],
            history: [],
            playlists: [],
            currentTrack: null,
            isPlaying: false,
            isShuffle: false,
            isLooping: false,
            volume: 1,

            setTracks: (tracks) => set({ tracks }),
            setLoading: (loading) => set({ loading }),
            setError: (error) => set({ error }),

            setCurrentTrack: (track) => set((state) => ({
                currentTrack: track,
                isPlaying: true,
                history: [track, ...state.history.filter((t) => t.id !== track.id)].slice(0, 50)
            })),

            setIsPlaying: (isPlaying) => set({ isPlaying }),
            toggleShuffle: () => set((state) => ({ isShuffle: !state.isShuffle })),
            toggleLoop: () => set((state) => ({ isLooping: !state.isLooping })),
            setVolume: (volume) => set({ volume }),

            toggleFavorite: (track) => set((state) => {
                const isFav = state.favorites.find((t) => t.id === track.id)
                return {
                    favorites: isFav ? state.favorites.filter((t) => t.id !== track.id) : [...state.favorites, track]
                }
            }),

            createPlaylist: (name) => set((state) => ({
                playlists: [...state.playlists, { id: crypto.randomUUID(), name, tracks: [] }]
            })),

            removePlaylist: (id) => set((state) => ({
                playlists: state.playlists.filter((p) => p.id !== id)
            })),

            addTrackToPlaylist: (playlistId, track) => set((state) => ({
                playlists: state.playlists.map((p) =>
                    p.id === playlistId && !p.tracks.find((t) => t.id === track.id)
                        ? { ...p, tracks: [...p.tracks, track] } : p
                )
            })),

            removeTrackFromPlaylist: (playlistId, trackId) => set((state) => ({
                playlists: state.playlists.map((p) =>
                    p.id === playlistId ? { ...p, tracks: p.tracks.filter((t) => t.id !== trackId) } : p
                )
            })),
        }),
        {
            name: 'gsa-music-storage',
            partialize: (state) => ({
                favorites: state.favorites,
                history: state.history,
                playlists: state.playlists,
                volume: state.volume,
                isShuffle: state.isShuffle,
                isLooping: state.isLooping,
                currentTrack: state.currentTrack
            })
        }
    )
)