// src/App.tsx
import { useEffect, useState } from 'react'
import { useMusicStore } from './store/useMusicStore'
import { musicApi } from './services/api'
import type { Track } from './types/music'
import { Player } from './components/Player'
import {
  Search,
  Play,
  Heart,
  ChevronDown,
  Sun,
  Moon,
  AlertCircle,
  ArrowLeft,
  User
} from 'lucide-react'

import logoGsa from './assets/logo.png'

export default function App() {
  const { tracks, setTracks, setCurrentTrack, favorites, toggleFavorite } = useMusicStore()

  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showFavorites, setShowFavorites] = useState(false)
  const [selectedArtist, setSelectedArtist] = useState<any>(null)
  const [visibleCount, setVisibleCount] = useState(10)
  const [isDarkMode, setIsDarkMode] = useState(true)

  useEffect(() => {
    const root = window.document.documentElement
    if (isDarkMode) root.classList.add('dark')
    else root.classList.remove('dark')
  }, [isDarkMode])

  const fetchData = async (request: () => Promise<Track[]>) => {
    setLoading(true)
    setError(null)
    try {
      const data = await request()
      setTracks(data)
    } catch (err) {
      setError('Não foi possível carregar as músicas.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!showFavorites && !selectedArtist) {
      fetchData(() => musicApi.getTrendingTracks())
    }
  }, [showFavorites, selectedArtist])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchTerm.trim()) return
    setSelectedArtist(null)
    setShowFavorites(false)
    setVisibleCount(10)
    fetchData(() => musicApi.searchTracks(searchTerm))
  }

  const handleArtistClick = (artist: any) => {
    setShowFavorites(false)
    setSelectedArtist(artist)
    setVisibleCount(10)
    fetchData(() => musicApi.getUserTracks(artist.id))
  }

  const sourceTracks = showFavorites ? favorites : tracks
  const displayTracks = sourceTracks.slice(0, visibleCount)

  return (
    <div className="min-h-screen bg-white dark:bg-[#343838] text-zinc-900 dark:text-zinc-100 transition-colors duration-300">

      {/* HEADER FIXADO
          Escuro: #005f6b | Claro: #fa3419 (Coral vibrante)
      */}
      <header className="sticky top-0 z-50 w-full bg-[#fa3419] dark:bg-[#005f6b] backdrop-blur-md border-b border-black/10 dark:border-white/10 shadow-lg transition-all">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-24 flex items-center justify-between gap-8">

          <div
            className="flex items-center gap-4 cursor-pointer group shrink-0"
            onClick={() => { setSelectedArtist(null); setShowFavorites(false); }}
          >
            <div className="w-12 h-12">
              <img
                src={logoGsa}
                alt="GSA Logo"
                className="w-full h-full object-contain"
                onError={(e) => { e.currentTarget.src = "https://placehold.co/400x400/ffffff/000000?text=GSA" }}
              />
            </div>
            <h1 className="text-4xl font-black italic tracking-tighter uppercase hidden sm:block text-white">
              GSA
            </h1>
          </div>

          <div className="flex items-center gap-4 flex-1 justify-end max-w-2xl">
            <form onSubmit={handleSearch} className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Pesquisar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/20 dark:bg-white/10 border border-white/30 rounded-xl py-3 px-5 pl-12 outline-none focus:ring-2 focus:ring-white/50 text-sm text-white placeholder:text-white/70"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70" />
            </form>

            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-3 rounded-xl hover:bg-black/10 transition-all border border-white/20 shrink-0 text-white"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-white" />}
            </button>
          </div>
        </div>
      </header>

      <div className="relative z-10 p-4 md:p-10 pb-64">

        {/* CARD PRINCIPAL 
            Escuro: #008c9e | Claro: #f3e1b6 (Tom creme/areia)
        */}
        <main className="max-w-7xl mx-auto bg-[#f3e1b6] dark:bg-[#008c9e] p-8 md:p-12 rounded-[3.5rem] border border-black/5 dark:border-white/20 shadow-2xl backdrop-blur-md">

          {selectedArtist && (
            <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
              <button onClick={() => setSelectedArtist(null)} className="flex items-center gap-2 text-[#1d5e69] dark:text-white font-bold mb-6 hover:underline">
                <ArrowLeft className="w-5 h-5" /> Voltar
              </button>
              <div className="flex items-center gap-8 bg-black/5 dark:bg-black/10 p-8 rounded-[2.5rem] border border-black/10 dark:border-white/20">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-[#7cbc9a] dark:bg-[#005f6b] shadow-2xl border-4 border-white/20">
                  {selectedArtist.profile_picture ? (
                    <img src={selectedArtist.profile_picture['150x150']} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white"><User size={48} /></div>
                  )}
                </div>
                <div className="text-[#1d5e69] dark:text-white">
                  <h2 className="text-5xl font-black">{selectedArtist.name}</h2>
                  <p className="opacity-80 text-xl font-medium">@{selectedArtist.handle}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mb-12 flex-wrap gap-4">
            <h2 className="text-3xl font-bold text-[#1d5e69] dark:text-white">
              {selectedArtist ? `Discografia` : showFavorites ? 'Meus Favoritos' : 'Descobrir'}
            </h2>

            {!selectedArtist && (
              <div className="flex bg-black/10 dark:bg-black/20 p-1.5 rounded-2xl border border-black/5 dark:border-white/10 shadow-inner">
                <button onClick={() => setShowFavorites(false)} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${!showFavorites ? 'bg-[#23998e] text-white shadow-lg' : 'text-[#1d5e69]/70 dark:text-white/70'}`}>
                  Geral
                </button>
                <button onClick={() => setShowFavorites(true)} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${showFavorites ? 'bg-[#fa3419] text-white shadow-lg' : 'text-[#1d5e69]/70 dark:text-white/70'}`}>
                  Favoritos ({favorites.length})
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-10">
            {displayTracks.map((track) => (
              <div key={track.id} className="group relative">
                <button onClick={() => toggleFavorite(track)} className="absolute top-3 left-3 z-20 p-2.5 rounded-xl bg-black/20 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all hover:scale-110">
                  <Heart className={`w-4 h-4 ${favorites.some(f => f.id === track.id) ? 'fill-[#fa3419] text-[#fa3419]' : 'text-white'}`} />
                </button>

                <div className="relative aspect-square overflow-hidden rounded-[2.5rem] mb-5 shadow-xl cursor-pointer bg-white/20" onClick={() => setCurrentTrack(track)}>
                  <img src={track.artwork["480x480"]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={track.title} />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                    <div className="bg-white p-5 rounded-full text-[#008c9e] shadow-2xl scale-75 group-hover:scale-100 transition-all"><Play className="w-8 h-8 fill-current" /></div>
                  </div>
                </div>
                <h3 className="font-bold truncate text-lg px-2 text-[#1d5e69] dark:text-white">{track.title}</h3>
                <p onClick={() => handleArtistClick(track.user)} className="text-[#23998e] dark:text-white/70 text-sm truncate px-2 font-medium cursor-pointer hover:underline transition-colors">
                  {track.user.name}
                </p>
              </div>
            ))}
          </div>

          {sourceTracks.length > visibleCount && (
            <div className="flex justify-center mt-20 mb-10">
              <button
                onClick={() => setVisibleCount(v => v + 10)}
                className="group flex items-center gap-3 text-[#343838] hover:opacity-80 font-bold text-xl transition-all"
              >
                Carregar mais músicas
                <ChevronDown className="w-6 h-6 group-hover:translate-y-1 transition-transform" />
              </button>
            </div>
          )}
        </main>
        <Player />
      </div>
    </div>
  )
}