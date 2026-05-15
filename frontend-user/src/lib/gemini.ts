import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEYS = [
    "AIzaSyCMxI_oQR0IxzOQ8F85dgVaiiWZ07beFL4",
    "AIzaSyBpS4yBmc46bLy2ciYUDh-AjXQq1AXjbsY",
    "AIzaSyDBaiQrFDGZ7QiSvBdcxT04oD2FIIJ5Sdk"
];

export const getGeminiResponse = async (prompt: string, context: string) => {
    // Combine env key with fallback keys
    const envKey = import.meta.env.VITE_GOOGLE_AI_KEY;
    const allKeys = envKey ? [envKey, ...API_KEYS] : API_KEYS;

    for (const key of allKeys) {
        if (!key || key === "YOUR_API_KEY_HERE") continue;

        try {
            const genAI = new GoogleGenerativeAI(key);
            const model = genAI.getGenerativeModel({ 
                model: "gemini-1.5-flash",
                generationConfig: {
                    maxOutputTokens: 500,
                    temperature: 0.7,
                }
            });
            
            const fullPrompt = `
                Bạn là một trợ lý ảo chuyên nghiệp tên là "Libraria Assistant" của cửa hàng sách Libraria.
                
                Dữ liệu sách hiện có tại cửa hàng:
                ${context || "Hiện tại không có danh sách sách cụ thể, hãy tư vấn chung về sở thích đọc sách."}
                
                Nhiệm vụ:
                - Trả lời bằng tiếng Việt, giọng điệu thân thiện, nhiệt tình.
                - Nếu khách hỏi mua hoặc tìm sách, hãy ưu tiên gợi ý từ danh sách trên.
                - Nếu không có sách đó, hãy gợi ý các thể loại tương tự có tại Libraria.
                - Luôn kết thúc bằng một câu cổ vũ việc đọc sách hoặc một icon dễ thương.
                
                Câu hỏi của khách: ${prompt}
            `;

            const result = await model.generateContent(fullPrompt);
            const response = await result.response;
            const text = response.text();
            
            if (text) return text;
        } catch (error: any) {
            console.error(`Gemini Error [Key: ${key.slice(0, 8)}...]:`, error.message || error);
            // If it's a quota error or key error, try the next one
            if (error.message?.includes("429") || error.message?.includes("API key")) {
                continue;
            }
            // For other errors, we still try next key
            continue;
        }
    }
    
    return "Xin lỗi bạn, hệ thống AI của tôi đang bảo trì định kỳ một chút. Bạn có thể liên hệ hotline hoặc quay lại sau vài phút nhé! 📖✨";
};
