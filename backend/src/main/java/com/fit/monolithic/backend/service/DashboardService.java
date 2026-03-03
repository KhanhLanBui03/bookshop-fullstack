package com.fit.monolithic.backend.service;

import com.fit.monolithic.backend.dto.response.SaleByCategoryResponse;
import com.fit.monolithic.backend.dto.response.StatsDashboardResponse;
import com.fit.monolithic.backend.dto.response.TopBookResponse;
import com.fit.monolithic.backend.dto.response.TopRecentOrder;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface DashboardService {
    StatsDashboardResponse getDashboardStats();
    List<TopRecentOrder> getTopRecentOrder();
    List<TopBookResponse> getTopBooks();
    List<SaleByCategoryResponse> getSaleByCategory();
}
