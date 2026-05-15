import React, { useState, useEffect, useRef } from "react"
import { Sparkles, Send, X, Bot, User, Loader2, MessageSquare } from "lucide-react"
import { aiApi } from "@/api/ai.api"

export const AIChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [input, setInput] = useState("")
    const [messages, setMessages] = useState<Message[]>([
        { role: "ai", content: "Xin chào! Tôi là trợ lý ảo của Libraria. Tôi có thể giúp gì cho bạn hôm nay? 📚" }
    ])
    const [isLoading, setIsLoading] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    const handleSend = async () => {
        if (!input.trim() || isLoading) return

        const userMsg = input.trim()
        setInput("")
        setMessages(prev => [...prev, { role: "user", content: userMsg }])
        setIsLoading(true)

        try {
            const response = await aiApi.chat(userMsg)
            setMessages(prev => [...prev, { role: "ai", content: response }])
        } catch (error) {
            setMessages(prev => [...prev, { role: "ai", content: "Rất tiếc, tôi đang bận xử lý dữ liệu database một chút. Hãy thử lại sau nhé!" }])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="fixed bottom-6 left-6 z-[100] font-sans">
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`size-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 group ${
                    isOpen ? "rotate-90 bg-destructive text-white" : "bg-primary text-primary-foreground hover:scale-110 active:scale-95"
                }`}
            >
                {isOpen ? <X className="size-8" /> : (
                    <div className="relative">
                        <MessageSquare className="size-8 group-hover:scale-110 transition-transform" />
                        <Sparkles className="absolute -top-2 -right-2 size-5 text-amber-300 animate-pulse" />
                    </div>
                )}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="absolute bottom-20 left-0 w-[380px] h-[550px] glass rounded-[2.5rem] border-white/20 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-500">
                    {/* Header */}
                    <div className="p-6 border-b border-white/10 flex items-center gap-4 bg-primary/5">
                        <div className="size-12 bg-primary/20 rounded-2xl flex items-center justify-center">
                            <Bot className="size-7 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-black text-foreground uppercase tracking-widest text-sm">Libraria AI</h3>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <div className="size-2 bg-emerald-500 rounded-full animate-pulse" />
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Đang trực tuyến</span>
                            </div>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide" ref={scrollRef}>
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-2 duration-300`}>
                                <div className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                                    <div className={`size-8 rounded-xl flex-shrink-0 flex items-center justify-center ${msg.role === "user" ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                                        {msg.role === "user" ? <User className="size-4" /> : <Bot className="size-4" />}
                                    </div>
                                    <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                                        msg.role === "user" 
                                            ? "bg-primary text-primary-foreground font-medium rounded-tr-none" 
                                            : "glass border-white/10 text-foreground font-medium rounded-tl-none"
                                    }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start animate-in slide-in-from-bottom-2 duration-300">
                                <div className="flex gap-3 max-w-[85%]">
                                    <div className="size-8 rounded-xl bg-muted flex items-center justify-center">
                                        <Loader2 className="size-4 text-muted-foreground animate-spin" />
                                    </div>
                                    <div className="glass p-4 rounded-2xl rounded-tl-none">
                                        <div className="flex gap-1">
                                            <div className="size-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                            <div className="size-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                            <div className="size-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-6 border-t border-white/10 bg-primary/5">
                        <div className="relative group">
                            <input
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyPress={e => e.key === "Enter" && handleSend()}
                                placeholder="Hỏi gì đó về sách..."
                                className="w-full bg-white/10 border border-white/20 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isLoading}
                                className="absolute right-2 top-1/2 -translate-y-1/2 size-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all"
                            >
                                <Send className="size-4" />
                            </button>
                        </div>
                        <p className="text-[10px] text-center text-muted-foreground mt-4 font-bold uppercase tracking-widest opacity-50">Sử dụng công nghệ Gemini AI</p>
                    </div>
                </div>
            )}
        </div>
    )
}
