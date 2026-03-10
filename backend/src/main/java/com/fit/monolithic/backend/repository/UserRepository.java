package com.fit.monolithic.backend.repository;

import com.fit.monolithic.backend.dto.response.UserAdminResponse;
import com.fit.monolithic.backend.dto.response.UserDashboardStats;
import com.fit.monolithic.backend.entity.User;
import com.fit.monolithic.backend.enums.AuthProvider;
import com.fit.monolithic.backend.enums.RoleName;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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

    @Query(
            value = """
        SELECT new com.fit.monolithic.backend.dto.response.UserAdminResponse(
            u.id,
            u.fullName,
            u.email,
            u.phoneNumber,
            u.authProvider,
            COUNT(DISTINCT o.id),
            CAST(COALESCE(SUM(o.orderTotalAmount), 0) AS Double),
            u.createAt
        )
        FROM User u
        LEFT JOIN u.orders o
        WHERE
            (:keyword IS NULL OR
                LOWER(u.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
                LOWER(u.email)    LIKE LOWER(CONCAT('%', :keyword, '%')) OR
                u.phoneNumber     LIKE CONCAT('%', :keyword, '%')
            )
            AND (:role IS NULL OR EXISTS (
                SELECT 1 FROM u.roles r WHERE r.name = :role
            ))
            AND (:authProvider IS NULL OR u.authProvider = :authProvider)
        GROUP BY u.id, u.fullName, u.email, u.phoneNumber, u.authProvider, u.createAt
        """,
            countQuery = """
        SELECT COUNT(DISTINCT u.id)
        FROM User u
        WHERE
            (:keyword IS NULL OR
                LOWER(u.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
                LOWER(u.email)    LIKE LOWER(CONCAT('%', :keyword, '%')) OR
                u.phoneNumber     LIKE CONCAT('%', :keyword, '%')
            )
            AND (:role IS NULL OR EXISTS (
                SELECT 1 FROM u.roles r WHERE r.name = :role
            ))
            AND (:authProvider IS NULL OR u.authProvider = :authProvider)
        """
    )
    Page<UserAdminResponse> getAdmins(
            @Param("keyword")      String keyword,
            @Param("role")         RoleName role,
            @Param("authProvider") AuthProvider authProvider,
            Pageable pageable
    );
}
