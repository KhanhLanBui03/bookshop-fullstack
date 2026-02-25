package com.fit.monolithic.backend.service.Impl;

import com.fit.monolithic.backend.dto.request.AddToCartRequest;
import com.fit.monolithic.backend.dto.request.UpdateCartItemRequest;
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
        int totalItems = items.stream().mapToInt(CartItemResponse::getQuantity).sum();
        return CartResponse.builder()
                .cartId(cart.getId())
                .items(items)
                .totalAmount(total)
                .totalItems(totalItems)
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
    @Override
    public CartResponse getCart(Long userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> createEmptyCart(userId));

        return toResponse(cart);
    }
    private Cart createEmptyCart(Long userId) {
        User user = userRepository.getReferenceById(userId);
        Cart cart = new Cart();
        cart.setUser(user);
        return cartRepository.save(cart);
    }

    @Override
    public CartResponse updateQuantity(Long userId, UpdateCartItemRequest request) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
        CartItem item = cartItemRepository.findByCartIdAndBookId(cart.getId(),request.getBookId())
                .orElseThrow(() -> new RuntimeException("Book not found"));
        if (item.getQuantity() <= 0){
            cart.getItems().remove(item);
            cartItemRepository.delete(item);
        }else {
            item.setQuantity(request.getQuantity());
        }
        return toResponse(cart);
    }

    @Override
    public CartResponse removeItem(Long userId, Long bookId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
        CartItem item = cartItemRepository.findByCartIdAndBookId(cart.getId(),bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));
        cart.getItems().remove(item);
        cartItemRepository.delete(item);
        return toResponse(cart);
    }
}
