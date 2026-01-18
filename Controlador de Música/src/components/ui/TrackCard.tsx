import { Play, Pause, Heart, User as UserIcon } from 'lucide-react'
import type { Track } from '../../types/music'
import { useMusicStore } from '../../store/useMusicStore'

interface TrackCardProps {
    track: Track
    onArtistClick?: (artist: any) => void
}

export function TrackCard({ track, onArtistClick }: TrackCardProps) {
    const { setCurrentTrack, toggleFavorite, favorites, currentTrack, isPlaying, setIsPlaying } = useMusicStore()

    const isFavorite = favorites.some(f => f.id === track.id)
    const isCurrent = currentTrack?.id === track.id
    const showPause = isCurrent && isPlaying

    const handlePlay = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (isCurrent) {
            setIsPlaying(!isPlaying)
        } else {
            setCurrentTrack(track)
        }
    }

    return (
        <div
            className="group relative flex flex-col gap-3 w-full cursor-pointer"
            onClick={handlePlay}
        >
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-black/5 shadow-md transition-all duration-300 group-hover:-translate-y-1">
                <img
                    src={track.artwork["480x480"]}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => { e.currentTarget.src = "https://placehold.co/480x480/222/fff?text=GSA+Music" }}
                    alt=""
                />

                <div className={`absolute inset-0 bg-black/40 transition-opacity flex items-center justify-center ${isCurrent ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    <div className="bg-[#fa3419] p-4 rounded-full text-white shadow-xl">
                        {showPause ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                    </div>
                </div>

                <button
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(track); }}
                    className="absolute top-3 right-3 p-2 rounded-full bg-black/20 backdrop-blur-md hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100"
                >
                    <Heart size={18} className={`${isFavorite ? 'fill-[#fa3419] text-[#fa3419]' : 'text-white'}`} />
                </button>
            </div>

            <div className="flex flex-col gap-1">
                <h3 className={`font-bold truncate text-base ${isCurrent ? 'text-[#fa3419]' : 'dark:text-white'}`}>{track.title}</h3>
                <div
                    onClick={(e) => { e.stopPropagation(); onArtistClick?.(track.user); }}
                    className="flex items-center gap-1 text-sm text-zinc-500 hover:text-[#fa3419] transition-colors w-fit"
                >
                    <UserIcon size={12} />
                    <span className="truncate">{track.user.name}</span>
                </div>
            </div>
        </div>
    )
}