package com.fit.monolithic.backend.service.Impl;

import com.fit.monolithic.backend.dto.response.*;
import com.fit.monolithic.backend.repository.AnalyticsRepository;
import com.fit.monolithic.backend.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AnalyticsServiceImpl implements AnalyticsService {

    private final AnalyticsRepository repo;

    /* ── KPI ── */
    @Override
    public AnalyticsKpiResponse getKpi() {
        long totalOrders    = repo.countAll();
        long delivered      = repo.countDelivered();
        long refunded       = repo.countRefunded();
        long newUsers       = repo.countNewUsersThisMonth();
        long returning      = repo.countReturningUsers();

        // Conversion rate = delivered / totalOrders * 100  (fallback 0)
        double convRate = totalOrders == 0 ? 0
                : BigDecimal.valueOf((double) delivered / totalOrders * 100)
                .setScale(1, RoundingMode.HALF_UP).doubleValue();

        // Return rate = refunded / totalOrders * 100
        double returnRate = totalOrders == 0 ? 0
                : BigDecimal.valueOf((double) refunded / totalOrders * 100)
                .setScale(1, RoundingMode.HALF_UP).doubleValue();

        return AnalyticsKpiResponse.builder()
                .conversionRate(convRate)
                .avgOrderValue(repo.getAvgOrderValue().setScale(2, RoundingMode.HALF_UP))
                .returnRate(returnRate)
                .newUsers(newUsers)
                .returningUsers(returning)
                .build();
    }

    /* ── Revenue chart ── */
    @Override
    public List<RevenuePointResponse> getRevenue(String period) {
        boolean isWeekly = "weekly".equalsIgnoreCase(period);
        LocalDate from   = isWeekly
                ? LocalDate.now().minusDays(6)
                : LocalDate.now().minusMonths(6);

        List<Object[]> rows = isWeekly
                ? repo.getWeeklyRevenue(from)
                : repo.getMonthlyRevenue(from);

        // Object[0] = label (String), Object[1] = revenue (BigDecimal / Number)
        return rows.stream()
                .map(row -> new RevenuePointResponse(
                        (String) row[0],
                        new java.math.BigDecimal(row[1].toString())
                                .setScale(2, java.math.RoundingMode.HALF_UP)
                ))
                .toList();
    }

    /* ── Conversion funnel ── */
    @Override
    public List<FunnelStepResponse> getFunnel() {
        // Approximate funnel from order data.
        // For a real app you'd track page-view events separately.
        long purchased   = repo.countDelivered();
        long checkout    = repo.countCheckout();
        long buyers      = repo.countBuyers();
        long cartQty     = repo.sumAllOrderItemQty();   // proxy for "add to cart"

        // Visitors: generous multiplier from buyers (e.g. 15x)
        long visitors    = buyers == 0 ? 0 : buyers * 15;
        long productViews = visitors == 0 ? 0 : (long)(visitors * 0.56);
        long addToCart   = Math.max(cartQty, checkout);

        return List.of(
                new FunnelStepResponse("Visitors",      visitors),
                new FunnelStepResponse("Product Views", productViews),
                new FunnelStepResponse("Add to Cart",   addToCart),
                new FunnelStepResponse("Checkout",      checkout),
                new FunnelStepResponse("Purchased",     purchased)
        );
    }

    /* ── Category performance ── */
    @Override
    public List<CategoryPerformanceResponse> getCategoryPerformance() {
        return repo.getTopCategoryPerformance(PageRequest.of(0, 5));
    }
}