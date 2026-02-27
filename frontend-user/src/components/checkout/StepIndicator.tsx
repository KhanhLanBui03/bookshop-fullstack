interface Props {
    current: number // index bắt đầu từ 0
    steps: string[]
}

export default function StepIndicator({ current, steps }: Props) {
    return (
        <div className="flex items-center justify-center mb-10 w-full">
            {steps.map((label, i) => {
                const isActive = i === current
                const isCompleted = i < current

                return (
                    <div key={i} className="flex items-center w-full">
                        {/* Step Circle + Label */}
                        <div className="flex flex-col items-center relative">
                            <div
                                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                  transition-all duration-300
                  ${isCompleted
                                        ? "bg-green-500 text-white"
                                        : isActive
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-300 text-gray-600"
                                    }
                `}
                            >
                                {isCompleted ? "✓" : i + 1}
                            </div>

                            <span
                                className={`
                  mt-2 text-sm text-center w-24
                  ${isActive
                                        ? "text-blue-600 font-medium"
                                        : isCompleted
                                            ? "text-green-600"
                                            : "text-gray-500"
                                    }
                `}
                            >
                                {label}
                            </span>
                        </div>

                        {/* Line connector */}
                        {i !== steps.length - 1 && (
                            <div
                                className={`
                  flex-1 h-1 mx-2 rounded
                  transition-all duration-300
                  ${isCompleted
                                        ? "bg-green-500"
                                        : "bg-gray-300"
                                    }
                `}
                            />
                        )}
                    </div>
                )
            })}
        </div>
    )
}