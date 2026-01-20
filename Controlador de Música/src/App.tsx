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
import { AlertCircle, ChevronDown, ListMusic, Plus, ArrowLeft, Trash2 } from 'lucide-react'

export default function App() {
  // Estado Global (Zustand)
  const {
    tracks, setTracks, favorites, history, playlists, removePlaylist,
    loading, setLoading, error, setError
  } = useMusicStore()

  const { isDarkMode, toggleTheme } = useTheme()

  // Estados Locais de UI
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedArtist, setSelectedArtist] = useState<{ id: string, name: string } | null>(null)
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null)
  const [visibleCount, setVisibleCount] = useState(10)
  const [activeTab, setActiveTab] = useState<'all' | 'fav' | 'hist' | 'playlists'>('all')
  const [showPlaylistModal, setShowPlaylistModal] = useState(false)
  const [toast, setToast] = useState<{ msg: string, type: 'success' | 'error' } | null>(null)

  // Função para disparar notificações (Toast)
  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
  };

  // Lógica de busca de dados na API
  const fetchData = useCallback(async (request: () => Promise<any>) => {
    setLoading(true);
    setError(null);
    try {
      const data = await request()
      if (data && Array.isArray(data)) {
        setTracks(data)
      }
    } catch (err) {
      setError('Não foi possível carregar as músicas. Verifique sua conexão.')
    } finally {
      setLoading(false)
    }
  }, [setTracks, setLoading, setError])

  // Efeito inicial: Carrega tendências
  useEffect(() => {
    if (activeTab === 'all' && !selectedArtist && tracks.length === 0) {
      fetchData(musicApi.getTrendingTracks)
    }
  }, [activeTab, selectedArtist, fetchData, tracks.length])

  // Determina qual lista exibir com base na aba ativa
  const getDisplayList = () => {
    if (activeTab === 'fav') return favorites
    if (activeTab === 'hist') return history
    if (activeTab === 'playlists' && selectedPlaylistId) {
      return playlists.find(p => p.id === selectedPlaylistId)?.tracks || []
    }
    return tracks
  }

  const tracksToRender = getDisplayList().slice(0, visibleCount)

  // Resetar visualização ao trocar de contexto
  const handleResetView = () => {
    setSelectedArtist(null);
    setSelectedPlaylistId(null);
    setVisibleCount(10);
  }

  const handleDeletePlaylist = (id: string) => {
    if (confirm("Deseja mesmo excluir esta playlist?")) {
      removePlaylist(id);
      showToast("Playlist removida!", "success");
      if (selectedPlaylistId === id) setSelectedPlaylistId(null);
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#343838] text-zinc-900 dark:text-zinc-100 transition-colors duration-300 font-sans">
      {/* Sistema de Notificação */}
      {toast && (
        <Toast
          message={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearch={(e: any) => {
          e.preventDefault();
          handleResetView();
          setActiveTab('all');
          fetchData(() => musicApi.searchTracks(searchTerm));
        }}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        resetView={() => { handleResetView(); setActiveTab('all'); }}
      />

      {showPlaylistModal && (
        <PlaylistModal onClose={() => setShowPlaylistModal(false)} />
      )}

      <div className="relative z-10 p-4 md:p-10 pb-64">
        <main className="max-w-7xl mx-auto bg-[#f3e1b6] dark:bg-[#008c9e] p-6 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl min-h-[60vh] transition-colors duration-500">

          {/* Cabeçalho da Lista e Navegação */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 md:mb-12 gap-6">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1d5e69] dark:text-white truncate max-w-full">
              {selectedArtist ? `Artista: ${selectedArtist.name}` :
                selectedPlaylistId ? `Playlist: ${playlists.find(p => p.id === selectedPlaylistId)?.name}` :
                  activeTab === 'fav' ? 'Favoritos' :
                    activeTab === 'hist' ? 'Histórico' :
                      activeTab === 'playlists' ? 'Minha Biblioteca' : 'Descobrir'}
            </h2>

            <TabNavigation
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onReset={handleResetView}
            />
          </div>

          {/* Renderização Condicional */}
          {activeTab === 'playlists' && !selectedPlaylistId ? (
            /* GRID DE PLAYLISTS */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
              {playlists.map(p => (
                <div key={p.id} className="relative group">
                  <button
                    onClick={() => setSelectedPlaylistId(p.id)}
                    className="w-full flex items-center gap-5 p-6 bg-white/40 dark:bg-black/20 rounded-[2.5rem] hover:bg-[#23998e] hover:text-white transition-all text-left border border-transparent"
                  >
                    <div className="p-4 bg-[#23998e] rounded-2xl text-white shadow-lg group-hover:scale-110 transition-transform">
                      <ListMusic size={32} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-xl truncate">{p.name}</p>
                      <p className="text-sm opacity-60">{p.tracks.length} músicas</p>
                    </div>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeletePlaylist(p.id); }}
                    className="absolute top-4 right-4 p-2 bg-white/80 dark:bg-black/40 text-red-500 hover:bg-red-500 hover:text-white rounded-full transition-all opacity-0 group-hover:opacity-100 shadow-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}

              <button
                onClick={() => setShowPlaylistModal(true)}
                className="border-2 border-dashed border-[#1d5e69]/30 dark:border-white/20 rounded-[2.5rem] p-6 flex flex-col items-center justify-center gap-3 hover:border-[#23998e] hover:bg-white/10 transition-all group"
              >
                <div className="p-4 bg-[#1d5e69]/10 group-hover:bg-[#23998e] group-hover:text-white rounded-full transition-colors">
                  <Plus size={32} />
                </div>
                <span className="font-bold text-[#1d5e69] dark:text-white">Criar Playlist</span>
              </button>
            </div>
          ) : error ? (
            /* TELA DE ERRO */
            <div className="flex flex-col items-center py-20 text-center animate-in fade-in">
              <AlertCircle className="mb-4 text-[#fa3419]" size={64} />
              <p className="text-lg font-medium max-w-md">{error}</p>
              <button onClick={() => fetchData(musicApi.getTrendingTracks)} className="mt-4 text-[#1d5e69] dark:text-white underline">Tentar novamente</button>
            </div>
          ) : (
            /* LISTA DE MÚSICAS */
            <>
              {selectedPlaylistId && (
                <button
                  onClick={() => setSelectedPlaylistId(null)}
                  className="mb-8 flex items-center gap-2 text-sm font-bold hover:text-[#fa3419] transition-colors"
                >
                  <ArrowLeft size={18} /> Voltar para Biblioteca
                </button>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-8">
                {loading ? (
                  Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)
                ) : (
                  tracksToRender.map((track) => (
                    <TrackCard
                      key={track.id}
                      track={track}
                      showToast={showToast}
                      onArtistClick={(artist: any) => {
                        setSelectedArtist({ id: artist.id.toString(), name: artist.name });
                        setSelectedPlaylistId(null);
                        setActiveTab('all');
                        fetchData(() => musicApi.getUserTracks(artist.id.toString()));
                      }}
                    />
                  ))
                )}
              </div>

              {!loading && tracksToRender.length === 0 && (
                <div className="text-center py-24 opacity-40 flex flex-col items-center gap-4">
                  <ListMusic size={48} />
                  <p>Parece que não há nada por aqui ainda.</p>
                </div>
              )}

              {/* Botão Ver Mais */}
              {!loading && getDisplayList().length > visibleCount && (
                <div className="flex justify-center mt-16 pb-8">
                  <button
                    onClick={() => setVisibleCount(v => v + 10)}
                    className="flex items-center gap-2 font-bold px-10 py-4 rounded-full bg-black/10 dark:bg-black/20 hover:bg-[#fa3419] hover:text-white transition-all shadow-lg active:scale-95"
                  >
                    Carregar mais <ChevronDown size={20} />
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Player Fixo */}
      <Player />
    </div>
  )
}