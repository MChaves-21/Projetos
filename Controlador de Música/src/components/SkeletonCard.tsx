export function SkeletonCard() {
    return (
        <div className="animate-pulse">
            {/* Imagem Placeholder com o mesmo arredondado [2.5rem] */}
            <div className="aspect-square rounded-[2.5rem] bg-black/10 dark:bg-white/10 mb-5 shadow-inner" />

            {/* Título Placeholder */}
            <div className="h-5 w-3/4 bg-black/10 dark:bg-white/10 rounded-lg mb-2 mx-2" />

            {/* Artista Placeholder */}
            <div className="h-4 w-1/2 bg-black/10 dark:bg-white/10 rounded-lg mx-2" />
        </div>
    )
}   