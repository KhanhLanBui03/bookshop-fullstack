package com.fit.monolithic.backend.controller;

import com.fit.monolithic.backend.dto.response.based.ApiResponse;
import com.fit.monolithic.backend.service.AnalyticsService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@Tag(name = "Analytics APIs", description = "Admin operations for analytics")
@RequestMapping("/api/v1/admin/analytics")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AnalyticsController {
    private final AnalyticsService analyticsService;

    @GetMapping("/revenue")
    public ApiResponse<List<Map<String, Object>>> getRevenueStats() {
        return new ApiResponse<>(200, "Success", analyticsService.getRevenueStats());
    }

    @GetMapping("/categories")
    public ApiResponse<List<Map<String, Object>>> getCategoryStats() {
        return new ApiResponse<>(200, "Success", analyticsService.getCategoryStats());
    }

    @GetMapping("/overall")
    public ApiResponse<Map<String, Object>> getOverallStats() {
        return new ApiResponse<>(200, "Success", analyticsService.getOverallStats());
    }
}