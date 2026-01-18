// src/components/Player.tsx
import { useEffect, useRef, useState } from 'react'
import { useMusicStore } from '../store/useMusicStore'
import { musicApi } from '../services/api'
import { Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react'

export function Player() {
    const { currentTrack, playNext } = useMusicStore()
    const [isPlaying, setIsPlaying] = useState(false)
    const [progress, setProgress] = useState(0)
    const [duration, setDuration] = useState(0)
    const audioRef = useRef<HTMLAudioElement>(null)

    // Resetar player quando a música muda
    useEffect(() => {
        if (currentTrack && audioRef.current) {
            audioRef.current.play()
            setIsPlaying(true)
        }
    }, [currentTrack])

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) audioRef.current.pause()
            else audioRef.current.play()
            setIsPlaying(!isPlaying)
        }
    }

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            const current = audioRef.current.currentTime
            const total = audioRef.current.duration
            setProgress((current / total) * 100)
            setDuration(total)
        }
    }

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (audioRef.current) {
            const newTime = (Number(e.target.value) / 100) * audioRef.current.duration
            audioRef.current.currentTime = newTime
            setProgress(Number(e.target.value))
        }
    }

    const formatTime = (time: number) => {
        if (isNaN(time)) return '0:00'
        const mins = Math.floor(time / 60)
        const secs = Math.floor(time % 60)
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    if (!currentTrack) return null

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[60] p-4 md:p-6 transition-all duration-500 animate-in slide-in-from-bottom-full">
            <div className="max-w-5xl mx-auto bg-white/90 dark:bg-[#005f6b]/95 backdrop-blur-xl border border-zinc-200 dark:border-white/20 rounded-[2.5rem] p-4 md:px-8 shadow-2xl">

                <audio
                    ref={audioRef}
                    src={musicApi.getStreamUrl(currentTrack.id)}
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={playNext} // TOCAR PRÓXIMA AUTOMATICAMENTE
                />

                <div className="flex flex-col gap-2">
                    {/* Barra de Progresso */}
                    <div className="flex items-center gap-3 w-full group">
                        <span className="text-[10px] font-bold dark:text-white/60 w-8">{formatTime(audioRef.current?.currentTime || 0)}</span>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={progress || 0}
                            onChange={handleSeek}
                            className="flex-1 h-1.5 bg-zinc-200 dark:bg-black/20 rounded-lg appearance-none cursor-pointer accent-blue-500 dark:accent-[#00dffc]"
                        />
                        <span className="text-[10px] font-bold dark:text-white/60 w-8">{formatTime(duration)}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        {/* Info da Música */}
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                            <img
                                src={currentTrack.artwork["480x480"]}
                                className={`w-14 h-14 rounded-2xl object-cover shadow-lg transition-transform duration-500 ${isPlaying ? 'scale-105 rotate-3' : 'scale-90'}`}
                            />
                            <div className="truncate">
                                <h4 className="font-bold dark:text-white truncate">{currentTrack.title}</h4>
                                <p className="text-xs dark:text-white/60 truncate">{currentTrack.user.name}</p>
                            </div>
                        </div>

                        {/* Controles Centrais */}
                        <div className="flex items-center gap-6">
                            <button className="text-zinc-400 dark:text-white/40 hover:text-blue-500 dark:hover:text-[#00dffc] transition-colors"><SkipBack size={24} fill="currentColor" /></button>
                            <button
                                onClick={togglePlay}
                                className="w-14 h-14 bg-blue-600 dark:bg-[#00dffc] rounded-full flex items-center justify-center text-white dark:text-[#005f6b] shadow-xl hover:scale-105 transition-transform"
                            >
                                {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} className="ml-1" fill="currentColor" />}
                            </button>
                            <button
                                onClick={playNext}
                                className="text-zinc-400 dark:text-white/40 hover:text-blue-500 dark:hover:text-[#00dffc] transition-colors"
                            >
                                <SkipForward size={24} fill="currentColor" />
                            </button>
                        </div>

                        {/* Volume (Opcional) */}
                        <div className="hidden md:flex items-center justify-end gap-3 flex-1 text-zinc-400 dark:text-white/40">
                            <Volume2 size={20} />
                            <div className="w-24 h-1 bg-zinc-200 dark:bg-black/20 rounded-full overflow-hidden">
                                <div className="w-2/3 h-full bg-blue-600 dark:bg-[#00dffc]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}