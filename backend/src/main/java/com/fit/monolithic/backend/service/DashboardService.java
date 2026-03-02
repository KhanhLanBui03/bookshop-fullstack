package com.fit.monolithic.backend.service;

import com.fit.monolithic.backend.dto.response.StatsDashboardResponse;
import com.fit.monolithic.backend.dto.response.TopRecentOrder;
import org.springframework.data.domain.Pageable;

public interface DashboardService {
    StatsDashboardResponse getDashboardStats();
    TopRecentOrder getTopRecentOrder();
}
