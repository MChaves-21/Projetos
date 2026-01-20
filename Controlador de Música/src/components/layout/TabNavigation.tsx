

interface TabNavProps {
    activeTab: 'all' | 'fav' | 'hist' | 'playlists';
    setActiveTab: (tab: 'all' | 'fav' | 'hist' | 'playlists') => void;
    onReset: () => void;
}

export function TabNavigation({ activeTab, setActiveTab, onReset }: TabNavProps) {
    const btnClass = (isActive: boolean) =>
        `px-4 py-2 rounded-xl text-sm font-bold transition-all ${isActive ? 'shadow-md scale-105 bg-[#23998e] text-white' : 'opacity-60 hover:opacity-100'}`;

    return (
        <div className="flex bg-black/5 dark:bg-black/20 p-1.5 rounded-2xl gap-2 overflow-x-auto">
            <button onClick={() => { setActiveTab('all'); onReset(); }} className={btnClass(activeTab === 'all')}>Geral</button>
            <button onClick={() => { setActiveTab('fav'); onReset(); }} className={btnClass(activeTab === 'fav')}>Favoritos</button>
            <button onClick={() => { setActiveTab('hist'); onReset(); }} className={btnClass(activeTab === 'hist')}>Histórico</button>
            <button onClick={() => { setActiveTab('playlists'); onReset(); }} className={btnClass(activeTab === 'playlists')}>Playlists</button>
        </div>
    );
}