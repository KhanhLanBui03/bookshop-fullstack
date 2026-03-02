package com.fit.monolithic.backend.controller;

import com.fit.monolithic.backend.dto.response.StatsDashboardResponse;
import com.fit.monolithic.backend.dto.response.TopRecentOrder;
import com.fit.monolithic.backend.dto.response.based.ApiResponse;
import com.fit.monolithic.backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/dashboards")
@RequiredArgsConstructor
public class DashboardController {
    private final DashboardService dashboardService;
    @GetMapping("/stats")
    public ApiResponse<StatsDashboardResponse> getDashboard() {
        return new ApiResponse<>(
                200,
                "Success",
                dashboardService.getDashboardStats()
        );
    }
    @GetMapping("/recent-order")
    public ApiResponse<TopRecentOrder> getTopRecentOrder() {
        return new ApiResponse<>(
                200,
                "Success",
                dashboardService.getTopRecentOrder()
        );
    }
}
