package com.fit.monolithic.backend.service.Impl;

import com.fit.monolithic.backend.dto.request.CreateOrderRequest;
import com.fit.monolithic.backend.dto.response.OrderResponse;
import com.fit.monolithic.backend.entity.*;
import com.fit.monolithic.backend.enums.OrderStatus;
import com.fit.monolithic.backend.enums.PaymentMethod;
import com.fit.monolithic.backend.repository.*;
import com.fit.monolithic.backend.security.CustomUserDetails;
import com.fit.monolithic.backend.service.OrderService;
import com.fit.monolithic.backend.service.VnpayService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderServiceImpl implements OrderService {
    private final AddressRepository addressRepository;
    private final UserRepository userRepository;
    private final CartItemRepository cartItemRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final VnpayService vnpayService;
    @Override
    public OrderResponse createOrder(CreateOrderRequest request, CustomUserDetails  customUserDetails) {
        if(request.getPaymentMethod()!= PaymentMethod.COD){
            throw new RuntimeException("Only COD supported now");
        }
        Address address = addressRepository.findById(request.getAddressId()).orElseThrow();
        String email = customUserDetails.getUsername();
        User user = userRepository.findByEmail(email).orElseThrow();
        if(!address.getUser().getId().equals(user.getId())){
            throw new RuntimeException("Only COD supported now");
        }
        List<CartItem> cartItems = cartItemRepository.findByIdInAndCart_User(request.getCartItemIds(), user);
        BigDecimal total = cartItems.stream()
                .map(item -> item.getBook().getSalePrice()
                        .multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Order order = Order.builder()
                .orderCode(UUID.randomUUID().toString())
                .orderStatus(OrderStatus.CREATED)
                .paymentMethod(PaymentMethod.COD)
                .orderTotalAmount(total)
                .shippingAddress(address)
                .orderUser(user)
                .build();

        orderRepository.save(order);

        for (CartItem cartItem : cartItems) {
            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .bookId(cartItem.getBook().getId())
                    .bookTitle(cartItem.getBook().getTitle())
                    .quantity(cartItem.getQuantity())
                    .price(cartItem.getBook().getSalePrice())
                    .build();

            orderItemRepository.save(orderItem);
        }

        cartItemRepository.deleteAll(cartItems);

        return OrderResponse.builder()
                .id(order.getId())
                .orderCode(order.getOrderCode())
                .totalAmount(total)
                .status(order.getOrderStatus())
                .createdAt(order.getOrderDate())
                .paymentMethod(PaymentMethod.COD)
                .build();

    }

}
