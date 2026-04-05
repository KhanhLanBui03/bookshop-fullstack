package com.fit.monolithic.backend.controller;

import com.fit.monolithic.backend.dto.response.*;
import com.fit.monolithic.backend.dto.response.based.ApiResponse;
import com.fit.monolithic.backend.service.AnalyticsService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/analytics")
@RequiredArgsConstructor
@Tag(name = "Analytics APIs", description = "Dashboard analytics & reporting")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    /**
     * KPI cards: conversion, AOV, return rate, new/returning
     */
    @GetMapping("/kpi")
    public ApiResponse<AnalyticsKpiResponse> getKpi() {
        return new ApiResponse<>(200, "Success", analyticsService.getKpi());
    }

    /**
     * Revenue time series.
     *
     * @param period "weekly" (last 7 days) | "monthly" (last 6 months, default)
     */
    @GetMapping("/revenue")
    public ApiResponse<List<RevenuePointResponse>> getRevenue(
            @RequestParam(defaultValue = "monthly") String period
    ) {
        return new ApiResponse<>(200, "Success", analyticsService.getRevenue(period));
    }

    /**
     * Conversion funnel steps
     */
    @GetMapping("/funnel")
    public ApiResponse<List<FunnelStepResponse>> getFunnel() {
        return new ApiResponse<>(200, "Success", analyticsService.getFunnel());
    }

    /**
     * Top 5 categories by revenue
     */
    @GetMapping("/categories")
    public ApiResponse<List<CategoryPerformanceResponse>> getCategoryPerformance() {
        return new ApiResponse<>(200, "Success", analyticsService.getCategoryPerformance());
    }
}