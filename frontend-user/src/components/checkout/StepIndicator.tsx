import { Check } from "lucide-react"

interface StepIndicatorProps {
    current: number
    steps: string[]
}

export default function StepIndicator({ current, steps }: StepIndicatorProps) {
    return (
        <div className="w-full max-w-3xl mx-auto mb-16 px-4">
            <div className="relative flex justify-between">
                {/* Connector Line */}
                <div className="absolute top-1/2 left-0 w-full h-[2px] bg-border -translate-y-1/2 z-0" />
                <div 
                    className="absolute top-1/2 left-0 h-[2px] bg-primary -translate-y-1/2 z-0 transition-all duration-700 ease-out" 
                    style={{ width: `${(current / (steps.length - 1)) * 100}%` }}
                />

                {steps.map((label, i) => {
                    const isCompleted = i < current
                    const isActive = i === current

                    return (
                        <div key={label} className="relative z-10 flex flex-col items-center group">
                            <div className={`
                                size-10 rounded-2xl flex items-center justify-center transition-all duration-500 border-2
                                ${isCompleted 
                                    ? "bg-primary border-primary text-white scale-110 shadow-lg shadow-primary/30" 
                                    : isActive 
                                        ? "bg-background border-primary text-primary scale-125 shadow-xl shadow-primary/10" 
                                        : "bg-background border-border text-muted-foreground"
                                }
                            `}>
                                {isCompleted ? (
                                    <Check className="size-5" />
                                ) : (
                                    <span className="text-sm font-black">{i + 1}</span>
                                )}
                            </div>
                            
                            <div className="absolute top-14 whitespace-nowrap">
                                <span className={`
                                    text-[10px] uppercase tracking-[0.2em] font-black transition-all duration-500
                                    ${isActive ? "text-primary opacity-100" : isCompleted ? "text-foreground/60" : "text-muted-foreground/40"}
                                `}>
                                    {label}
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}