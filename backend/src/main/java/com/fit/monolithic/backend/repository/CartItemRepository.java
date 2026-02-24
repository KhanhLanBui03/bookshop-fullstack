package com.fit.monolithic.backend.repository;

import com.fit.monolithic.backend.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    Optional<CartItem> findByCartIdAndBookId(Long cartId, Long bookId);
}
