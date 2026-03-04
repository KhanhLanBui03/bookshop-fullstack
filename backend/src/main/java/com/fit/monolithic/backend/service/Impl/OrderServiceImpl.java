package com.fit.monolithic.backend.service.Impl;

import com.fit.monolithic.backend.dto.request.CreateOrderRequest;
import com.fit.monolithic.backend.dto.response.OrderDashboardStats;
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
    public OrderResponse createOrder(CreateOrderRequest request, CustomUserDetails userDetails) {

        if (request.getPaymentMethod() != PaymentMethod.COD) {
            throw new RuntimeException("Only COD supported now");
        }

        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow();

        Address address = addressRepository.findById(request.getAddressId())
                .orElseThrow();

        if (!address.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Address does not belong to user");
        }

        List<CartItem> cartItems = cartItemRepository
                .findByIdInAndCart_User(request.getCartItemIds(), user);

        if (cartItems.isEmpty() ||
                cartItems.size() != request.getCartItemIds().size()) {
            throw new RuntimeException("Invalid cart items");
        }

        BigDecimal total = BigDecimal.ZERO;

        Order order = Order.builder()
                .orderCode("ORD-" + System.currentTimeMillis())
                .orderStatus(OrderStatus.PENDING)
                .paymentMethod(PaymentMethod.COD)
                .shippingAddress(address)
                .orderUser(user)
                .build();

        for (CartItem cartItem : cartItems) {

            if (cartItem.getQuantity() > cartItem.getBook().getStock()) {
                throw new RuntimeException("Insufficient stock");
            }

            BigDecimal itemTotal = cartItem.getBook().getSalePrice()
                    .multiply(BigDecimal.valueOf(cartItem.getQuantity()));

            total = total.add(itemTotal);

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .bookId(cartItem.getBook().getId())
                    .bookTitle(cartItem.getBook().getTitle())
                    .quantity(cartItem.getQuantity())
                    .price(cartItem.getBook().getSalePrice())
                    .build();

            order.getOrderItems().add(orderItem);

            cartItem.getBook().setStock(
                    cartItem.getBook().getStock() - cartItem.getQuantity()
            );
        }

        order.setOrderTotalAmount(total);

        orderRepository.save(order);
        cartItemRepository.deleteAll(cartItems);

        return OrderResponse.builder()
                .id(order.getId())
                .orderCode(order.getOrderCode())
                .totalAmount(total)
                .status(order.getOrderStatus())
                .createdAt(order.getOrderDate())
                .paymentMethod(order.getPaymentMethod())
                .build();
    }

    @Override
    public OrderDashboardStats getOrderDashboardStat() {
        Object[] orders = orderRepository.getOrderDashboardStat().get(0);
        BigDecimal total = (BigDecimal) orders[0];
        Long totalPending = (Long) orders[1];
        Long totalShipped = (Long) orders[2];
        Long totalDelivered = (Long) orders[3];
        return OrderDashboardStats.builder()
                .totalDelivered(totalDelivered)
                .totalPending(totalPending)
                .totalRevenue(total)
                .totalShipping(totalShipped)
                .build();
    }
}
