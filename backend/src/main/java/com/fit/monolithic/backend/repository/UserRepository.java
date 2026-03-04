package com.fit.monolithic.backend.repository;

import com.fit.monolithic.backend.dto.response.UserDashboardStats;
import com.fit.monolithic.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    @Query("""
                SELECT COUNT(DISTINCT u)
                FROM User u
                JOIN u.roles r
                WHERE r.name = com.fit.monolithic.backend.enums.RoleName.ROLE_USER
            """)
    Long countCustomers();

    @Query("""
            SELECT DISTINCT new com.fit.monolithic.backend.dto.response.UserDashboardStats(
                (SELECT COUNT(u) FROM User u
                JOIN u.roles r
                WHERE r.name = 'ROLE_USER'),
                (SELECT COALESCE(SUM(o.orderTotalAmount), 0)
                    FROM Order o
                    WHERE o.orderStatus = com.fit.monolithic.backend.enums.OrderStatus.DELIVERED),
                (SELECT COUNT(o) FROM Order o),
                (SELECT COUNT(u)
                    FROM User u
                    WHERE MONTH(u.createAt) = MONTH(CURRENT_DATE)
                    AND YEAR(u.createAt) = YEAR(CURRENT_DATE))
            )
            FROM User u
            WHERE u.id IS NOT NULL
            """)
    UserDashboardStats getDashboardOverview();
}
