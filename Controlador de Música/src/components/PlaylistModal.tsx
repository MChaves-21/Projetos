import { useState } from 'react'
import { useMusicStore } from '../store/useMusicStore'
import { Plus, X, Music } from 'lucide-react'

export function PlaylistModal({ onClose }: { onClose: () => void }) {
    const [name, setName] = useState('')
    const { playlists, createPlaylist, removePlaylist } = useMusicStore()

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault()
        if (name.trim()) {
            createPlaylist(name)
            setName('')
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-[#343838] w-full max-w-md rounded-3xl p-8 shadow-2xl border border-white/20">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Music className="text-[#23998e]" /> Minhas Playlists
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-black/10 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleCreate} className="flex gap-2 mb-8">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nome da nova playlist..."
                        className="flex-1 bg-black/5 dark:bg-white/5 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#23998e] outline-none"
                    />
                    <button type="submit" className="bg-[#23998e] text-white p-3 rounded-xl hover:scale-105 transition-transform">
                        <Plus />
                    </button>
                </form>

                <div className="space-y-3 max-h-75 overflow-y-auto pr-2 custom-scrollbar">
                    {playlists.map((p) => (
                        <div key={p.id} className="flex items-center justify-between p-4 bg-black/5 dark:bg-white/5 rounded-2xl group">
                            <div>
                                <p className="font-bold">{p.name}</p>
                                <p className="text-xs opacity-50">{p.tracks.length} músicas</p>
                            </div>
                            <button
                                onClick={() => removePlaylist(p.id)}
                                className="text-red-500 opacity-0 group-hover:opacity-100 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                            >
                                Excluir
                            </button>
                        </div>
                    ))}
                    {playlists.length === 0 && (
                        <p className="text-center opacity-40 py-4">Você ainda não tem playlists.</p>
                    )}
                </div>
            </div>
        </div>
    )
}