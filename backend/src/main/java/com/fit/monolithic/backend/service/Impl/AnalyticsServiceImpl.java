package com.fit.monolithic.backend.service.Impl;

import com.fit.monolithic.backend.repository.OrderRepository;
import com.fit.monolithic.backend.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {
    private final OrderRepository orderRepository;

    @Override
    public List<Map<String, Object>> getRevenueStats() {
        List<Object[]> results = orderRepository.getRevenueByDay();
        List<Map<String, Object>> stats = new ArrayList<>();
        for (Object[] row : results) {
            Map<String, Object> map = new HashMap<>();
            map.put("date", row[0]);
            map.put("amount", row[1]);
            stats.add(map);
        }
        return stats;
    }

    @Override
    public List<Map<String, Object>> getCategoryStats() {
        List<Object[]> results = orderRepository.getRevenueByCategory();
        List<Map<String, Object>> stats = new ArrayList<>();
        for (Object[] row : results) {
            Map<String, Object> map = new HashMap<>();
            map.put("category", row[0]);
            map.put("amount", row[1]);
            stats.add(map);
        }
        return stats;
    }

    @Override
    public Map<String, Object> getOverallStats() {
        List<Object[]> results = orderRepository.getOrderDashboardStat();
        Map<String, Object> stats = new HashMap<>();
        if (!results.isEmpty()) {
            Object[] row = results.get(0);
            stats.put("totalRevenue", row[0]);
            stats.put("pendingOrders", row[1]);
            stats.put("shippingOrders", row[2]);
            stats.put("deliveredOrders", row[3]);
        }
        return stats;
    }
}