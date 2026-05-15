package com.fit.monolithic.backend.repository;

import com.fit.monolithic.backend.entity.Book;
import com.fit.monolithic.backend.entity.Wishlist;
import com.fit.monolithic.backend.entity.WishlistItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WishlistItemRepository extends JpaRepository<WishlistItem, Long> {
    Optional<WishlistItem> findByWishlistAndBook(Wishlist wishlist, Book book);
    void deleteByWishlistAndBook(Wishlist wishlist, Book book);
}
