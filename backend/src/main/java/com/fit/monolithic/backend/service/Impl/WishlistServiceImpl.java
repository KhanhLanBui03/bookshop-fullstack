package com.fit.monolithic.backend.service.Impl;

import com.fit.monolithic.backend.dto.response.WishlistItemResponse;
import com.fit.monolithic.backend.dto.response.WishlistResponse;
import com.fit.monolithic.backend.entity.Book;
import com.fit.monolithic.backend.entity.User;
import com.fit.monolithic.backend.entity.Wishlist;
import com.fit.monolithic.backend.entity.WishlistItem;
import com.fit.monolithic.backend.repository.BookRepository;
import com.fit.monolithic.backend.repository.UserRepository;
import com.fit.monolithic.backend.repository.WishlistItemRepository;
import com.fit.monolithic.backend.repository.WishlistRepository;
import com.fit.monolithic.backend.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class WishlistServiceImpl implements WishlistService {

    private final WishlistRepository wishlistRepository;
    private final WishlistItemRepository wishlistItemRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;

    @Override
    public void addToWishlist(Long userId, Long bookId) {
        Wishlist wishlist = wishlistRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Wishlist newWishlist = new Wishlist();
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new RuntimeException("User not found"));
                    newWishlist.setUser(user);
                    newWishlist.setItems(new ArrayList<>());
                    return wishlistRepository.save(newWishlist);
                });

        boolean alreadyExists = wishlistItemRepository.findByWishlistAndBook(
                wishlist, bookRepository.getReferenceById(bookId)).isPresent();

        if (!alreadyExists) {
            Book book = bookRepository.findById(bookId)
                    .orElseThrow(() -> new RuntimeException("Book not found"));
            WishlistItem item = new WishlistItem();
            item.setWishlist(wishlist);
            item.setBook(book);
            wishlistItemRepository.save(item);
        }
    }

    @Override
    public void removeFromWishlist(Long userId, Long bookId) {
        Wishlist wishlist = wishlistRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Wishlist not found"));
        Book book = bookRepository.getReferenceById(bookId);
        wishlistItemRepository.deleteByWishlistAndBook(wishlist, book);
    }

    @Override
    public WishlistResponse getWishlist(Long userId) {
        Wishlist wishlist = wishlistRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Wishlist newWishlist = new Wishlist();
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new RuntimeException("User not found"));
                    newWishlist.setUser(user);
                    newWishlist.setItems(new ArrayList<>());
                    return wishlistRepository.save(newWishlist);
                });

        List<WishlistItemResponse> items = wishlist.getItems().stream()
                .map(item -> new WishlistItemResponse(
                        item.getId(),
                        item.getBook().getId(),
                        item.getBook().getTitle(),
                        item.getBook().getImages().isEmpty() ? null : item.getBook().getImages().get(0).getUrl(),
                        item.getBook().getSalePrice().doubleValue()
                )).toList();

        return new WishlistResponse(wishlist.getId(), userId, items);
    }

    @Override
    public boolean isInWishlist(Long userId, Long bookId) {
        Wishlist wishlist = wishlistRepository.findByUserId(userId).orElse(null);
        if (wishlist == null) return false;
        
        return wishlistItemRepository.findByWishlistAndBook(
                wishlist, bookRepository.getReferenceById(bookId)).isPresent();
    }
}
