// src/App.tsx
import { useEffect, useState } from 'react'
import { useMusicStore } from './store/useMusicStore'
import { musicApi } from './services/api'
import { Player } from './components/Player'
import { Search, Play, Heart, ChevronDown, Sun, Moon } from 'lucide-react'

// IMPORTAÇÃO DO SEU ÍCONE
import logoGsa from './assets/logo.png'

export default function App() {
  const { tracks, setTracks, setCurrentTrack, favorites, toggleFavorite } = useMusicStore()

  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [showFavorites, setShowFavorites] = useState(false)
  const [visibleCount, setVisibleCount] = useState(10)
  const [isDarkMode, setIsDarkMode] = useState(true)

  // Controle do Tema
  useEffect(() => {
    const root = window.document.documentElement
    if (isDarkMode) root.classList.add('dark')
    else root.classList.remove('dark')
  }, [isDarkMode])

  // Carregar Músicas
  useEffect(() => {
    async function loadInitial() {
      setLoading(true)
      try {
        const data = await musicApi.getTrendingTracks()
        setTracks(data)
      } catch (e) { console.error(e) } finally { setLoading(false) }
    }
    if (!showFavorites) loadInitial()
  }, [setTracks, showFavorites])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchTerm.trim()) return
    setShowFavorites(false)
    setLoading(true)
    setVisibleCount(10)
    try {
      const results = await musicApi.searchTracks(searchTerm)
      setTracks(results)
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  const sourceTracks = showFavorites ? favorites : tracks
  const displayTracks = sourceTracks.slice(0, visibleCount)

  return (
    // Fundo Geral: Preto Puro no Dark
    <div className="min-h-screen bg-white dark:bg-[#131328] text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
      <div className="relative z-10 p-4 md:p-10 pb-64">

        {/* HEADER LIMPO */}
        <header className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8 mb-20">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20">
              <img
                src={logoGsa}
                alt="GSA Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = "https://placehold.co/400x400/3b82f6/white?text=GSA"
                }}
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-8xl font-black italic tracking-tighter leading-none uppercase">
                GSA
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <form onSubmit={handleSearch} className="relative flex-1 md:w-[400px]">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-100 dark:bg-[#0d1117] border border-zinc-200 dark:border-zinc-800 rounded-2xl py-4 px-6 pl-14 outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            </form>

            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-4 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all border border-zinc-200 dark:border-zinc-800"
            >
              {isDarkMode ? <Sun className="w-6 h-6 text-yellow-500" /> : <Moon className="w-6 h-6 text-blue-600" />}
            </button>
          </div>
        </header>

        {/* MAIN COM ALTO CONTRASTE (Deep Navy Card) */}
        <main className="max-w-7xl mx-auto bg-zinc-100/80 dark:bg-[#0d1117] p-8 md:p-12 rounded-[3.5rem] border border-zinc-200 dark:border-blue-500/10 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-12 flex-wrap gap-4">
            <h2 className="text-3xl font-bold">
              {showFavorites ? 'Favoritos' : 'Descubra novas Músicas'}
            </h2>

            <div className="flex bg-white dark:bg-[#050507] p-1.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-inner">
              <button
                onClick={() => { setShowFavorites(false); setVisibleCount(10); }}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${!showFavorites ? 'bg-blue-600 text-white shadow-lg' : 'text-zinc-500 hover:text-blue-500'}`}
              >
                Geral
              </button>
              <button
                onClick={() => { setShowFavorites(true); setVisibleCount(10); }}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${showFavorites ? 'bg-red-600 text-white shadow-lg' : 'text-zinc-500 hover:text-red-500'}`}
              >
                Favoritos ({favorites.length})
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-10">
              {displayTracks.map((track) => {
                const isFavorite = favorites.some(f => f.id === track.id)
                return (
                  <div key={track.id} className="group relative">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(track); }}
                      className="absolute top-3 left-3 z-20 p-2.5 rounded-xl bg-black/40 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                    >
                      <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                    </button>

                    <div
                      className="relative aspect-square overflow-hidden rounded-[2.5rem] mb-5 shadow-xl cursor-pointer bg-white dark:bg-[#050507]"
                      onClick={() => setCurrentTrack(track)}
                    >
                      <img src={track.artwork["480x480"]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="bg-blue-600 p-5 rounded-full text-white shadow-2xl">
                          <Play className="w-8 h-8 fill-current" />
                        </div>
                      </div>
                    </div>
                    <h3 className="font-bold truncate text-lg px-2">{track.title}</h3>
                    <p className="text-zinc-500 text-sm truncate px-2 font-medium">{track.user.name}</p>
                  </div>
                )
              })}
            </div>
          )}

          {sourceTracks.length > visibleCount && !loading && (
            <div className="flex justify-center mt-10 mb-14">
              <button
                onClick={() => setVisibleCount(v => v + 10)}
                className="group flex items-center gap-3 text-zinc-400 hover:text-blue-500 font-bold text-lg transition-all"
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