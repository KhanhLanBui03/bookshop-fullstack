import { useState, useEffect } from "react"
import { Sparkles, ShoppingBag, ArrowRight, Play, Star } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Button } from "../ui/button"
import { bookApi } from "@/api/book.api"

const DEFAULT_BOOKS = [
  { id: -1, title: "The Lost Kingdom", authorName: "Fantasy Adventure", image: "https://images.unsplash.com/photo-1543005120-a1bb3ea05f31?q=80&w=1000&auto=format&fit=crop", salePrice: 150000 },
  { id: -2, title: "Mastering AI", authorName: "Tech & Future", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000&auto=format&fit=crop", salePrice: 220000 },
  { id: -3, title: "Leadership", authorName: "Business Strategy", image: "https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=1000&auto=format&fit=crop", salePrice: 185000 },
]

const HeroBanner = () => {
  const [topBooks, setTopBooks] = useState<any[]>(DEFAULT_BOOKS)
  const [activeIndex, setActiveIndex] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchTopBooks = async () => {
      try {
        const res = await bookApi.getTopBooksBestSeller()
        const content = res.data?.data?.content || res.data?.content || res.data?.data || []
        if (Array.isArray(content) && content.length > 0) {
          setTopBooks(content.slice(0, 3))
        }
      } catch (error) {
        console.error("Fetch top books error:", error)
      }
    }
    fetchTopBooks()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % topBooks.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [topBooks.length])

  const currentBook = topBooks[activeIndex] || DEFAULT_BOOKS[0]

  return (
    <div className="relative w-full min-h-[750px] flex items-center justify-center overflow-hidden bg-background">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full animate-pulse delay-1000" />
      
      {/* Decorative Grid Pattern */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />

      <div className="relative w-full max-w-7xl mx-auto px-4 md:px-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10">
        
        {/* Left: Content Area (Span 7) */}
        <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full animate-in fade-in slide-in-from-bottom duration-1000">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="size-6 rounded-full border-2 border-background bg-muted overflow-hidden">
                  <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" />
                </div>
              ))}
            </div>
            <span className="text-[10px] font-bold text-foreground/60 uppercase tracking-widest">
              Gia nhập cộng đồng <span className="text-primary">10,000+</span> độc giả
            </span>
          </div>

          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-foreground tracking-tight leading-[0.95]">
              Hành Trình <br />
              <span className="relative inline-block">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-400 to-primary animate-gradient-x">Tri Thức</span>
                <span className="absolute bottom-4 left-0 w-full h-4 bg-primary/20 -rotate-2 z-0" />
              </span> <br />
              Bắt Đầu Từ Đây.
            </h1>
            <p className="text-lg text-muted-foreground font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Khám phá kho tàng tri thức vô tận với hàng ngàn đầu sách chọn lọc. 
              Trải nghiệm mua sắm thông minh, giao hàng hỏa tốc và dịch vụ tận tâm.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
            <Button 
                size="lg" 
                onClick={() => navigate("/list-books")}
                className="h-14 px-8 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all gap-2"
            >
              Khám phá ngay <ShoppingBag className="size-5" />
            </Button>
            <Button 
                variant="outline" 
                size="lg" 
                className="h-14 px-8 rounded-2xl font-bold text-lg border-white/10 hover:bg-white/5 transition-all gap-2"
            >
              Xem video <Play className="size-5 fill-current" />
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="pt-8 flex flex-wrap justify-center lg:justify-start items-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg" alt="partner" className="h-6" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_2015_logo.svg" alt="partner" className="h-6" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="partner" className="h-6 dark:invert" />
          </div>
        </div>

        {/* Right: Modern Product Showcase (Span 5) */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          <div className="relative w-[320px] md:w-[400px] h-[450px] md:h-[550px]">
            {/* Background Decorative Shapes */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-cyan-500/20 rounded-[3rem] blur-3xl" />
            
            {/* Book Display Area */}
            <div className="relative w-full h-full glass rounded-[3rem] border border-white/10 p-4 shadow-2xl flex items-center justify-center overflow-hidden">
              <div key={activeIndex} className="relative w-full h-full flex flex-col items-center justify-center animate-in fade-in zoom-in duration-700">
                <div className="relative z-10 w-[70%] h-[75%] shadow-[20px_40px_60px_rgba(0,0,0,0.5)] rounded-2xl overflow-hidden transition-transform hover:scale-105 duration-500">
                  <img 
                    src={currentBook.image || "/placeholder-book.jpg"} 
                    alt={currentBook.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = DEFAULT_BOOKS[0].image;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>

                {/* Floating Info Card */}
                <div className="absolute bottom-10 right-[-30px] z-20 glass-dark border border-white/20 p-5 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-w-[240px] animate-in slide-in-from-right duration-700 delay-300">
                  <div className="flex items-center gap-1 mb-2">
                    {[1,2,3,4,5].map(s => <Star key={s} className="size-3 fill-amber-400 text-amber-400" />)}
                  </div>
                  <h3 className="text-white font-bold text-sm line-clamp-1">{currentBook.title}</h3>
                  <p className="text-white/60 text-[10px] font-medium uppercase tracking-wider mb-2">{currentBook.authorName}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-black text-xl">{(currentBook.salePrice || 150000).toLocaleString()}đ</span>
                    <div className="size-10 rounded-full bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30 hover:scale-110 transition-transform cursor-pointer">
                      <ShoppingBag className="size-5" />
                    </div>
                  </div>
                </div>

                {/* Left Floating Badge */}
                <div className="absolute top-10 left-[-30px] bg-white text-black px-4 py-2 rounded-2xl shadow-2xl font-black text-xs uppercase tracking-widest -rotate-6 animate-bounce">
                  Best Seller 🔥
                </div>
              </div>
            </div>

            {/* Slider Dots */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex gap-3">
              {topBooks.map((_, i) => (
                <button 
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`size-2.5 rounded-full transition-all duration-300 ${activeIndex === i ? "w-8 bg-primary" : "bg-primary/20 hover:bg-primary/40"}`}
                />
              ))}
            </div>
          </div>
        </div>

      </div>

      <style>{`
        .glass {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .glass-dark {
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 5s ease infinite;
        }
      `}</style>
    </div>
  )
}

export default HeroBanner