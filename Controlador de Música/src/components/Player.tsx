import { useEffect, useRef, useState } from 'react'
import { Play, Pause, SkipBack, SkipForward, Volume2, Shuffle, Repeat, Volume1, VolumeX } from 'lucide-react'
import { useMusicStore } from '../store/useMusicStore'

export function Player() {
    const audioRef = useRef<HTMLAudioElement>(null)
    const {
        currentTrack, isPlaying, setIsPlaying, setCurrentTrack, tracks,
        isShuffle, toggleShuffle, isLooping, toggleLoop, volume, setVolume
    } = useMusicStore()

    const [progress, setProgress] = useState(0)

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume
            audioRef.current.loop = isLooping
            if (isPlaying) audioRef.current.play().catch(() => setIsPlaying(false))
            else audioRef.current.pause()
        }
    }, [isPlaying, currentTrack, volume, isLooping, setIsPlaying])

    const handleNext = () => {
        if (!tracks.length) return
        let nextTrack;
        if (isShuffle) {
            nextTrack = tracks[Math.floor(Math.random() * tracks.length)]
        } else {
            const currentIndex = tracks.findIndex(t => t.id === currentTrack?.id)
            nextTrack = tracks[(currentIndex + 1) % tracks.length]
        }
        if (nextTrack) setCurrentTrack(nextTrack)
    }

    const handlePrevious = () => {
        if (!tracks.length || !audioRef.current) return
        if (audioRef.current.currentTime > 3) {
            audioRef.current.currentTime = 0
            return
        }
        const currentIndex = tracks.findIndex(t => t.id === currentTrack?.id)
        const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length
        setCurrentTrack(tracks[prevIndex])
    }

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100 || 0)
        }
    }

    const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (audioRef.current) {
            const newTime = (Number(e.target.value) / 100) * audioRef.current.duration
            audioRef.current.currentTime = newTime
            setProgress(Number(e.target.value))
        }
    }

    if (!currentTrack) return null
    const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-[#343838]/95 backdrop-blur-xl border-t border-black/5 p-4 z-50">
            <audio ref={audioRef} src={currentTrack.stream_url} onTimeUpdate={handleTimeUpdate} onEnded={handleNext} />
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 w-1/3 min-w-0">
                    <img src={currentTrack.artwork['150x150']} className="w-14 h-14 rounded-xl object-cover" alt="" />
                    <div className="truncate text-sm">
                        <p className="font-bold truncate">{currentTrack.title}</p>
                        <p className="opacity-60 truncate">{currentTrack.user.name}</p>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-2 w-1/3">
                    <div className="flex items-center gap-6">
                        <button onClick={toggleShuffle} className={isShuffle ? 'text-[#fa3419]' : 'text-zinc-400'}><Shuffle size={18} /></button>
                        <button onClick={handlePrevious} className="hover:text-[#fa3419]"><SkipBack size={24} /></button>
                        <button onClick={() => setIsPlaying(!isPlaying)} className="w-12 h-12 bg-[#fa3419] text-white rounded-full flex items-center justify-center">
                            {isPlaying ? <Pause fill="white" /> : <Play fill="white" className="ml-1" />}
                        </button>
                        <button onClick={handleNext} className="hover:text-[#fa3419]"><SkipForward size={24} /></button>
                        <button onClick={toggleLoop} className={isLooping ? 'text-[#fa3419]' : 'text-zinc-400'}><Repeat size={18} /></button>
                    </div>
                    <input type="range" value={progress} onChange={handleProgressChange} className="w-full h-1 accent-[#fa3419] cursor-pointer" />
                </div>

                <div className="flex items-center justify-end gap-3 w-1/3">
                    <VolumeIcon size={20} />
                    <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => setVolume(Number(e.target.value))} className="w-24 h-1 accent-[#23998e]" />
                </div>
            </div>
        </div>
    )
}