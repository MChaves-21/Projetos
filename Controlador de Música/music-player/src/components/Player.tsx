// src/components/Player.tsx
import { useEffect, useRef, useState } from 'react'
import { useMusicStore } from '../store/useMusicStore'
import { musicApi } from '../services/api'
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Shuffle } from 'lucide-react'

function Visualizer() {
    return (
        <div className="flex items-end gap-[2px] h-3 w-4 mb-1">
            <div className="w-[3px] bg-blue-500 rounded-full animate-bounce [animation-duration:0.8s]" />
            <div className="w-[3px] bg-blue-400 rounded-full animate-bounce [animation-duration:1.1s]" />
            <div className="w-[3px] bg-blue-600 rounded-full animate-bounce [animation-duration:0.9s]" />
            <div className="w-[3px] bg-blue-300 rounded-full animate-bounce [animation-duration:1.2s]" />
        </div>
    )
}

export function Player() {
    const {
        currentTrack, isPlaying, setIsPlaying,
        tracks, setCurrentTrack, isShuffle, toggleShuffle
    } = useMusicStore()

    const audioRef = useRef<HTMLAudioElement>(null)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [volume, setVolume] = useState(0.7)

    useEffect(() => {
        if (audioRef.current) audioRef.current.volume = volume
    }, [volume])

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }

    const handleNext = () => {
        if (!currentTrack || tracks.length === 0) return

        if (isShuffle) {
            // Lógica de Shuffle: Escolhe um index aleatório diferente do atual
            const currentIndex = tracks.findIndex(t => t.id === currentTrack.id)
            let nextIndex = currentIndex
            while (nextIndex === currentIndex && tracks.length > 1) {
                nextIndex = Math.floor(Math.random() * tracks.length)
            }
            setCurrentTrack(tracks[nextIndex])
        } else {
            // Lógica Normal: Próxima da lista
            const currentIndex = tracks.findIndex(t => t.id === currentTrack.id)
            const nextIndex = (currentIndex + 1) % tracks.length
            setCurrentTrack(tracks[nextIndex])
        }
    }

    const handlePrevious = () => {
        if (!currentTrack || tracks.length === 0) return
        const currentIndex = tracks.findIndex(t => t.id === currentTrack.id)
        const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length
        setCurrentTrack(tracks[prevIndex])
    }

    useEffect(() => {
        if (!audioRef.current) return
        if (isPlaying) {
            audioRef.current.play().catch(() => setIsPlaying(false))
        } else {
            audioRef.current.pause()
        }
    }, [isPlaying, currentTrack, setIsPlaying])

    if (!currentTrack) return null

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl z-50">
            <div className="bg-zinc-900/60 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-4 md:px-8 shadow-2xl">
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">

                    {/* Info da Música */}
                    <div className="flex items-center gap-4 w-full md:w-1/4">
                        <div className="relative">
                            <img
                                src={currentTrack.artwork["480x480"]}
                                className={`w-14 h-14 rounded-2xl object-cover shadow-lg transition-all duration-500 ${isPlaying ? 'scale-110 ring-2 ring-blue-500/50' : ''}`}
                                alt=""
                            />
                            {isPlaying && <div className="absolute inset-0 bg-blue-500/20 blur-md rounded-2xl animate-pulse -z-10" />}
                        </div>
                        <div className="truncate">
                            <div className="flex items-center gap-2">
                                <h4 className="font-bold text-sm text-white truncate">{currentTrack.title}</h4>
                                {isPlaying && <Visualizer />}
                            </div>
                            <p className="text-xs text-zinc-400 truncate font-medium">{currentTrack.user.name}</p>
                        </div>
                    </div>

                    {/* Controles Centrais */}
                    <div className="flex flex-col items-center gap-2 flex-1 w-full">
                        <div className="flex items-center gap-6">
                            {/* Botão Shuffle */}
                            <button onClick={toggleShuffle} title="Ordem Aleatória">
                                <Shuffle className={`w-4 h-4 transition-colors ${isShuffle ? 'text-blue-500' : 'text-zinc-500 hover:text-zinc-300'}`} />
                            </button>

                            <SkipBack onClick={handlePrevious} className="w-5 h-5 text-zinc-400 hover:text-white cursor-pointer" />

                            <button
                                onClick={() => setIsPlaying(!isPlaying)}
                                className="bg-white p-3 rounded-full hover:scale-110 transition-all shadow-lg active:scale-95"
                            >
                                {isPlaying ? <Pause className="w-5 h-5 text-black fill-current" /> : <Play className="w-5 h-5 text-black fill-current ml-0.5" />}
                            </button>

                            <SkipForward onClick={handleNext} className="w-5 h-5 text-zinc-400 hover:text-white cursor-pointer" />
                        </div>

                        {/* Barra de Progresso */}
                        <div className="w-full flex items-center gap-3 text-[10px] font-black text-zinc-500">
                            <span className="w-8 text-right tabular-nums">{formatTime(currentTime)}</span>
                            <div className="relative flex-1 flex items-center">
                                <input
                                    type="range"
                                    min="0"
                                    max={duration || 0}
                                    value={currentTime}
                                    onChange={(e) => {
                                        const time = Number(e.target.value)
                                        if (audioRef.current) audioRef.current.currentTime = time
                                        setCurrentTime(time)
                                    }}
                                    className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer overflow-hidden"
                                />
                            </div>
                            <span className="w-8 tabular-nums">{formatTime(duration)}</span>
                        </div>
                    </div>

                    {/* Volume */}
                    <div className="hidden md:flex items-center justify-end gap-3 w-1/4 group">
                        <button onClick={() => setVolume(volume === 0 ? 0.5 : 0)}>
                            {volume === 0 ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4 text-zinc-500 group-hover:text-blue-500 transition-colors" />}
                        </button>
                        <div className="relative w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={volume}
                                onChange={(e) => setVolume(Number(e.target.value))}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className="h-full bg-blue-500/80 shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all" style={{ width: `${volume * 100}%` }} />
                        </div>
                    </div>
                </div>

                <audio
                    ref={audioRef}
                    src={musicApi.getStreamUrl(currentTrack.id)}
                    onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)}
                    onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
                    onEnded={handleNext}
                    autoPlay
                />
            </div>
        </div>
    )
}