package com.fit.monolithic.backend.service.Impl;

import com.fit.monolithic.backend.entity.Book;
import com.fit.monolithic.backend.entity.Category;
import com.fit.monolithic.backend.repository.BookRepository;
import com.fit.monolithic.backend.repository.CategoryRepository;
import com.fit.monolithic.backend.service.AiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiServiceImpl implements AiService {

    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;
    private final RestTemplate restTemplate;

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    @Override
    public String getChatResponse(String userPrompt) {
        try {
            String context = buildContext();
            
            String fullPrompt = String.format(
                "Bạn là trợ lý ảo thông minh 'Libraria Assistant'.\n" +
                "Dưới đây là thông tin thực tế từ cửa hàng của chúng tôi:\n%s\n\n" +
                "Yêu cầu:\n" +
                "- Trả lời bằng tiếng Việt thân thiện.\n" +
                "- Dựa vào dữ liệu trên để tư vấn sách/danh mục.\n" +
                "- Nếu khách hỏi về sách không có, hãy gợi ý cuốn khác tương tự.\n" +
                "- Câu hỏi khách hàng: %s",
                context, userPrompt
            );

            return callGeminiApi(fullPrompt);
        } catch (Exception e) {
            log.error("AI Service Error: {}", e.getMessage());
            return "Xin lỗi, tôi đang bận một chút. Bạn thử lại sau nhé! 📚";
        }
    }

    private String buildContext() {
        List<Category> categories = categoryRepository.findAll();
        List<Book> topBooks = bookRepository.findTop10ByStatusOrderBySoldCountDesc(com.fit.monolithic.backend.enums.BookStatus.ACTIVE);

        StringBuilder sb = new StringBuilder();
        sb.append("DANH MỤC SÁCH ĐANG CÓ:\n");
        categories.forEach(c -> sb.append("- ").append(c.getName()).append(": ").append(c.getDescription()).append("\n"));
        
        sb.append("\nSÁCH BÁN CHẠY NỔI BẬT:\n");
        topBooks.forEach(b -> {
            String authorName = (b.getAuthor() != null) ? b.getAuthor().getName() : "Chưa cập nhật";
            sb.append("- ").append(b.getTitle())
                .append(" (Tác giả: ").append(authorName)
                .append(", Giá: ").append(b.getSalePrice()).append("đ, ")
                .append("Đánh giá: ").append(b.getRating() != null ? b.getRating() : 0).append("/5)\n");
        });
            
        return sb.toString();
    }

    private String callGeminiApi(String prompt) {
        String urlWithKey = apiUrl + "?key=" + apiKey;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Prepare request body
        Map<String, Object> textPart = new HashMap<>();
        textPart.put("text", prompt);

        Map<String, Object> parts = new HashMap<>();
        parts.put("parts", List.of(textPart));

        Map<String, Object> content = new HashMap<>();
        content.put("contents", List.of(parts));

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(content, headers);

        try {
            Map<String, Object> response = restTemplate.postForObject(urlWithKey, entity, Map.class);
            if (response != null && response.containsKey("candidates")) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    Map<String, Object> firstCandidate = candidates.get(0);
                    Map<String, Object> contentObj = (Map<String, Object>) firstCandidate.get("content");
                    if (contentObj != null && contentObj.containsKey("parts")) {
                        List<Map<String, Object>> partsList = (List<Map<String, Object>>) contentObj.get("parts");
                        if (partsList != null && !partsList.isEmpty()) {
                            return (String) partsList.get(0).get("text");
                        }
                    }
                }
            }
        } catch (org.springframework.web.client.RestClientResponseException e) {
            log.error("Gemini API HTTP Error: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
        } catch (Exception e) {
            log.error("Error calling Gemini API: {}", e.getMessage());
        }
        return "Tôi không thể trả lời lúc này, vui lòng thử lại sau.";
    }
}
