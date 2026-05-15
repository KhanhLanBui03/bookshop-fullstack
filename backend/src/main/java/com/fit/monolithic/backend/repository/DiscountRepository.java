package com.fit.monolithic.backend.repository;

import com.fit.monolithic.backend.entity.Discount;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DiscountRepository extends JpaRepository<Discount, Long> {
    boolean existsByCode(String code);
    java.util.Optional<Discount> findByCode(String code);
}
