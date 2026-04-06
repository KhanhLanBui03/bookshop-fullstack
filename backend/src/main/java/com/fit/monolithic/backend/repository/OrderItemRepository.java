package com.fit.monolithic.backend.repository;

import com.fit.monolithic.backend.entity.OrderItem;
import com.fit.monolithic.backend.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    boolean existsByBookId(Long bookId);

    @Query("""
    SELECT COUNT(oi) > 0 FROM OrderItem oi
    WHERE oi.order.orderUser.id = :userId
      AND oi.bookId = :bookId
      AND oi.order.orderStatus IN :statuses
""")
    boolean hasPurchased(@Param("userId") Long userId,
                         @Param("bookId") Long bookId,
                         @Param("statuses") List<OrderStatus> statuses);
}
