import { useState } from 'react';
import { Play, Heart, Plus, ListMusic, PlusCircle } from 'lucide-react';
import { useMusicStore } from '../../store/useMusicStore';
import type { Track } from '../../types/music';

interface TrackCardProps {
    track: Track;
    onArtistClick: (artist: any) => void;
}

export function TrackCard({ track, onArtistClick }: TrackCardProps) {
    const {
        currentTrack,
        setCurrentTrack,
        isPlaying,
        toggleFavorite,
        favorites,
        playlists,
        addTrackToPlaylist,
        createPlaylist
    } = useMusicStore();

    const [showPlaylistOptions, setShowPlaylistOptions] = useState(false);

    const isCurrent = currentTrack?.id === track.id;
    const isFav = favorites.some((f) => f.id === track.id);

    const handleCreateAndAdd = () => {
        const name = prompt("Nome da nova playlist:");
        if (name && name.trim()) {
            createPlaylist(name);
            setShowPlaylistOptions(false);
        }
    };

    return (
        <div className="group relative flex flex-col gap-3">
            {/* CAPA DO ÁLBUM */}
            <div className="relative aspect-square overflow-hidden rounded-4xl shadow-lg transition-transform duration-300 group-hover:scale-[1.02]">
                <img
                    src={track.artwork['480x480']}
                    alt={track.title}
                    className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                        onClick={() => setCurrentTrack(track)}
                        className="flex h-16 w-16 items-center justify-center rounded-full bg-[#fa3419] text-white shadow-xl transition-transform hover:scale-110 active:scale-95"
                    >
                        <Play fill="white" size={32} className={isCurrent && isPlaying ? 'animate-pulse' : ''} />
                    </button>
                </div>

                <button
                    onClick={() => toggleFavorite(track)}
                    className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-md transition-colors ${isFav ? 'bg-[#fa3419] text-white' : 'bg-black/20 text-white hover:bg-black/40'
                        }`}
                >
                    <Heart size={20} fill={isFav ? 'currentColor' : 'none'} />
                </button>

                <div className="absolute bottom-4 right-4">
                    <button
                        onClick={() => setShowPlaylistOptions(!showPlaylistOptions)}
                        className="p-2 rounded-full bg-black/20 text-white backdrop-blur-md hover:bg-[#23998e] transition-colors"
                    >
                        <Plus size={20} />
                    </button>

                    {showPlaylistOptions && (
                        <div className="absolute bottom-12 right-0 w-56 bg-white dark:bg-[#343838] rounded-2xl shadow-2xl border border-black/5 p-2 z-50 animate-in fade-in slide-in-from-bottom-2">
                            <button
                                onClick={handleCreateAndAdd}
                                className="w-full text-left px-3 py-2 text-sm font-bold text-[#23998e] hover:bg-[#23998e]/10 rounded-lg mb-1 flex items-center gap-2"
                            >
                                <PlusCircle size={14} /> Nova Playlist
                            </button>

                            <div className="h-px bg-gray-100 dark:bg-gray-700 my-1" />

                            <div className="max-h-40 overflow-y-auto custom-scrollbar">
                                {playlists.length > 0 ? (
                                    playlists.map((p) => (
                                        <button
                                            key={p.id}
                                            onClick={() => { addTrackToPlaylist(p.id, track); setShowPlaylistOptions(false); }}
                                            className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-[#23998e] hover:text-white transition-colors flex items-center gap-2"
                                        >
                                            <ListMusic size={14} />
                                            <span className="truncate">{p.name}</span>
                                        </button>
                                    ))
                                ) : (
                                    <p className="px-3 py-2 text-[10px] opacity-50 italic">Crie uma playlist primeiro</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="px-2">
                <h3 className="truncate font-bold text-sm dark:text-white">{track.title}</h3>
                <button
                    onClick={() => onArtistClick(track.user)}
                    className="text-xs text-zinc-500 hover:text-[#fa3419] transition-colors"
                >
                    {track.user.name}
                </button>
            </div>
        </div>
    );
}