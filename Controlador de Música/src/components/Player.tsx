import { useEffect, useRef, useState } from 'react'
import { useMusicStore } from '../store/useMusicStore'
import {
    Play, Pause, SkipForward, SkipBack,
    Volume2, VolumeX, Heart
} from 'lucide-react'

const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '00:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
}

export function Player() {
    const {
        currentTrack, playNext, playPrevious,
        volume, setVolume, toggleFavorite, favorites
    } = useMusicStore()

    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [isReady, setIsReady] = useState(false)

    const audioRef = useRef<HTMLAudioElement>(null)

    const playAudioSafe = async () => {
        if (!audioRef.current) return
        try {
            await audioRef.current.play()
            setIsPlaying(true)
        } catch (error: any) {
            if (error.name !== 'AbortError') setIsPlaying(false)
        }
    }

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current?.pause()
            setIsPlaying(false)
        } else {
            playAudioSafe()
        }
    }

    useEffect(() => {
        if (currentTrack) {
            setIsReady(false)
            setIsPlaying(false)
            setCurrentTime(0)
        }
    }, [currentTrack])

    useEffect(() => {
        if (audioRef.current) audioRef.current.volume = volume
    }, [volume])

    if (!currentTrack) return null

    const progressPercent = (currentTime / (duration || 1)) * 100

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-[#202020]/95 backdrop-blur-xl border-t border-black/5 dark:border-white/10 p-3 z-[100] shadow-[0_-5px_20px_rgba(0,0,0,0.2)]">

            {/* BARRA DE PROGRESSO */}
            <div className="absolute top-0 left-0 right-0 -mt-1 h-2 group">
                <input
                    type="range"
                    min={0}
                    max={duration || 0}
                    value={currentTime}
                    onChange={(e) => {
                        const time = parseFloat(e.target.value)
                        if (audioRef.current) audioRef.current.currentTime = time
                        setCurrentTime(time)
                    }}
                    className="absolute w-full h-1 bg-transparent appearance-none cursor-pointer outline-none transition-all group-hover:h-1.5 z-10"
                    style={{
                        background: `linear-gradient(to right, #fa3419 0%, #fa3419 ${progressPercent}%, transparent ${progressPercent}%, transparent 100%)`
                    }}
                />
                <div className="absolute top-0 left-0 w-full h-1 bg-black/10 dark:bg-white/10 -z-0 group-hover:h-1.5 transition-all" />
            </div>

            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 h-16 px-4">

                {/* INFO */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <img
                        src={currentTrack.artwork["150x150"] || currentTrack.artwork["480x480"]}
                        className="w-14 h-14 rounded-xl shadow-lg object-cover"
                        alt={currentTrack.title}
                    />
                    <div className="min-w-0 hidden sm:block">
                        <h4 className="font-bold truncate dark:text-white text-base leading-tight">{currentTrack.title}</h4>
                        <p className="text-xs opacity-70 truncate dark:text-gray-400 font-medium">{currentTrack.user.name}</p>
                    </div>
                    <button onClick={() => toggleFavorite(currentTrack)} className="ml-2 hover:scale-110 transition-transform">
                        <Heart className={`w-5 h-5 ${favorites.some(f => f.id === currentTrack.id) ? 'fill-[#fa3419] text-[#fa3419]' : 'text-gray-400'}`} />
                    </button>
                </div>

                {/* CONTROLES */}
                <div className="flex flex-col items-center gap-1 flex-[2]">
                    <div className="flex items-center gap-6">
                        <button onClick={playPrevious} className="text-zinc-500 hover:text-zinc-800 dark:hover:text-white transition-colors">
                            <SkipBack size={24} className="fill-current" />
                        </button>

                        <button
                            onClick={togglePlay}
                            disabled={!isReady}
                            className="bg-[#fa3419] p-3.5 rounded-full text-white shadow-lg hover:scale-105 active:scale-95 transition-all"
                        >
                            {!isReady ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : isPlaying ? (
                                <Pause size={24} className="fill-current" />
                            ) : (
                                <Play size={24} className="fill-current ml-1" />
                            )}
                        </button>

                        <button onClick={playNext} className="text-zinc-500 hover:text-zinc-800 dark:hover:text-white transition-colors">
                            <SkipForward size={24} className="fill-current" />
                        </button>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-medium text-gray-500 uppercase tracking-widest">
                        <span>{formatTime(currentTime)}</span>
                        <span className="opacity-30">|</span>
                        <span>{formatTime(duration)}</span>
                    </div>

                    <audio
                        key={currentTrack.id}
                        ref={audioRef}
                        src={`${currentTrack.stream_url}?app_name=GSA_APP`}
                        onCanPlay={() => { setIsReady(true); playAudioSafe(); }}
                        onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)}
                        onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
                        onEnded={playNext}
                    />
                </div>

                {/* VOLUME (CORRIGIDO) */}
                <div className="flex items-center gap-3 flex-1 justify-end hidden sm:flex">
                    <button onClick={() => setVolume(volume === 0 ? 1 : 0)}>
                        {volume === 0 ? <VolumeX size={18} className="text-gray-400" /> : <Volume2 size={18} className="dark:text-white" />}
                    </button>
                    <div className="relative w-24 h-1 flex items-center group">
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={(e) => setVolume(parseFloat(e.target.value))}
                            className="absolute w-full h-1 bg-transparent appearance-none cursor-pointer z-10 outline-none"
                            style={{
                                background: `linear-gradient(to right, #fa3419 0%, #fa3419 ${volume * 100}%, transparent ${volume * 100}%, transparent 100%)`
                            }}
                        />
                        {/* Fundo cinza visível da barra de volume */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-black/20 dark:bg-white/20 rounded-full -z-0" />
                    </div>
                </div>
            </div>
        </div>
    )
}