import { useEffect, useState, useCallback } from 'react'
import { useMusicStore } from './store/useMusicStore'
import { musicApi } from './services/api'
import { useTheme } from './components/hooks/useTheme'
import { TrackCard } from './components/ui/TrackCard'
import { SkeletonCard } from './components/SkeletonCard'
import { Player } from './components/Player'
import { Header } from './components/Header'
import { PlaylistModal } from './components/PlaylistModal'
import { TabNavigation } from './components/layout/TabNavigation'
import { Toast } from './components/ui/Toast'
import { AlertCircle, ListMusic, Plus, ArrowLeft, Trash2 } from 'lucide-react'

export default function App() {
  const {
    tracks, setTracks, favorites, history, playlists, removePlaylist, clearHistory,
    loading, setLoading, error, setError
  } = useMusicStore()

  const { isDarkMode, toggleTheme } = useTheme()

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedArtist, setSelectedArtist] = useState<{ id: string, name: string } | null>(null)
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null)
  const [visibleCount, setVisibleCount] = useState(10)
  const [activeTab, setActiveTab] = useState<'all' | 'fav' | 'hist' | 'playlists'>('all')
  const [showPlaylistModal, setShowPlaylistModal] = useState(false)
  const [toast, setToast] = useState<{ msg: string, type: 'success' | 'error' } | null>(null)

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => setToast({ msg, type });

  const fetchData = useCallback(async (request: () => Promise<any>) => {
    setLoading(true); setError(null)
    try {
      const data = await request()
      if (data && Array.isArray(data)) setTracks(data)
    } catch {
      setError('Erro ao carregar músicas.')
    } finally { setLoading(false) }
  }, [setTracks, setLoading, setError])

  useEffect(() => {
    if (activeTab === 'all' && !selectedArtist && tracks.length === 0) {
      fetchData(musicApi.getTrendingTracks)
    }
  }, [activeTab, selectedArtist, fetchData, tracks.length])

  const getDisplayList = () => {
    if (activeTab === 'fav') return favorites
    if (activeTab === 'hist') return history
    if (activeTab === 'playlists' && selectedPlaylistId) {
      return playlists.find(p => p.id === selectedPlaylistId)?.tracks || []
    }
    return tracks
  }

  const tracksToRender = getDisplayList().slice(0, visibleCount)

  const handleResetView = () => {
    setSelectedArtist(null);
    setSelectedPlaylistId(null);
    setVisibleCount(10);
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#343838] text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <Header
        searchTerm={searchTerm} setSearchTerm={setSearchTerm}
        onSearch={(e: any) => {
          e.preventDefault(); handleResetView(); setActiveTab('all');
          fetchData(() => musicApi.searchTracks(searchTerm));
        }}
        isDarkMode={isDarkMode} toggleTheme={toggleTheme}
        resetView={() => { handleResetView(); setActiveTab('all'); }}
      />

      {showPlaylistModal && <PlaylistModal onClose={() => setShowPlaylistModal(false)} />}

      <div className="relative z-10 p-4 md:p-10 pb-64">
        <main className="max-w-7xl mx-auto bg-[#f3e1b6] dark:bg-[#008c9e] p-6 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl min-h-[60vh]">

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 md:mb-12 gap-6">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl md:text-3xl font-bold text-[#1d5e69] dark:text-white truncate">
                {selectedArtist ? `Artista: ${selectedArtist.name}` :
                  selectedPlaylistId ? `Playlist: ${playlists.find(p => p.id === selectedPlaylistId)?.name}` :
                    activeTab === 'fav' ? 'Favoritos' :
                      activeTab === 'hist' ? 'Histórico' :
                        activeTab === 'playlists' ? 'Biblioteca' : 'Descobrir'}
              </h2>

              {/* BOTÃO LIMPAR HISTÓRICO */}
              {activeTab === 'hist' && history.length > 0 && (
                <button
                  onClick={() => { if (confirm("Limpar histórico?")) { clearHistory(); showToast("Histórico limpo!"); } }}
                  className="text-[10px] uppercase tracking-widest font-black bg-red-500 text-white px-3 py-1.5 rounded-full hover:scale-105 transition-all shadow-lg"
                >
                  Limpar Tudo
                </button>
              )}
            </div>

            <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} onReset={handleResetView} />
          </div>

          {activeTab === 'playlists' && !selectedPlaylistId ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {playlists.map(p => (
                <div key={p.id} className="relative group">
                  <button onClick={() => setSelectedPlaylistId(p.id)} className="w-full flex items-center gap-5 p-6 bg-white/40 dark:bg-black/20 rounded-[2.5rem] hover:bg-[#23998e] hover:text-white transition-all text-left">
                    <div className="p-4 bg-[#23998e] rounded-2xl text-white shadow-lg"><ListMusic size={32} /></div>
                    <div><p className="font-bold text-xl truncate w-40">{p.name}</p><p className="text-sm opacity-60">{p.tracks.length} músicas</p></div>
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); if (confirm("Excluir?")) removePlaylist(p.id); }} className="absolute top-4 right-4 p-2 bg-white/80 dark:bg-black/40 text-red-500 rounded-full opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>
                </div>
              ))}
              <button onClick={() => setShowPlaylistModal(true)} className="border-2 border-dashed border-[#1d5e69]/30 rounded-[2.5rem] p-6 flex flex-col items-center justify-center gap-3 hover:border-[#23998e] transition-all"><Plus size={32} /> <span className="font-bold">Nova Playlist</span></button>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center py-20"><AlertCircle className="text-[#fa3419] mb-4" size={64} /><p>{error}</p></div>
          ) : (
            <>
              {selectedPlaylistId && <button onClick={() => setSelectedPlaylistId(null)} className="mb-8 flex items-center gap-2 font-bold opacity-60 hover:opacity-100 transition-opacity"><ArrowLeft size={18} /> Voltar</button>}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-8">
                {loading ? Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />) :
                  tracksToRender.map((track) => (
                    <TrackCard
                      key={track.id} track={track} showToast={showToast} activeTab={activeTab}
                      onArtistClick={(artist: any) => {
                        setSelectedArtist({ id: artist.id.toString(), name: artist.name });
                        setSelectedPlaylistId(null); setActiveTab('all');
                        fetchData(() => musicApi.getUserTracks(artist.id.toString()));
                      }}
                    />
                  ))
                }
              </div>
              {!loading && getDisplayList().length > visibleCount && (
                <div className="flex justify-center mt-12"><button onClick={() => setVisibleCount(v => v + 10)} className="px-8 py-3 bg-black/10 dark:bg-black/20 rounded-full font-bold hover:bg-[#fa3419] hover:text-white transition-all">Carregar Mais</button></div>
              )}
            </>
          )}
        </main>
      </div>
      <Player />
    </div>
  )
}