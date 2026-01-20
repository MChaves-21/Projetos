import { useEffect, useState, useCallback } from 'react'
import { useMusicStore } from './store/useMusicStore'
import { musicApi } from './services/api'
import { useTheme } from './components/hooks/useTheme'
import { TrackCard } from './components/ui/TrackCard'
import { SkeletonCard } from './components/SkeletonCard'
import { Player } from './components/Player'
import { Header } from './components/Header'
import { PlaylistModal } from './components/PlaylistModal'
import { ChevronDown, Clock, ListMusic, Plus, ArrowLeft, Trash2 } from 'lucide-react'

export default function App() {
  const { tracks, setTracks, favorites, history, playlists, removePlaylist } = useMusicStore()
  const { isDarkMode, toggleTheme } = useTheme()

  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedArtist, setSelectedArtist] = useState<{ id: string, name: string } | null>(null)
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null)
  const [visibleCount, setVisibleCount] = useState(10)
  const [activeTab, setActiveTab] = useState<'all' | 'fav' | 'hist' | 'playlists'>('all')
  const [showPlaylistModal, setShowPlaylistModal] = useState(false)

  const fetchData = useCallback(async (request: () => Promise<any>) => {
    setLoading(true); setError(null)
    try {
      const data = await request()
      if (data && Array.isArray(data)) setTracks(data)
    } catch {
      setError('Erro ao carregar músicas.')
    } finally { setLoading(false) }
  }, [setTracks])

  useEffect(() => {
    if (activeTab === 'all' && !selectedArtist) fetchData(musicApi.getTrendingTracks)
  }, [activeTab, selectedArtist, fetchData])

  const getDisplayList = () => {
    if (activeTab === 'fav') return favorites
    if (activeTab === 'hist') return history
    if (activeTab === 'playlists' && selectedPlaylistId) {
      return playlists.find(p => p.id === selectedPlaylistId)?.tracks || []
    }
    return tracks
  }

  const tracksToRender = getDisplayList().slice(0, visibleCount)

  return (
    <div className="min-h-screen bg-white dark:bg-[#343838] text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
      <Header
        searchTerm={searchTerm} setSearchTerm={setSearchTerm}
        onSearch={(e: any) => {
          e.preventDefault(); setSelectedArtist(null); setSelectedPlaylistId(null);
          setActiveTab('all'); fetchData(() => musicApi.searchTracks(searchTerm))
        }}
        isDarkMode={isDarkMode} toggleTheme={toggleTheme}
        resetView={() => { setSelectedArtist(null); setSelectedPlaylistId(null); setActiveTab('all'); setVisibleCount(10); }}
      />

      {showPlaylistModal && <PlaylistModal onClose={() => setShowPlaylistModal(false)} />}

      <div className="relative z-10 p-4 md:p-10 pb-64">
        <main className="max-w-7xl mx-auto bg-[#f3e1b6] dark:bg-[#008c9e] p-8 md:p-12 rounded-[3.5rem] shadow-2xl min-h-[60vh]">

          <div className="flex items-center justify-between mb-12 flex-wrap gap-4">
            <h2 className="text-3xl font-bold text-[#1d5e69] dark:text-white">
              {selectedArtist ? `Top: ${selectedArtist.name}` :
                selectedPlaylistId ? `Playlist: ${playlists.find(p => p.id === selectedPlaylistId)?.name}` :
                  activeTab === 'fav' ? 'Favoritos' :
                    activeTab === 'hist' ? 'Histórico' :
                      activeTab === 'playlists' ? 'Minhas Playlists' : 'Descobrir'}
            </h2>

            <div className="flex bg-black/10 dark:bg-black/20 p-1.5 rounded-2xl gap-2 shadow-inner overflow-x-auto">
              <button onClick={() => { setActiveTab('all'); setSelectedPlaylistId(null); }} className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap ${activeTab === 'all' && !selectedPlaylistId ? 'bg-[#23998e] text-white shadow-md' : 'opacity-60'}`}>Geral</button>
              <button onClick={() => { setActiveTab('fav'); setSelectedPlaylistId(null); }} className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap ${activeTab === 'fav' ? 'bg-[#fa3419] text-white shadow-md' : 'opacity-60'}`}>Favoritos</button>
              <button onClick={() => { setActiveTab('hist'); setSelectedPlaylistId(null); }} className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 ${activeTab === 'hist' ? 'bg-[#343838] text-white shadow-md' : 'opacity-60'}`}><Clock size={16} /> Histórico</button>
              <button onClick={() => { setActiveTab('playlists'); setSelectedPlaylistId(null); }} className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 whitespace-nowrap ${activeTab === 'playlists' ? 'bg-[#1d5e69] text-white shadow-md' : 'opacity-60'}`}><ListMusic size={16} /> Playlists</button>
            </div>
          </div>

          {activeTab === 'playlists' && !selectedPlaylistId ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {playlists.map(p => (
                <div key={p.id} className="relative group">
                  <button onClick={() => setSelectedPlaylistId(p.id)} className="w-full flex items-center gap-5 p-6 bg-white/40 dark:bg-black/20 rounded-[2.5rem] hover:bg-[#23998e] hover:text-white transition-all text-left">
                    <div className="p-4 bg-[#23998e] rounded-2xl text-white group-hover:bg-white/20"><ListMusic size={32} /></div>
                    <div><p className="font-bold text-xl">{p.name}</p><p className="text-sm opacity-60">{p.tracks.length} músicas</p></div>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); if (confirm("Excluir playlist?")) removePlaylist(p.id); }}
                    className="absolute top-4 right-4 p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-full transition-all opacity-0 group-hover:opacity-100 shadow-lg"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              <button onClick={() => setShowPlaylistModal(true)} className="border-2 border-dashed border-[#1d5e69]/30 rounded-[2.5rem] p-6 flex items-center justify-center gap-3 hover:border-[#23998e] hover:text-[#23998e] transition-colors font-bold"><Plus /> Criar Nova</button>
            </div>
          ) : (
            <>
              {selectedPlaylistId && (
                <button onClick={() => setSelectedPlaylistId(null)} className="mb-8 flex items-center gap-2 text-sm font-bold hover:text-[#fa3419] transition-colors"><ArrowLeft size={16} /> Voltar</button>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-10">
                {loading ? Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />) :
                  tracksToRender.map((track) => (
                    <TrackCard key={track.id} track={track} onArtistClick={(artist: any) => { setSelectedArtist({ id: artist.id.toString(), name: artist.name }); setSelectedPlaylistId(null); setActiveTab('all'); fetchData(() => musicApi.getUserTracks(artist.id.toString())); }} />
                  ))
                }
              </div>
              {!loading && getDisplayList().length > visibleCount && (
                <div className="flex justify-center mt-16"><button onClick={() => setVisibleCount(v => v + 10)} className="flex items-center gap-2 font-bold px-10 py-4 rounded-full bg-white/20 dark:bg-black/20 hover:bg-[#fa3419] hover:text-white transition-all">Ver mais <ChevronDown size={20} /></button></div>
              )}
            </>
          )}
        </main>
      </div>
      <Player />
    </div>
  )
}