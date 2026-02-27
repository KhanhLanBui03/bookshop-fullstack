package com.fit.monolithic.backend.service.Impl;

import com.fit.monolithic.backend.dto.request.CheckoutRequest;
import com.fit.monolithic.backend.dto.response.AddressResponse;
import com.fit.monolithic.backend.dto.response.CheckoutItemResponse;
import com.fit.monolithic.backend.dto.response.CheckoutResponse;
import com.fit.monolithic.backend.entity.Book;
import com.fit.monolithic.backend.entity.CartItem;
import com.fit.monolithic.backend.entity.User;
import com.fit.monolithic.backend.repository.AddressRepository;
import com.fit.monolithic.backend.repository.CartItemRepository;
import com.fit.monolithic.backend.repository.UserRepository;
import com.fit.monolithic.backend.security.CustomUserDetails;
import com.fit.monolithic.backend.service.CheckoutService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CheckoutServiceImpl implements CheckoutService {

    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final AddressRepository  addressRepository;
    @Override
    public CheckoutResponse prepareCheckout(
            CustomUserDetails userDetails,
            CheckoutRequest request
    ) {

        String email = userDetails.getUsername();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<CartItem> items = cartItemRepository
                .findByIdInAndCart_User(request.getCartItemIds(), user);

        if (items.size() != request.getCartItemIds().size()) {
            throw new RuntimeException("Invalid cart items");
        }

        BigDecimal total = BigDecimal.ZERO;
        List<CheckoutItemResponse> itemDTOs = new ArrayList<>();

        for (CartItem item : items) {

            Book book = item.getBook();

            if (book.getStock() < item.getQuantity()) {
                throw new RuntimeException(
                        "Book " + book.getTitle() + " out of stock"
                );
            }
            BigDecimal subtotal = book.getSalePrice()
                    .multiply(BigDecimal.valueOf(item.getQuantity()));
            String thumbnail = null;
            if (book.getImages() != null && !book.getImages().isEmpty()) {
                thumbnail = book.getImages().get(0).getUrl(); // lấy ảnh đầu
            }
            total = total.add(subtotal);

            itemDTOs.add(
                    new CheckoutItemResponse(
                            book.getId(),
                            book.getTitle(),
                            thumbnail,
                            book.getSalePrice(),
                            item.getQuantity(),
                            subtotal
                    )
            );
        }
        List<AddressResponse> addresses = addressRepository.findAllByUser(user)
                .stream()
                .map(a->new AddressResponse(
                        a.getId(),
                        a.getStreet(),
                        a.getCity(),
                        a.getState(),
                        a.getZip(),
                        a.getCountry()
                ))
                .toList();
        return CheckoutResponse.builder()
                .customerName(user.getFullName())
                .customerEmail(user.getEmail())
                .customerPhone(user.getPhoneNumber())
                .customerAddresses(addresses)
                .items(itemDTOs)
                .totalAmount(total)
                .build();
    }
}