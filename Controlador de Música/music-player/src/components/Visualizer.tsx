// src/components/Visualizer.tsx
export function Visualizer() {
    return (
        <div className="flex items-end gap-[2px] h-4 w-5">
            <div className="w-1 bg-blue-500 rounded-full animate-[bounce_0.8s_infinite]" />
            <div className="w-1 bg-blue-400 rounded-full animate-[bounce_1.1s_infinite]" />
            <div className="w-1 bg-blue-600 rounded-full animate-[bounce_0.9s_infinite]" />
            <div className="w-1 bg-blue-300 rounded-full animate-[bounce_1.2s_infinite]" />
        </div>
    )
}