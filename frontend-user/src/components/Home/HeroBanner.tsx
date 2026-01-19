import { useState, useEffect } from "react"
import { BookOpen, Sparkles, TrendingUp, Users } from "lucide-react"

const HeroBanner = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setMousePosition({ x: x * 20, y: y * 20 })
  }

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 })
    setIsHovered(false)
  }

  const stats = [
    { icon: BookOpen, label: "Sách", value: "1000+" },
    { icon: Users, label: "Độc giả", value: "50K+" },
    { icon: TrendingUp, label: "Đánh giá", value: "4.8/5" },
  ]

  return (
    <div className="flex w-full justify-center px-4 md:px-10 lg:px-20 py-8">
      <div
        className="relative w-full max-w-7xl h-[400px] md:h-[500px] rounded-3xl overflow-hidden cursor-pointer"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
      >
        {/* Background with 3D effect */}
        <div className="absolute inset-0 bg-blue-600 dark:bg-blue-700">
          {/* Animated circles */}
          <div
            className="absolute top-10 left-10 w-64 h-64 bg-blue-400 dark:bg-blue-500 rounded-full blur-3xl opacity-50 transition-transform duration-300"
            style={{
              transform: `translate(${mousePosition.x * 2}px, ${mousePosition.y * 2}px) scale(${isHovered ? 1.2 : 1})`,
            }}
          />
          <div
            className="absolute bottom-10 right-10 w-96 h-96 bg-purple-400 dark:bg-purple-500 rounded-full blur-3xl opacity-40 transition-transform duration-300"
            style={{
              transform: `translate(${-mousePosition.x * 2}px, ${-mousePosition.y * 2}px) scale(${isHovered ? 1.2 : 1})`,
            }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-300 dark:bg-cyan-400 rounded-full blur-3xl opacity-30 transition-transform duration-300"
            style={{
              transform: `translate(calc(-50% + ${mousePosition.x}px), calc(-50% + ${mousePosition.y}px)) scale(${isHovered ? 1.3 : 1})`,
            }}
          />

          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="h-full w-full" style={{
              backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`,
              backgroundSize: '50px 50px'
            }} />
          </div>
        </div>

        {/* Floating books */}
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white dark:bg-zinc-800 rounded-lg shadow-2xl transition-all duration-500"
              style={{
                width: `${60 + i * 10}px`,
                height: `${80 + i * 15}px`,
                top: `${15 + i * 15}%`,
                left: `${10 + i * 15}%`,
                transform: `
                  translate(${mousePosition.x * (i + 1) * 0.5}px, ${mousePosition.y * (i + 1) * 0.5}px)
                  rotateX(${mousePosition.y * 0.5}deg)
                  rotateY(${mousePosition.x * 0.5}deg)
                  scale(${isHovered ? 1.1 : 1})
                `,
                opacity: 0.15 + i * 0.05,
              }}
            >
              <div className="w-full h-full border-l-4 border-blue-500 dark:border-blue-400 rounded-lg" />
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center text-center px-6 z-10">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium mb-6 transition-all duration-300"
            style={{
              transform: `translateY(${mousePosition.y * 0.5}px)`,
            }}
          >
            <Sparkles className="w-4 h-4" />
            <span>Nền tảng sách điện tử hàng đầu</span>
          </div>

          {/* Main heading */}
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 transition-all duration-300"
            style={{
              transform: `perspective(1000px) rotateX(${mousePosition.y * 0.3}deg) rotateY(${mousePosition.x * 0.3}deg) translateZ(50px)`,
            }}
          >
            Khám phá thế giới
            <br />
            <span className="inline-block mt-2">tri thức</span>
          </h1>

          {/* Subtitle */}
          <p
            className="text-lg md:text-xl text-white/90 max-w-2xl mb-8 transition-all duration-300"
            style={{
              transform: `translateY(${-mousePosition.y * 0.3}px)`,
            }}
          >
            Hàng nghìn đầu sách chất lượng cao, đánh giá từ cộng đồng độc giả đam mê
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row gap-4 mb-12 transition-all duration-300"
            style={{
              transform: `scale(${isHovered ? 1.05 : 1})`,
            }}
          >
            <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105">
              Khám phá ngay
            </button>
            <button className="bg-white/20 backdrop-blur-md text-white px-8 py-4 rounded-xl font-bold hover:bg-white/30 transition-all duration-300 border-2 border-white/50 hover:scale-105">
              Xem danh mục
            </button>
          </div>

          {/* Stats */}
          <div
            className="flex flex-wrap justify-center gap-8 transition-all duration-300"
            style={{
              transform: `translateY(${mousePosition.y * 0.2}px)`,
            }}
          >
            {stats.map((stat, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-xl border border-white/20 transition-all duration-300 hover:bg-white/20 hover:scale-110"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <stat.icon className="w-6 h-6 text-white" />
                <div className="text-left">
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-white/80">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Particles effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
                opacity: Math.random() * 0.5 + 0.3,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </div>
  )
}

export default HeroBanner