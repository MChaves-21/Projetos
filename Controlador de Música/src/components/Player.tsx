import { useEffect, useRef, useState } from 'react'
import { useMusicStore } from '../store/useMusicStore'
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react'

export function Player() {
    const {
        currentTrack, isPlaying, setIsPlaying,
        volume, setVolume, playNext, playPrevious
    } = useMusicStore()

    const audioRef = useRef<HTMLAudioElement>(null)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)

    // Sincroniza Play/Pause
    useEffect(() => {
        if (!audioRef.current) return
        if (isPlaying) {
            audioRef.current.play().catch(() => setIsPlaying(false))
        } else {
            audioRef.current.pause()
        }
    }, [isPlaying, currentTrack])

    // Sincroniza Volume
    useEffect(() => {
        if (audioRef.current) audioRef.current.volume = volume
    }, [volume])

    if (!currentTrack) return null

    const progressPercent = (currentTime / (duration || 1)) * 100

    // Formata tempo (00:00)
    const formatTime = (time: number) => {
        const mins = Math.floor(time / 60)
        const secs = Math.floor(time % 60)
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-xl border-t p-4 z-50 shadow-2xl">

            {/* BARRA DE PROGRESSO COM FUNDO VISÍVEL */}
            <div className="absolute top-0 left-0 right-0 -mt-1 h-1.5 bg-zinc-200 dark:bg-zinc-800">
                <div
                    className="h-full bg-[#fa3419] relative transition-all duration-100"
                    style={{ width: `${progressPercent}%` }}
                >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-[#fa3419] rounded-full shadow-md" />
                </div>
                <input
                    type="range"
                    min={0}
                    max={duration || 0}
                    value={currentTime}
                    onChange={(e) => {
                        const val = parseFloat(e.target.value)
                        if (audioRef.current) audioRef.current.currentTime = val
                        setCurrentTime(val)
                    }}
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
            </div>

            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">

                {/* INFO DA MÚSICA */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <img
                        src={currentTrack.artwork["150x150"]}
                        className="w-12 h-12 rounded-lg object-cover shadow-md"
                        alt={currentTrack.title}
                    />
                    <div className="truncate">
                        <h4 className="font-bold text-sm truncate dark:text-white">{currentTrack.title}</h4>
                        <p className="text-xs text-gray-400 truncate">{currentTrack.user.name}</p>
                    </div>
                </div>

                {/* CONTROLES DE REPRODUÇÃO */}
                <div className="flex flex-col items-center gap-1 flex-1">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={playPrevious}
                            className="dark:text-white hover:text-[#fa3419] transition-colors"
                        >
                            <SkipBack size={22} fill="currentColor" />
                        </button>

                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="bg-[#fa3419] p-3 rounded-full text-white hover:scale-105 active:scale-95 transition-all shadow-lg"
                        >
                            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                        </button>

                        <button
                            onClick={playNext}
                            className="dark:text-white hover:text-[#fa3419] transition-colors"
                        >
                            <SkipForward size={22} fill="currentColor" />
                        </button>
                    </div>

                    {/* TIMER */}
                    <div className="text-[10px] text-gray-500 font-mono">
                        {formatTime(currentTime)} / {formatTime(duration)}
                    </div>
                </div>

                {/* VOLUME (Corrigido para telas menores) */}
                <div className="hidden md:flex items-center gap-3 flex-1 justify-end">
                    <button onClick={() => setVolume(volume === 0 ? 1 : 0)}>
                        {volume === 0 ? <VolumeX size={18} className="text-gray-400" /> : <Volume2 size={18} className="dark:text-white" />}
                    </button>
                    <div className="relative w-24 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div
                            className="absolute top-0 left-0 h-full bg-[#fa3419]"
                            style={{ width: `${volume * 100}%` }}
                        />
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={(e) => setVolume(parseFloat(e.target.value))}
                            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                        />
                    </div>
                </div>
            </div>

            {/* ELEMENTO DE ÁUDIO REAL */}
            <audio
                ref={audioRef}
                src={currentTrack.stream_url} // Aqui entra o preview de 30s da Deezer
                onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                onEnded={() => {
                    setIsPlaying(false)
                    playNext()
                }}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
            />
        </div>
    )
}