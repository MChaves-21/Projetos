import { useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

export function Toast({ message, type = 'success', onClose }: { message: string, type?: 'success' | 'error', onClose: () => void }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed top-24 right-4 z-50 animate-in slide-in-from-right fade-in">
            <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl backdrop-blur-md border border-white/10 ${type === 'success' ? 'bg-[#23998e]/90 text-white' : 'bg-red-500/90 text-white'
                }`}>
                {type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
                <p className="font-bold text-sm">{message}</p>
            </div>
        </div>
    );
}