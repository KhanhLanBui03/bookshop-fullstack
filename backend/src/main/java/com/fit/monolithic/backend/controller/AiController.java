package com.fit.monolithic.backend.controller;

import com.fit.monolithic.backend.service.AiService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiService aiService;

    @PostMapping("/chat")
    public Map<String, String> chat(@RequestBody Map<String, String> request) {
        try {
            String prompt = request.get("prompt");
            String response = aiService.getChatResponse(prompt);
            return Map.of("response", response != null ? response : "Tôi không thể trả lời lúc này, vui lòng thử lại sau.");
        } catch (Exception e) {
            e.printStackTrace(); // In lỗi ra Terminal để bạn dễ theo dõi
            return Map.of("response", "Lỗi hệ thống: " + e.getMessage());
        }
    }
}
