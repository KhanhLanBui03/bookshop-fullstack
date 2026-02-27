package com.fit.monolithic.backend.repository;

import com.fit.monolithic.backend.entity.CartItem;
import com.fit.monolithic.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    Optional<CartItem> findByCartIdAndBookId(Long cartId, Long bookId);
    List<CartItem> findByIdInAndCart_User(List<Long> ids, User user);
}
