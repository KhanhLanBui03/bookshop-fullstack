package com.fit.monolithic.backend.service.Impl;

import com.fit.monolithic.backend.dto.request.AddToCartRequest;
import com.fit.monolithic.backend.dto.response.CartItemResponse;
import com.fit.monolithic.backend.dto.response.CartResponse;
import com.fit.monolithic.backend.entity.Book;
import com.fit.monolithic.backend.entity.Cart;
import com.fit.monolithic.backend.entity.CartItem;
import com.fit.monolithic.backend.entity.User;
import com.fit.monolithic.backend.repository.BookRepository;
import com.fit.monolithic.backend.repository.CartItemRepository;
import com.fit.monolithic.backend.repository.CartRepository;
import com.fit.monolithic.backend.repository.UserRepository;
import com.fit.monolithic.backend.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {
    private final CartRepository cartRepository;
    private final CartItemRepository  cartItemRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    public CartResponse toResponse(Cart cart) {

        List<CartItemResponse> items = cart.getItems().stream()
                .map(item -> CartItemResponse.builder()
                        .bookId(item.getBook().getId())
                        .title(item.getBook().getTitle())
                        .image(
                                item.getBook().getImages().isEmpty()
                                        ? null
                                        : item.getBook().getImages().get(0).getUrl()
                        )
                        .quantity(item.getQuantity())
                        .price(item.getBook().getSalePrice())
                        .totalPrice(
                                item.getBook().getSalePrice()
                                        .multiply(BigDecimal.valueOf(item.getQuantity()))
                        )
                        .build()
                ).toList();

        BigDecimal total = items.stream()
                .map(CartItemResponse::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return CartResponse.builder()
                .cartId(cart.getId())
                .items(items)
                .totalAmount(total)
                .build();
    }
    @Override
    public CartResponse addToCart(Long userId, AddToCartRequest request) {

        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    User userRef = new User();
                    userRef.setId(userId);
                    newCart.setUser(userRef);
                    return cartRepository.save(newCart);
                });

        CartItem item = cartItemRepository
                .findByCartIdAndBookId(cart.getId(), request.getBookId())
                .orElse(null);

        if (item != null) {
            item.setQuantity(item.getQuantity() + request.getQuantity());
        } else {
            Book book = bookRepository.findById(request.getBookId())
                    .orElseThrow(() -> new RuntimeException("Book not found"));

            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setBook(book);
            newItem.setQuantity(request.getQuantity());

            cartItemRepository.save(newItem);
        }

        return toResponse(cart);
    }
}
