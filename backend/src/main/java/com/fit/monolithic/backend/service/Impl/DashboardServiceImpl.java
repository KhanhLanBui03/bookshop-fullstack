package com.fit.monolithic.backend.service.Impl;

import com.fit.monolithic.backend.dto.response.SaleByCategoryResponse;
import com.fit.monolithic.backend.dto.response.StatsDashboardResponse;
import com.fit.monolithic.backend.dto.response.TopBookResponse;
import com.fit.monolithic.backend.dto.response.TopRecentOrder;
import com.fit.monolithic.backend.enums.OrderStatus;
import com.fit.monolithic.backend.repository.BookRepository;
import com.fit.monolithic.backend.repository.CategoryRepository;
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
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;
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
    public List<TopRecentOrder> getTopRecentOrder() {
        Pageable pageable = PageRequest.of(0, 4);
        List<Object[]> results = orderRepository.getTopRecentOrder(pageable);
        return results.stream().map(result->{
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

        }).toList();

    }

    @Override
    public List<TopBookResponse> getTopBooks() {

        Pageable pageable = PageRequest.of(0, 4);

        List<Object[]> results = bookRepository.getTopBook(pageable);

        return results.stream().map(result -> {

            Long id = (Long) result[0];
            String title = (String) result[1];
            String author = (String) result[2];
            BigDecimal rating = (BigDecimal) result[3];
            Integer sold = (Integer) result[4];
            Integer stock = (Integer) result[5];

            return TopBookResponse.builder()
                    .id(id)
                    .title(title)
                    .rating(rating)
                    .sold(sold)
                    .stock(stock)
                    .authorName(author)
                    .build();

        }).toList();
    }

    @Override
    public List<SaleByCategoryResponse> getSaleByCategory() {
        Pageable pageable = PageRequest.of(0, 5);
        List<Object[]> results = categoryRepository.getSalesByCategory(pageable);
        return results.stream().map(result->{
            String categoryName =  (String) result[0];
            Long totalSold =  (Long) result[1];
            Double percent = (Double) result[2];
            return SaleByCategoryResponse.builder()
                    .categoryName(categoryName)
                    .totalSold(totalSold)
                    .percent(percent)
                    .build();
        }).toList();

    }
}
