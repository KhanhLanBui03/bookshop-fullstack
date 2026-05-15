package com.fit.monolithic.backend.service.Impl;

import com.fit.monolithic.backend.dto.request.CreateOrderRequest;
import com.fit.monolithic.backend.dto.response.OrderAdminResponse;
import com.fit.monolithic.backend.dto.response.OrderDashboardStats;
import com.fit.monolithic.backend.dto.response.OrderDetailResponse;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderServiceImpl implements OrderService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;
    private final CartItemRepository cartItemRepository;
    private final OrderRepository orderRepository;
    private final VnpayService vnpayService;
    private final OrderItemRepository orderItemRepository;
    private final DiscountRepository discountRepository;
    private final com.fit.monolithic.backend.service.NotificationService notificationService;
    private final com.fit.monolithic.backend.service.InventoryService inventoryService;
    @Override
    public Object createOrder(CreateOrderRequest request,
                              CustomUserDetails userDetails,
                              HttpServletRequest httpRequest) {

        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Address address = addressRepository.findById(request.getAddressId())
                .orElseThrow(() -> new RuntimeException("Address not found"));

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

        Order order = new Order();
        order.setOrderCode("ORD-" + System.currentTimeMillis());
        order.setShippingAddress(address);
        order.setOrderUser(user);
        order.setPaymentMethod(request.getPaymentMethod());

        // 🔥 set status theo payment method
        if (request.getPaymentMethod() == PaymentMethod.VNPAY) {
            order.setOrderStatus(OrderStatus.PENDING_PAYMENT);
        } else {
            order.setOrderStatus(OrderStatus.PENDING);
        }

        // xử lý cart
        for (CartItem cartItem : cartItems) {

            if (cartItem.getQuantity() > cartItem.getBook().getStock()) {
                throw new RuntimeException("Insufficient stock");
            }

            BigDecimal itemTotal = cartItem.getBook().getSalePrice()
                    .multiply(BigDecimal.valueOf(cartItem.getQuantity()));

            total = total.add(itemTotal);

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .book(cartItem.getBook())
                    .bookTitle(cartItem.getBook().getTitle())
                    .quantity(cartItem.getQuantity())
                    .price(cartItem.getBook().getSalePrice())
                    .build();

            order.getOrderItems().add(orderItem);

            // trừ stock qua InventoryService
            inventoryService.updateStock(cartItem.getBook().getId(), -cartItem.getQuantity(), "SALE");
        }

        BigDecimal discountAmount = BigDecimal.ZERO;
        if (request.getDiscountCode() != null && !request.getDiscountCode().isEmpty()) {
            Discount discount = discountRepository.findByCode(request.getDiscountCode())
                    .orElseThrow(() -> new RuntimeException("Discount code not found"));

            // Basic validation again just in case
            if (!discount.isDiscountActive() || 
                java.time.LocalDate.now().isBefore(discount.getDiscountStartDate()) ||
                java.time.LocalDate.now().isAfter(discount.getDiscountEndDate()) ||
                discount.getDiscountQuantityLimit() <= 0) {
                throw new RuntimeException("Invalid or expired discount code");
            }

            if (discount.getDiscountValueType() == com.fit.monolithic.backend.enums.ValueType.PERCENT) {
                discountAmount = total.multiply(BigDecimal.valueOf(discount.getDiscountValue() / 100));
                if (discount.getDiscountMaxAmount() != null) {
                    BigDecimal max = BigDecimal.valueOf(discount.getDiscountMaxAmount());
                    if (discountAmount.compareTo(max) > 0) {
                        discountAmount = max;
                    }
                }
            } else {
                discountAmount = BigDecimal.valueOf(discount.getDiscountValue());
            }

            total = total.subtract(discountAmount);
            if (total.compareTo(BigDecimal.ZERO) < 0) total = BigDecimal.ZERO;

            order.setDiscount(discount);
            // decrement quantity limit
            discount.setDiscountQuantityLimit(discount.getDiscountQuantityLimit() - 1);
            discountRepository.save(discount);
        }

        order.setOrderTotalAmount(total);

        // save order
        orderRepository.save(order);

        // 🔥 Gửi thông báo cho Admin
        notificationService.createNotificationToAdmins(
                "Đơn hàng mới",
                "Có đơn hàng mới " + order.getOrderCode() + " từ " + user.getFullName(),
                "/orders"
        );

        // clear cart
        cartItemRepository.deleteAll(cartItems);

        // 🔥 nếu là VNPay → trả URL
        if (request.getPaymentMethod() == PaymentMethod.VNPAY) {
            String paymentUrl = vnpayService.createPaymentUrl(order, httpRequest);
            return paymentUrl;
        }

        // COD → trả order info
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

    @Override
    public Page<OrderAdminResponse> getAllOrderAdmins(
            String keyword,
            OrderStatus orderStatus,
            PaymentMethod paymentMethod,
            Pageable pageable) {

        return orderRepository.getAllOrderAdmins(keyword, orderStatus, paymentMethod, pageable);
    }

    @Override
    public OrderDetailResponse getOrderDetail(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        Address addr = order.getShippingAddress();
        String fullAddress = String.format("%s, %s, %s, %s",
                addr.getStreet(), addr.getCity(), addr.getState(), addr.getCountry());

        return OrderDetailResponse.builder()
                .id(order.getId())
                .orderCode(order.getOrderCode())
                .customerName(order.getOrderUser().getFullName())
                .customerEmail(order.getOrderUser().getEmail())
                .customerPhone(order.getOrderUser().getPhoneNumber())
                .shippingAddress(fullAddress)
                .totalAmount(order.getOrderTotalAmount())
                .status(order.getOrderStatus())
                .paymentMethod(order.getPaymentMethod())
                .orderDate(order.getOrderDate())
                .items(order.getOrderItems().stream().map(item ->
                        OrderDetailResponse.OrderItemResponse.builder()
                                .bookId(item.getBook().getId())
                                .bookTitle(item.getBookTitle())
                                .bookImage(item.getBook().getImages().isEmpty() ? "" : item.getBook().getImages().get(0).getUrl())
                                .quantity(item.getQuantity())
                                .price(item.getPrice())
                                .build()
                ).toList())
                .build();
    }

    @Override
    public boolean checkPurchased(Long userId, Long bookId) {
        return orderItemRepository.hasPurchased(
                userId, bookId,
                List.of(OrderStatus.PAID, OrderStatus.CONFIRMED,
                        OrderStatus.SHIPPING, OrderStatus.DELIVERED)
        );
    }

    @Override
    public void cancelOrder(Long id, CustomUserDetails userDetails) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getOrderUser().getEmail().equals(userDetails.getUsername())) {
            throw new RuntimeException("You don't have permission to cancel this order");
        }

        if (order.getOrderStatus() != OrderStatus.PENDING && order.getOrderStatus() != OrderStatus.PENDING_PAYMENT) {
            throw new RuntimeException("Order cannot be cancelled in its current status: " + order.getOrderStatus());
        }

        // Restore stock through InventoryService
        for (OrderItem item : order.getOrderItems()) {
            inventoryService.updateStock(item.getBook().getId(), item.getQuantity(), "CANCELLED_ORDER");
        }

        order.setOrderStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);
    }

    @Override
    public void updateOrderStatus(Long id, OrderStatus status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setOrderStatus(status);
        orderRepository.save(order);

        String statusLabel = getStatusLabel(status);
        notificationService.createNotification(
                order.getOrderUser().getId(),
                "Cập nhật trạng thái đơn hàng",
                "Đơn hàng " + order.getOrderCode() + " của bạn đã chuyển sang trạng thái: " + statusLabel,
                "/profile");
    }

    private String getStatusLabel(OrderStatus status) {
        return switch (status) {
            case PENDING -> "Chờ duyệt";
            case PENDING_PAYMENT -> "Chờ thanh toán";
            case CONFIRMED -> "Đã xác nhận";
            case SHIPPING -> "Đang giao";
            case DELIVERED -> "Đã giao";
            case CANCELLED -> "Đã hủy";
            case PAID -> "Đã thanh toán";
            default -> status.name();
        };
    }
}
