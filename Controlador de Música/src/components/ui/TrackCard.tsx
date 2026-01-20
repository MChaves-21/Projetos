import { useState } from 'react'
import { Play, Heart, Plus, ListMusic } from 'lucide-react'
import type { Track } from '../../types/music'
import { useMusicStore } from '../../store/useMusicStore'

interface TrackCardProps {
    track: Track
    onArtistClick: (artist: any) => void
    showToast?: (msg: string, type?: 'success' | 'error') => void // Adicionado opcionalmente
}

export function TrackCard({ track, onArtistClick, showToast }: TrackCardProps) {
    const { setCurrentTrack, toggleFavorite, favorites, playlists, addTrackToPlaylist } = useMusicStore()
    const [showMenu, setShowMenu] = useState(false)

    const isFav = favorites.some(f => f.id === track.id)

    const handleAddToPlaylist = (playlistId: string, playlistName: string) => {
        addTrackToPlaylist(playlistId, track)
        setShowMenu(false)
        if (showToast) showToast(`Adicionado à playlist ${playlistName}!`)
    }

    return (
        <div className="group relative bg-white/10 dark:bg-black/20 p-3 rounded-[2rem] transition-all hover:bg-white/20 dark:hover:bg-black/30 hover:scale-[1.02] hover:shadow-xl">
            {/* IMAGEM E BOTÃO PLAY */}
            <div className="relative aspect-square mb-3 overflow-hidden rounded-[1.5rem] shadow-md">
                <img
                    src={track.artwork['150x150']}
                    alt={track.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                        onClick={() => setCurrentTrack(track)}
                        className="w-12 h-12 bg-[#fa3419] text-white rounded-full flex items-center justify-center translate-y-4 group-hover:translate-y-0 transition-transform shadow-lg"
                    >
                        <Play fill="white" size={20} className="ml-1" />
                    </button>
                </div>
            </div>

            {/* TEXTOS */}
            <div className="px-1">
                <h3 className="font-bold text-sm truncate mb-0.5">{track.title}</h3>
                <button
                    onClick={() => onArtistClick(track.user)}
                    className="text-[11px] opacity-60 hover:text-[#fa3419] truncate block transition-colors"
                >
                    {track.user.name}
                </button>
            </div>

            {/* AÇÕES (CORREÇÃO DO BOTÃO +) */}
            <div className="flex items-center justify-between mt-3 px-1">
                <button
                    onClick={() => toggleFavorite(track)}
                    className={`transition-colors ${isFav ? 'text-[#fa3419]' : 'text-zinc-400 hover:text-[#fa3419]'}`}
                >
                    <Heart size={18} fill={isFav ? 'currentColor' : 'none'} />
                </button>

                <div className="relative">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className={`p-1.5 rounded-full transition-all ${showMenu ? 'bg-[#23998e] text-white' : 'text-zinc-400 hover:bg-[#23998e]/10 hover:text-[#23998e]'}`}
                    >
                        <Plus size={18} />
                    </button>

                    {/* MENU DROPDOWN DE PLAYLISTS (O BOTÃO + AGORA ABRE ISSO) */}
                    {showMenu && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                            <div className="absolute bottom-full right-0 mb-2 w-48 bg-white dark:bg-[#2c3030] rounded-2xl shadow-2xl border border-black/5 dark:border-white/5 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                                <p className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider opacity-40">Adicionar à:</p>
                                <div className="max-h-40 overflow-y-auto">
                                    {playlists.length > 0 ? (
                                        playlists.map(p => (
                                            <button
                                                key={p.id}
                                                onClick={() => handleAddToPlaylist(p.id, p.name)}
                                                className="w-full text-left px-4 py-2 text-sm hover:bg-[#23998e] hover:text-white transition-colors flex items-center gap-2"
                                            >
                                                <ListMusic size={14} />
                                                <span className="truncate">{p.name}</span>
                                            </button>
                                        ))
                                    ) : (
                                        <p className="px-4 py-2 text-xs italic opacity-50 text-center">Nenhuma playlist criada</p>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}