package com.fit.monolithic.backend.repository;

import com.fit.monolithic.backend.entity.Category;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    Category findByName(String name);

    @Query("""
                SELECT
                    c.name as categoryName,
                    SUM(oi.quantity) as totalSold,
                    (SUM(oi.quantity) * 100.0 /
                        (
                            SELECT SUM(oi2.quantity)
                            FROM OrderItem oi2
                            WHERE oi2.order.orderStatus = com.fit.monolithic.backend.enums.OrderStatus.DELIVERED
                        )
                    ) as percent
                FROM OrderItem oi
                JOIN oi.book b
                JOIN b.category c
                WHERE oi.order.orderStatus = com.fit.monolithic.backend.enums.OrderStatus.DELIVERED
                GROUP BY c.name
                ORDER BY SUM(oi.quantity) DESC
            """)
    List<Object[]> getSalesByCategory(Pageable pageable);
}
