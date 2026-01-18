import { useEffect, useState } from 'react'
import { useMusicStore } from './store/useMusicStore'
import { musicApi } from './services/api'
import { useTheme } from './components/hooks/useTheme'
import { TrackCard } from './components/ui/TrackCard'
import { SkeletonCard } from './components/SkeletonCard'
import { Player } from './components/Player'
import { Header } from './components/Header'
import { AlertCircle, ChevronDown, ArrowLeft, User, Clock } from 'lucide-react'

export default function App() {
  const { tracks, setTracks, setCurrentTrack, favorites, toggleFavorite, history } = useMusicStore()
  const { isDarkMode, toggleTheme } = useTheme()

  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedArtist, setSelectedArtist] = useState<any>(null)
  const [visibleCount, setVisibleCount] = useState(10)

  // Controle de qual lista mostrar: 'all', 'fav' ou 'hist'
  const [activeTab, setActiveTab] = useState<'all' | 'fav' | 'hist'>('all')

  const fetchData = async (request: () => Promise<any>) => {
    setLoading(true); setError(null)
    try {
      const data = await request()
      if (!data || data.length === 0) setError('Nenhuma música encontrada.')
      else setTracks(data)
    } catch {
      setError('Erro de conexão. A rede Audius pode estar instável.')
    } finally { setLoading(false) }
  }

  useEffect(() => {
    if (activeTab === 'all' && !selectedArtist) fetchData(musicApi.getTrendingTracks)
  }, [activeTab, selectedArtist])

  // Define qual array de músicas será renderizado
  const getDisplayList = () => {
    if (activeTab === 'fav') return favorites
    if (activeTab === 'hist') return history
    return tracks
  }

  const tracksToRender = getDisplayList().slice(0, visibleCount)

  return (
    <div className="min-h-screen bg-white dark:bg-[#343838] text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearch={(e: any) => { e.preventDefault(); fetchData(() => musicApi.searchTracks(searchTerm)) }}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        resetView={() => { setSelectedArtist(null); setActiveTab('all'); }}
      />

      <div className="relative z-10 p-4 md:p-10 pb-64">
        <main className="max-w-7xl mx-auto bg-[#f3e1b6] dark:bg-[#008c9e] p-8 md:p-12 rounded-[3.5rem] shadow-2xl">

          <div className="flex items-center justify-between mb-12 flex-wrap gap-4">
            <h2 className="text-3xl font-bold text-[#1d5e69] dark:text-white">
              {selectedArtist ? 'Discografia' : activeTab === 'fav' ? 'Meus Favoritos' : activeTab === 'hist' ? 'Ouvidas Recentemente' : 'Descobrir'}
            </h2>

            {!selectedArtist && (
              <div className="flex bg-black/10 dark:bg-black/20 p-1.5 rounded-2xl gap-2 shadow-inner">
                <button onClick={() => setActiveTab('all')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'all' ? 'bg-[#23998e] text-white shadow-md' : 'opacity-60'}`}>Geral</button>
                <button onClick={() => setActiveTab('fav')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'fav' ? 'bg-[#fa3419] text-white shadow-md' : 'opacity-60'}`}>Favoritos</button>
                <button onClick={() => setActiveTab('hist')} className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'hist' ? 'bg-[#343838] text-white shadow-md' : 'opacity-60'}`}>
                  <Clock size={16} /> Histórico
                </button>
              </div>
            )}
          </div>

          {error ? (
            <div className="text-center py-20"><AlertCircle className="mx-auto mb-4 opacity-50" size={48} />{error}</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-10">
              {loading ? (
                Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)
              ) : (
                tracksToRender.map((track) => (
                  <TrackCard
                    key={track.id}
                    track={track}
                    isFavorite={favorites.some(f => f.id === track.id)}
                    onPlay={setCurrentTrack}
                    onFavorite={toggleFavorite}
                    onArtistClick={(artist: any) => { setSelectedArtist(artist); setActiveTab('all'); fetchData(() => musicApi.getUserTracks(artist.id)); }}
                  />
                ))
              )}
            </div>
          )}

          {!loading && getDisplayList().length > visibleCount && (
            <button onClick={() => setVisibleCount(v => v + 10)} className="mt-10 mb-10 mx-auto flex items-center gap-2 font-bold hover:opacity-70 transition-opacity">
              Carregar mais <ChevronDown size={20} />
            </button>
          )}
        </main>
      </div>
      <Player />
    </div>
  )
}