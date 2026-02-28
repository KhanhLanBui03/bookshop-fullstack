package com.fit.monolithic.backend.service.Impl;

import com.fit.monolithic.backend.config.VnpayConfig;
import com.fit.monolithic.backend.entity.Order;
import com.fit.monolithic.backend.service.VnpayService;
import com.fit.monolithic.backend.utils.VnpayUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
@Service
@RequiredArgsConstructor
public class VnpayServiceImpl implements VnpayService {
    private final VnpayConfig config;
    private final VnpayUtil util;
    @Override
    public String createPaymentUrl(Order order, HttpServletRequest request) {

        Map<String, String> vnpParams = new HashMap<>();

        vnpParams.put("vnp_Version", "2.1.0");
        vnpParams.put("vnp_Command", "pay");
        vnpParams.put("vnp_TmnCode", config.getTmnCode());
        vnpParams.put("vnp_Amount",
                order.getOrderTotalAmount().multiply(BigDecimal.valueOf(100)).toBigInteger().toString());
        vnpParams.put("vnp_CurrCode", "VND");
        vnpParams.put("vnp_TxnRef", order.getOrderCode());
        vnpParams.put("vnp_OrderInfo", "Thanh toan don hang");
        vnpParams.put("vnp_OrderType", "other");
        vnpParams.put("vnp_Locale", "vn");
        vnpParams.put("vnp_ReturnUrl", config.getReturnUrl());
        vnpParams.put("vnp_IpAddr", request.getRemoteAddr());

        String queryUrl = buildQueryUrl(vnpParams);
        String secureHash = util.hashAllFields(vnpParams, config.getHashSecret());

        return config.getPayUrl() + "?" + queryUrl + "&vnp_SecureHash=" + secureHash;
    }
    @Override
    public String buildQueryUrl(Map<String, String> params) {
        StringBuilder query = new StringBuilder();
        for (Map.Entry<String, String> entry : params.entrySet()) {
            query.append(entry.getKey())
                    .append("=")
                    .append(URLEncoder.encode(entry.getValue(), StandardCharsets.UTF_8))
                    .append("&");
        }
        query.deleteCharAt(query.length() - 1);
        return query.toString();
    }
}
