package com.fit.monolithic.backend.repository;

import com.fit.monolithic.backend.dto.response.CategoryPerformanceResponse;
import com.fit.monolithic.backend.entity.Order;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface AnalyticsRepository extends JpaRepository<Order, Long> {

    /*
     * ⚠️  getMonthlyRevenue & getWeeklyRevenue dùng nativeQuery = true
     *     và trả về List<Object[]> — KHÔNG dùng JPQL constructor expression
     *     vì Hibernate không resolve được return-type của DATE_FORMAT/MONTHNAME
     *     tại startup → SemanticException "Missing constructor".
     *
     *     Service map thủ công: row[0] = label (String), row[1] = revenue (Number)
     */

    @Query(value = """
            SELECT
                DATE_FORMAT(o.order_date, '%b %Y') AS label,
                COALESCE(SUM(o.order_total_amount), 0)  AS revenue
            FROM orders o
            WHERE o.order_status = 'DELIVERED'
              AND o.order_date >= :from
            GROUP BY DATE_FORMAT(o.order_date, '%Y-%m'),
                     DATE_FORMAT(o.order_date, '%b %Y')
            ORDER BY MIN(o.order_date)
            """, nativeQuery = true)
    List<Object[]> getMonthlyRevenue(@Param("from") LocalDate from);

    @Query(value = """
            SELECT
                DATE_FORMAT(o.order_date, '%a')         AS label,
                COALESCE(SUM(o.order_total_amount), 0)  AS revenue
            FROM orders o
            WHERE o.order_status = 'DELIVERED'
              AND o.order_date >= :from
            GROUP BY DAYOFWEEK(o.order_date),
                     DATE_FORMAT(o.order_date, '%a')
            ORDER BY DAYOFWEEK(o.order_date)
            """, nativeQuery = true)
    List<Object[]> getWeeklyRevenue(@Param("from") LocalDate from);

    // ── KPI (plain JPQL — safe) ───────────────────────────────────────────

    @Query("SELECT COALESCE(AVG(o.orderTotalAmount), 0) FROM Order o WHERE o.orderStatus = com.fit.monolithic.backend.enums.OrderStatus.DELIVERED")
    BigDecimal getAvgOrderValue();

    @Query("SELECT COUNT(o) FROM Order o WHERE o.orderStatus = com.fit.monolithic.backend.enums.OrderStatus.DELIVERED")
    Long countDelivered();

    @Query("SELECT COUNT(o) FROM Order o WHERE o.orderStatus = com.fit.monolithic.backend.enums.OrderStatus.REFUNDED")
    Long countRefunded();

    @Query("SELECT COUNT(o) FROM Order o")
    Long countAll();

    @Query("SELECT COUNT(DISTINCT o.orderUser) FROM Order o WHERE o.orderStatus = com.fit.monolithic.backend.enums.OrderStatus.DELIVERED")
    Long countBuyers();

    @Query("SELECT COALESCE(SUM(oi.quantity), 0) FROM OrderItem oi")
    Long sumAllOrderItemQty();

    @Query("SELECT COUNT(o) FROM Order o WHERE o.orderStatus <> com.fit.monolithic.backend.enums.OrderStatus.PENDING_PAYMENT")
    Long countCheckout();

    @Query("""
            SELECT COUNT(u) FROM User u
            WHERE MONTH(u.createAt) = MONTH(CURRENT_DATE)
              AND YEAR(u.createAt)  = YEAR(CURRENT_DATE)
            """)
    Long countNewUsersThisMonth();

    @Query("""
            SELECT COUNT(u.id) FROM User u
            WHERE (SELECT COUNT(o) FROM Order o WHERE o.orderUser = u) > 1
            """)
    Long countReturningUsers();

    // ── Category performance (JPQL — không có date function → an toàn) ────

    @Query("""
            SELECT new com.fit.monolithic.backend.dto.response.CategoryPerformanceResponse(
                b.category.name,
                COALESCE(SUM(oi.price * oi.quantity), 0),
                COALESCE(SUM(oi.quantity), 0L)
            )
            FROM OrderItem oi
            JOIN Book b   ON b.id    = oi.bookId
            JOIN Order o  ON o.id    = oi.order.id
            WHERE o.orderStatus = com.fit.monolithic.backend.enums.OrderStatus.DELIVERED
            GROUP BY b.category.name
            ORDER BY SUM(oi.price * oi.quantity) DESC
            """)
    List<CategoryPerformanceResponse> getTopCategoryPerformance(Pageable pageable);
}