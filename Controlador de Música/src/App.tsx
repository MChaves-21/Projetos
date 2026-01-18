import { useEffect, useState, useCallback } from 'react'
import { useMusicStore } from './store/useMusicStore'
import { musicApi } from './services/api'
import { useTheme } from './components/hooks/useTheme'
import { TrackCard } from './components/ui/TrackCard'
import { SkeletonCard } from './components/SkeletonCard'
import { Player } from './components/Player'
import { Header } from './components/Header'
import { AlertCircle, ChevronDown, Clock, RefreshCcw } from 'lucide-react'
import type { Track } from './types/music'

export default function App() {
  const { tracks, setTracks, favorites, history } = useMusicStore()
  const { isDarkMode, toggleTheme } = useTheme()

  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedArtist, setSelectedArtist] = useState<{ id: string, name: string } | null>(null)
  const [visibleCount, setVisibleCount] = useState(10)
  const [activeTab, setActiveTab] = useState<'all' | 'fav' | 'hist'>('all')

  const fetchData = useCallback(async (request: () => Promise<any>) => {
    setLoading(true)
    setError(null)
    try {
      const data = await request()
      if (data && Array.isArray(data)) {
        setTracks(data)
        if (data.length === 0) setError('Nenhuma música encontrada.')
      } else {
        throw new Error('Resposta inválida')
      }
    } catch (err) {
      setError('O servidor demorou a responder. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }, [setTracks])

  useEffect(() => {
    if (activeTab === 'all' && !selectedArtist) {
      fetchData(musicApi.getTrendingTracks)
    }
  }, [activeTab, selectedArtist, fetchData])

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
        onSearch={(e: React.FormEvent) => {
          e.preventDefault()
          if (!searchTerm.trim()) return
          setSelectedArtist(null)
          setActiveTab('all')
          setVisibleCount(10)
          fetchData(() => musicApi.searchTracks(searchTerm))
        }}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        resetView={() => {
          setSelectedArtist(null);
          setActiveTab('all');
          setSearchTerm('');
          setVisibleCount(10);
        }}
      />

      <div className="relative z-10 p-4 md:p-10 pb-64">
        <main className="max-w-7xl mx-auto bg-[#f3e1b6] dark:bg-[#008c9e] p-8 md:p-12 rounded-[3.5rem] shadow-2xl min-h-[60vh]">

          <div className="flex items-center justify-between mb-12 flex-wrap gap-4">
            <h2 className="text-3xl font-bold text-[#1d5e69] dark:text-white">
              {selectedArtist ? `Top: ${selectedArtist.name}` : activeTab === 'fav' ? 'Favoritos' : activeTab === 'hist' ? 'Histórico' : 'Descobrir'}
            </h2>

            {!selectedArtist && (
              <div className="flex bg-black/10 dark:bg-black/20 p-1.5 rounded-2xl gap-2 shadow-inner">
                <button onClick={() => { setActiveTab('all'); setVisibleCount(10); }} className={`px-4 py-2 rounded-xl text-sm font-bold ${activeTab === 'all' ? 'bg-[#23998e] text-white shadow-md' : 'opacity-60'}`}>Geral</button>
                <button onClick={() => { setActiveTab('fav'); setVisibleCount(10); }} className={`px-4 py-2 rounded-xl text-sm font-bold ${activeTab === 'fav' ? 'bg-[#fa3419] text-white shadow-md' : 'opacity-60'}`}>Favoritos</button>
                <button onClick={() => { setActiveTab('hist'); setVisibleCount(10); }} className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 ${activeTab === 'hist' ? 'bg-[#343838] text-white shadow-md' : 'opacity-60'}`}>
                  <Clock size={16} /> Histórico
                </button>
              </div>
            )}
          </div>

          {error ? (
            <div className="flex flex-col items-center py-20">
              <AlertCircle className="mb-4 text-[#fa3419]" size={64} />
              <p className="font-medium">{error}</p>
              <button onClick={() => fetchData(musicApi.getTrendingTracks)} className="mt-6 flex items-center gap-2 bg-[#1d5e69] text-white px-6 py-3 rounded-full font-bold">
                <RefreshCcw size={20} /> Tentar novamente
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-10">
                {loading ? (
                  Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)
                ) : (
                  tracksToRender.map((track: Track) => (
                    <TrackCard
                      key={track.id}
                      track={track}
                      onArtistClick={(artist: any) => {
                        setSelectedArtist({ id: artist.id.toString(), name: artist.name });
                        setActiveTab('all');
                        setVisibleCount(10);
                        fetchData(() => musicApi.getUserTracks(artist.id.toString()));
                      }}
                    />
                  ))
                )}
              </div>

              {/* LÓGICA DO BOTÃO CORRIGIDA */}
              {!loading && getDisplayList().length > visibleCount && (
                <div className="flex justify-center w-full mt-16 mb-8">
                  <button
                    onClick={() => setVisibleCount(v => v + 10)}
                    className="flex items-center gap-2 font-bold px-10 py-4 rounded-full bg-white/20 dark:bg-black/20 hover:bg-[#fa3419] hover:text-white transition-all shadow-md"
                  >
                    Ver mais músicas <ChevronDown size={20} />
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
      <Player />
    </div>
  )
}