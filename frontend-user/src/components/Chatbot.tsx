import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, Bot, User, BotMessageSquare } from "lucide-react"
import { Button } from "./ui/button"

type Message = {
    id: string
    text: string
    sender: "user" | "bot"
    timestamp: Date
    suggestions?: string[]
}

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            text: "Xin chào! 👋 Tôi là trợ lý ảo của BookStore. Tôi có thể giúp gì cho bạn?",
            sender: "bot",
            timestamp: new Date(),
            suggestions: [
                "Tìm sách hay",
                "Khuyến mãi hôm nay",
                "Theo dõi đơn hàng",
                "Chính sách đổi trả"
            ]
        }
    ])
    const [inputValue, setInputValue] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Auto scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    // Bot responses based on keywords
    const getBotResponse = (userMessage: string): { text: string; suggestions?: string[] } => {
        const msg = userMessage.toLowerCase()

        if (msg.includes("sách") || msg.includes("book")) {
            return {
                text: "Chúng tôi có hơn 10,000 đầu sách thuộc nhiều thể loại khác nhau. Bạn muốn tìm sách về chủ đề gì?",
                suggestions: ["Văn học", "Kinh tế", "Công nghệ", "Thiếu nhi"]
            }
        }

        if (msg.includes("văn học") || msg.includes("tiểu thuyết")) {
            return {
                text: "📚 Một số sách văn học bán chạy:\n\n• Nhà Giả Kim - Paulo Coelho\n• Đắc Nhân Tâm - Dale Carnegie\n• Cây Cam Ngọt Của Tôi - José Mauro\n\nBạn muốn xem chi tiết sách nào?",
                suggestions: ["Nhà Giả Kim", "Đắc Nhân Tâm", "Xem thêm"]
            }
        }

        if (msg.includes("kinh tế") || msg.includes("kinh doanh")) {
            return {
                text: "💼 Sách kinh tế - kinh doanh hot:\n\n• Nghĩ Giàu Làm Giàu - Napoleon Hill\n• Đầu Tư Chứng Khoán - Benjamin Graham\n• 7 Thói Quen - Stephen Covey\n\nMuốn tìm hiểu sách nào?",
                suggestions: ["Nghĩ Giàu Làm Giàu", "Xem tất cả", "Combo sách kinh tế"]
            }
        }

        if (msg.includes("công nghệ") || msg.includes("lập trình") || msg.includes("code")) {
            return {
                text: "💻 Sách lập trình đang sale:\n\n• Clean Code - Robert Martin (-20%)\n• Design Patterns - Gang of Four (-15%)\n• The Pragmatic Programmer (-25%)\n\nBạn cần tư vấn thêm?",
                suggestions: ["Clean Code", "Design Patterns", "Sách cho beginner"]
            }
        }

        if (msg.includes("khuyến mãi") || msg.includes("sale") || msg.includes("giảm giá")) {
            return {
                text: "🔥 Khuyến mãi HOT hôm nay:\n\n✨ Giảm 30% cho đơn từ 500k\n✨ Mua 2 tặng 1 sách thiếu nhi\n✨ Free ship đơn từ 200k\n\nÁp dụng đến hết tháng này!",
                suggestions: ["Xem sách sale", "Điều kiện khuyến mãi", "Mã giảm giá"]
            }
        }

        if (msg.includes("đơn hàng") || msg.includes("order") || msg.includes("theo dõi")) {
            return {
                text: "📦 Để theo dõi đơn hàng, bạn có thể:\n\n1. Vào mục 'Đơn hàng của tôi'\n2. Nhập mã đơn hàng\n3. Hoặc đăng nhập tài khoản\n\nBạn cần hỗ trợ gì thêm?",
                suggestions: ["Đăng nhập", "Nhập mã đơn", "Liên hệ CSKH"]
            }
        }

        if (msg.includes("đổi trả") || msg.includes("hoàn tiền") || msg.includes("chính sách")) {
            return {
                text: "🔄 Chính sách đổi trả:\n\n✅ Đổi trả miễn phí trong 7 ngày\n✅ Sách còn nguyên vẹn, chưa sử dụng\n✅ Hoàn tiền 100% nếu lỗi nhà cung cấp\n\nBạn cần hỗ trợ đổi trả?",
                suggestions: ["Yêu cầu đổi trả", "Xem chi tiết", "Liên hệ"]
            }
        }

        if (msg.includes("ship") || msg.includes("giao hàng") || msg.includes("vận chuyển")) {
            return {
                text: "🚚 Thông tin vận chuyển:\n\n• Nội thành HN/HCM: 1-2 ngày\n• Tỉnh thành khác: 3-5 ngày\n• Miễn phí ship đơn từ 200k\n• Giao hàng nhanh: +30k\n\nBạn ở khu vực nào?",
                suggestions: ["Hà Nội", "TP.HCM", "Tỉnh khác"]
            }
        }

        if (msg.includes("liên hệ") || msg.includes("hotline") || msg.includes("số điện thoại")) {
            return {
                text: "📞 Thông tin liên hệ:\n\n• Hotline: 1900-xxxx (24/7)\n• Email: support@bookstore.vn\n• Zalo: 0912-xxx-xxx\n• Live chat: 8h-22h hàng ngày\n\nBạn muốn được gọi lại?",
                suggestions: ["Gọi cho tôi", "Gửi email", "Chat Zalo"]
            }
        }

        if (msg.includes("cảm ơn") || msg.includes("thank")) {
            return {
                text: "Rất vui được hỗ trợ bạn! 😊 Chúc bạn có trải nghiệm mua sắm tuyệt vời tại BookStore!",
                suggestions: ["Tìm sách khác", "Khuyến mãi", "Đóng chat"]
            }
        }

        // Default response
        return {
            text: "Xin lỗi, tôi chưa hiểu câu hỏi của bạn. Bạn có thể hỏi tôi về:\n\n• Tìm sách theo thể loại\n• Khuyến mãi và ưu đãi\n• Theo dõi đơn hàng\n• Chính sách đổi trả\n• Thông tin liên hệ",
            suggestions: ["Tìm sách", "Khuyến mãi", "Hỗ trợ khác"]
        }
    }

    const handleSend = () => {
        if (!inputValue.trim()) return

        // Add user message
        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputValue,
            sender: "user",
            timestamp: new Date()
        }
        setMessages(prev => [...prev, userMessage])
        setInputValue("")
        setIsTyping(true)

        // Simulate bot typing and response
        setTimeout(() => {
            const response = getBotResponse(inputValue)
            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: response.text,
                sender: "bot",
                timestamp: new Date(),
                suggestions: response.suggestions
            }
            setMessages(prev => [...prev, botMessage])
            setIsTyping(false)
        }, 1000 + Math.random() * 1000)
    }

    const handleSuggestionClick = (suggestion: string) => {
        setInputValue(suggestion)
        handleSend()
    }

    return (
        <>
            {/* Chat Button */}
            {!isOpen && (
                <Button
                    onClick={() => setIsOpen(true)}
                    className="
                        fixed bottom-16 right-6
                        w-16 h-16
                        bg-blue-600 hover:bg-blue-700
                        text-white rounded-full shadow-2xl
                        flex items-center justify-center
                        transition-all duration-300 hover:scale-110
                        z-50 group
                    "
                >
                    <BotMessageSquare className="w-7 h-7" />

                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold animate-pulse">
                        1
                    </span>

                    <div className="absolute bottom-full right-0 mb-2 px-4 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Cần hỗ trợ?
                    </div>
                </Button>

            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden border border-gray-200 animate-slideUp">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                                    <Bot className="w-6 h-6 text-blue-600" />
                                </div>
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></span>
                            </div>
                            <div>
                                <h3 className="font-bold">BookStore Assistant</h3>
                                <p className="text-xs text-blue-100">Luôn sẵn sàng hỗ trợ</p>
                            </div>
                        </div>
                        <Button
                            onClick={() => setIsOpen(false)}
                            className="w-8 h-8 bg-white/20 hover:bg-white/40 cursor-pointer rounded-lg flex items-center justify-center transition-colors"
                        >
                            <X className="w-5 h-5 text-white" />
                        </Button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.map((message) => (
                            <div key={message.id}>
                                {/* Message Bubble */}
                                <div className={`flex gap-2 ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                                    {message.sender === "bot" && (
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Bot className="w-5 h-5 text-blue-600" />
                                        </div>
                                    )}
                                    <div
                                        className={`max-w-[75%] px-4 py-3 rounded-2xl ${message.sender === "user"
                                            ? "bg-blue-600 text-white rounded-br-none"
                                            : "bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm"
                                            }`}
                                    >
                                        <p className="text-sm whitespace-pre-line">{message.text}</p>
                                        <p className={`text-xs mt-1 ${message.sender === "user" ? "text-blue-100" : "text-gray-400"}`}>
                                            {message.timestamp.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                                        </p>
                                    </div>
                                    {message.sender === "user" && (
                                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                                            <User className="w-5 h-5 text-gray-600" />
                                        </div>
                                    )}
                                </div>

                                {/* Suggestions */}
                                {message.sender === "bot" && message.suggestions && (
                                    <div className="flex flex-wrap gap-2 mt-3 ml-10">
                                        {message.suggestions.map((suggestion, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleSuggestionClick(suggestion)}
                                                className="px-3 py-1.5 bg-white border border-blue-300 text-blue-600 rounded-full text-sm hover:bg-blue-50 transition-colors"
                                            >
                                                {suggestion}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Typing Indicator */}
                        {isTyping && (
                            <div className="flex gap-2 items-end">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <Bot className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-3">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 bg-white border-t border-gray-200">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                                placeholder="Nhập tin nhắn..."
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <Button
                                onClick={handleSend}
                                disabled={!inputValue.trim()}
                                className="w-12 h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-colors"
                            >
                                <Send className="w-5 h-5" />
                            </Button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 text-center">
                            Hỗ trợ 24/7 • Trả lời trong 1 phút
                        </p>
                    </div>
                </div>
            )}

            <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
        </>
    )
}

export default Chatbot