
export function ImageItemsSkeleton() {
    return (
        <div className="w-full max-w-6xl mx-auto p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(9)].map((_, i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
                ))}
            </div>
        </div>
    )
    
}