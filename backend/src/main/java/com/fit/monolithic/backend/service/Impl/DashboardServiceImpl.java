package com.fit.monolithic.backend.service.Impl;

import com.fit.monolithic.backend.dto.response.StatsDashboardResponse;
import com.fit.monolithic.backend.dto.response.TopRecentOrder;
import com.fit.monolithic.backend.enums.OrderStatus;
import com.fit.monolithic.backend.repository.OrderRepository;
import com.fit.monolithic.backend.repository.UserRepository;
import com.fit.monolithic.backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

@Service
@Transactional
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    @Override
    public StatsDashboardResponse getDashboardStats() {
        Object[] stats = orderRepository.getDashboardStats().get(0);
        BigDecimal revenue = (BigDecimal) stats[0];
        Long orders = ((Number) stats[1]).longValue();
        Long bookSold = ((Number) stats[2]).longValue();
        Long customer = userRepository.countCustomers();
        return StatsDashboardResponse.builder()
                .revenue(revenue)
                .customers(customer)
                .bookSold(bookSold)
                .orders(orders)
                .build();

    }

    @Override
    public TopRecentOrder getTopRecentOrder() {
        Pageable pageable = PageRequest.of(0, 4);
        Object[] result = orderRepository.getTopRecentOrder(pageable).get(0);
        Long id =  (Long) result[0];
        OrderStatus orderStatus = (OrderStatus) result[1];
        LocalDate orderDate  = (LocalDate) result[2];
        BigDecimal totalAmount = (BigDecimal) result[3];
        String customerName = (String) result[4];
        return TopRecentOrder.builder()
                .id(id)
                .orderDate(orderDate)
                .orderTotalAmount(totalAmount)
                .fullName(customerName)
                .orderStatus(orderStatus).build();

    }
}
