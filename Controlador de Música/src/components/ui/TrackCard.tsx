import { Play, Heart } from 'lucide-react'
import type { Track } from '../../types/music'

interface TrackCardProps {
    track: Track
    isFavorite: boolean
    onPlay: (track: Track) => void
    onFavorite: (track: Track) => void
    onArtistClick: (artist: any) => void
}

export function TrackCard({ track, isFavorite, onPlay, onFavorite, onArtistClick }: TrackCardProps) {
    return (
        <div className="group relative">
            <button
                onClick={() => onFavorite(track)}
                className="absolute top-3 left-3 z-20 p-2.5 rounded-xl bg-black/20 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
            >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-[#fa3419] text-[#fa3419]' : 'text-white'}`} />
            </button>

            <div
                className="relative aspect-square overflow-hidden rounded-[2.5rem] mb-5 shadow-xl cursor-pointer bg-black/10"
                onClick={() => onPlay(track)}
            >
                <img
                    src={track.artwork["480x480"]}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    alt={track.title}
                    onError={(e) => { e.currentTarget.src = "https://placehold.co/480x480/008c9e/white?text=Sem+Capa" }}
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                    <div className="bg-white p-5 rounded-full text-[#008c9e] shadow-2xl scale-75 group-hover:scale-100 transition-all">
                        <Play className="w-8 h-8 fill-current" />
                    </div>
                </div>
            </div>
            <h3 className="font-bold truncate text-lg px-2 text-[#1d5e69] dark:text-white">{track.title}</h3>
            <p
                onClick={() => onArtistClick(track.user)}
                className="text-[#23998e] dark:text-white/70 text-sm truncate px-2 font-medium cursor-pointer hover:underline transition-colors"
            >
                {track.user.name}
            </p>
        </div>
    )
}