
interface EmptyStateProps {
    icon: React.ElementType
    title: string
    description?: string
}

export const EmptyState = ({ icon: Icon, title, description }: EmptyStateProps) => {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-in fade-in zoom-in duration-700">
            <div className="relative mb-6">
                {/* Decorative background circle */}
                <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full scale-150 animate-pulse" />
                
                {/* Icon Container */}
                <div className="relative z-10 glass dark:bg-zinc-800/50 p-8 rounded-full border border-primary/20 shadow-2xl shadow-primary/5">
                    <Icon className="size-12 text-primary" strokeWidth={1.5} />
                </div>
            </div>

            <h3 className="text-2xl font-black text-foreground mb-3 tracking-tight">
                {title}
            </h3>
            
            {description && (
                <p className="text-muted-foreground max-w-sm mx-auto font-medium leading-relaxed">
                    {description}
                </p>
            )}
        </div>
    )
}
