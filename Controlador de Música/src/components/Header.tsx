import { Search, Sun, Moon } from 'lucide-react'

export function Header({ searchTerm, setSearchTerm, onSearch, isDarkMode, toggleTheme, resetView }: any) {
    return (
        <header className="sticky top-0 z-50 w-full bg-[#fa3419] dark:bg-[#005f6b] backdrop-blur-md border-b border-black/10 dark:border-white/10 shadow-lg transition-all">
            <div className="max-w-7xl mx-auto px-6 md:px-10 h-24 flex items-center justify-between gap-8">
                <div className="flex items-center gap-4 cursor-pointer group shrink-0" onClick={resetView}>
                    <h1 className="text-4xl font-black italic tracking-tighter uppercase text-white">GSA</h1>
                </div>

                <div className="flex items-center gap-4 flex-1 justify-end max-w-2xl">
                    <form onSubmit={onSearch} className="relative w-full max-w-md">
                        <input
                            type="text"
                            placeholder="Pesquisar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/20 dark:bg-white/10 border border-white/30 rounded-xl py-3 px-5 pl-12 outline-none text-white placeholder:text-white/70"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70" />
                    </form>

                    <button onClick={toggleTheme} className="p-3 rounded-xl border border-white/20 text-white">
                        {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
                    </button>
                </div>
            </div>
        </header>
    )
}