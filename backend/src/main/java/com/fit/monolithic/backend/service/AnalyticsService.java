package com.fit.monolithic.backend.service;

import java.util.List;
import java.util.Map;

public interface AnalyticsService {
    List<Map<String, Object>> getRevenueStats();
    List<Map<String, Object>> getCategoryStats();
    Map<String, Object> getOverallStats();
}