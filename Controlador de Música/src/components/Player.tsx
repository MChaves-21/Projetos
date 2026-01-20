import { useEffect, useRef, useState } from 'react'
import { Play, Pause, SkipBack, SkipForward, Volume2, Shuffle, Repeat } from 'lucide-react'
import { useMusicStore } from '../store/useMusicStore'

export function Player() {
    const audioRef = useRef<HTMLAudioElement>(null)
    const { currentTrack, isPlaying, setIsPlaying, setCurrentTrack, tracks, isShuffle, toggleShuffle } = useMusicStore()
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) audioRef.current.play().catch(() => setIsPlaying(false))
            else audioRef.current.pause()
        }
    }, [isPlaying, currentTrack, setIsPlaying])

    const handleNext = () => {
        if (!tracks.length) return
        let nextTrack;
        if (isShuffle) {
            const randomIndex = Math.floor(Math.random() * tracks.length)
            nextTrack = tracks[randomIndex]
        } else {
            const currentIndex = tracks.findIndex(t => t.id === currentTrack?.id)
            nextTrack = tracks[(currentIndex + 1) % tracks.length]
        }
        if (nextTrack) setCurrentTrack(nextTrack)
    }

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            const val = (audioRef.current.currentTime / audioRef.current.duration) * 100
            setProgress(val || 0)
        }
    }

    if (!currentTrack) return null

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-[#343838]/90 backdrop-blur-lg border-t border-black/5 dark:border-white/5 p-4 z-50">
            <audio
                ref={audioRef}
                src={currentTrack.stream_url}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleNext}
            />

            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                {/* INFO */}
                <div className="flex items-center gap-4 w-1/3">
                    <img src={currentTrack.artwork['150x150']} className="w-14 h-14 rounded-xl shadow-md" alt="" />
                    <div className="truncate">
                        <p className="font-bold truncate">{currentTrack.title}</p>
                        <p className="text-xs opacity-60 truncate">{currentTrack.user.name}</p>
                    </div>
                </div>

                {/* CONTROLES */}
                <div className="flex flex-col items-center gap-2 w-1/3">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={toggleShuffle}
                            className={`transition-colors ${isShuffle ? 'text-[#fa3419]' : 'text-zinc-400 hover:text-black dark:hover:text-white'}`}
                        >
                            <Shuffle size={20} />
                        </button>
                        <button onClick={() => { }} className="text-zinc-400"><SkipBack size={24} /></button>
                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="w-12 h-12 flex items-center justify-center bg-[#fa3419] text-white rounded-full hover:scale-105 transition-transform"
                        >
                            {isPlaying ? <Pause fill="white" /> : <Play fill="white" className="ml-1" />}
                        </button>
                        <button onClick={handleNext} className="hover:text-[#fa3419] transition-colors"><SkipForward size={24} /></button>
                        <button className="text-zinc-400"><Repeat size={20} /></button>
                    </div>

                    <div className="w-full bg-black/10 dark:bg-white/10 h-1 rounded-full overflow-hidden">
                        <div className="bg-[#fa3419] h-full transition-all duration-300" style={{ width: `${progress}%` }} />
                    </div>
                </div>

                {/* VOLUME */}
                <div className="flex items-center justify-end gap-3 w-1/3">
                    <Volume2 size={20} className="opacity-60" />
                    <div className="w-24 h-1 bg-black/10 dark:bg-white/10 rounded-full">
                        <div className="bg-[#23998e] h-full w-3/4 rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    )
}