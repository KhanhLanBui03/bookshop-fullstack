package com.fit.monolithic.backend.service;

import com.fit.monolithic.backend.dto.response.*;

import java.util.List;

public interface AnalyticsService {
    AnalyticsKpiResponse getKpi();

    List<RevenuePointResponse> getRevenue(String period);   // "weekly" | "monthly"

    List<FunnelStepResponse> getFunnel();

    List<CategoryPerformanceResponse> getCategoryPerformance();
}