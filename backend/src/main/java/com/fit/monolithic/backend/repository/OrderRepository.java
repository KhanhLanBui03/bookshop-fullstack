package com.fit.monolithic.backend.repository;

import com.fit.monolithic.backend.dto.response.OrderAdminResponse;
import com.fit.monolithic.backend.entity.Order;
import com.fit.monolithic.backend.entity.User;
import com.fit.monolithic.backend.enums.OrderStatus;
import com.fit.monolithic.backend.enums.PaymentMethod;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findAllByOrderUser(User user);

    Optional<Order> findByOrderCode(String orderCode);

    @Query("""
                SELECT
                    COALESCE(SUM(o.orderTotalAmount), 0),
                    COUNT(DISTINCT o),
                    COALESCE(SUM(oi.quantity), 0)
                FROM Order o
                LEFT JOIN o.orderItems oi
                WHERE o.orderStatus = com.fit.monolithic.backend.enums.OrderStatus.SHIPPING
            """)
    List<Object[]> getDashboardStats();

    @Query("""
            SELECT
            o.id,
            o.orderStatus,
            o.orderDate,
            o.orderTotalAmount,
            u.fullName
            FROM Order o
            LEFT JOIN o.orderUser u
            ORDER BY o.orderDate DESC
            """)
    List<Object[]> getTopRecentOrder(Pageable pageable);

    @Query("""
                SELECT
                    COALESCE(SUM(CASE WHEN o.orderStatus = 'DELIVERED' THEN o.orderTotalAmount ELSE 0 END), 0) AS totalRevenue,
                    SUM(CASE WHEN o.orderStatus = 'PENDING' THEN 1 ELSE 0 END) AS pendingCount,
                    SUM(CASE WHEN o.orderStatus = 'SHIPPING' THEN 1 ELSE 0 END) AS shippingCount,
                    SUM(CASE WHEN o.orderStatus = 'DELIVERED' THEN 1 ELSE 0 END) AS deliveredCount
                FROM Order o
            """)
    List<Object[]> getOrderDashboardStat();

    @Query(
            value = """
                    SELECT new com.fit.monolithic.backend.dto.response.OrderAdminResponse(
                        o.id,
                        o.orderCode,
                        u.fullName,
                        u.email,
                        COALESCE(SUM(oi.quantity), 0),
                        o.paymentMethod,
                        o.orderTotalAmount,
                        o.orderStatus,
                        o.orderDate
                    )
                    FROM Order o
                    LEFT JOIN o.orderUser u
                    LEFT JOIN o.orderItems oi
                    WHERE
                        (
                            :keyword IS NULL OR
                            LOWER(o.orderCode) LIKE LOWER(CONCAT('%',:keyword,'%')) OR
                            LOWER(u.fullName) LIKE LOWER(CONCAT('%',:keyword,'%'))
                        )
                    AND (:orderStatus IS NULL OR o.orderStatus = :orderStatus)
                    AND (:paymentMethod IS NULL OR o.paymentMethod = :paymentMethod)
                    GROUP BY
                        o.id,
                        o.orderCode,
                        u.fullName,
                        u.email,
                        o.paymentMethod,
                        o.orderTotalAmount,
                        o.orderStatus,
                        o.orderDate
                    """,
            countQuery = """
                    SELECT COUNT(DISTINCT o.id)
                    FROM Order o
                    LEFT JOIN o.orderUser u
                    WHERE
                        (
                            :keyword IS NULL OR
                            LOWER(o.orderCode) LIKE LOWER(CONCAT('%',:keyword,'%')) OR
                            LOWER(u.fullName) LIKE LOWER(CONCAT('%',:keyword,'%'))
                        )
                    AND (:orderStatus IS NULL OR o.orderStatus = :orderStatus)
                    AND (:paymentMethod IS NULL OR o.paymentMethod = :paymentMethod)
                    """
    )
    Page<OrderAdminResponse> getAllOrderAdmins(String keyword, OrderStatus orderStatus, PaymentMethod paymentMethod, Pageable pageable);
}
