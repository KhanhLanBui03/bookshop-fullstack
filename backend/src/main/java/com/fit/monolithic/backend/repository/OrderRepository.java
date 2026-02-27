package com.fit.monolithic.backend.repository;

import com.fit.monolithic.backend.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
}
