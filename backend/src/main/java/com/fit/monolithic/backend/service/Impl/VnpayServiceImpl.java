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
import java.util.*;

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
        vnpParams.put("vnp_TmnCode", config.getTmnCode().trim());

        vnpParams.put("vnp_Amount",
                order.getOrderTotalAmount()
                        .multiply(BigDecimal.valueOf(100))
                        .toBigInteger().toString());

        vnpParams.put("vnp_CurrCode", "VND");
        vnpParams.put("vnp_TxnRef", order.getOrderCode());
        vnpParams.put("vnp_OrderInfo", "Thanh toan don hang " + order.getOrderCode());
        vnpParams.put("vnp_OrderType", "other");
        vnpParams.put("vnp_Locale", "vn");
        vnpParams.put("vnp_ReturnUrl", config.getReturnUrl().trim());
        
        String ipAddr = request.getRemoteAddr();
        if (ipAddr == null || ipAddr.isEmpty() || ipAddr.equals("0:0:0:0:0:0:0:1")) {
            ipAddr = "127.0.0.1";
        }
        vnpParams.put("vnp_IpAddr", ipAddr);
        vnpParams.put("vnp_CreateDate", util.getCurrentTime());
        vnpParams.put("vnp_ExpireDate", util.getExpireTime(15));

        // Sort keys
        List<String> fieldNames = new ArrayList<>(vnpParams.keySet());
        Collections.sort(fieldNames);

        StringBuilder query = new StringBuilder();
        StringBuilder hashData = new StringBuilder();
        
        for (String fieldName : fieldNames) {
            String fieldValue = vnpParams.get(fieldName);
            if (fieldValue != null && !fieldValue.isEmpty()) {
                // Encode value carefully to match VNPAY
                String encodedValue = vnpayEncode(fieldValue);
                
                // Build hash data (encoded values)
                hashData.append(fieldName).append("=").append(encodedValue).append("&");
                // Build query
                query.append(fieldName).append("=").append(encodedValue).append("&");
            }
        }

        if (query.length() > 0) {
            query.deleteCharAt(query.length() - 1);
            hashData.deleteCharAt(hashData.length() - 1);
        }

        String secureHash = util.hmacSHA512(config.getHashSecret().trim(), hashData.toString());
        
        System.out.println("--- VNPAY FINAL ATTEMPT ---");
        System.out.println("TmnCode: " + config.getTmnCode());
        System.out.println("HashData (SENT): " + hashData.toString());
        System.out.println("SecureHash: " + secureHash);
        System.out.println("---------------------------");

        return config.getPayUrl() + "?" + query.toString() + "&vnp_SecureHash=" + secureHash;
    }

    private String vnpayEncode(String value) {
        try {
            return URLEncoder.encode(value, StandardCharsets.UTF_8.toString())
                    .replace("+", "%20")
                    .replace("%21", "!")
                    .replace("%27", "'")
                    .replace("%28", "(")
                    .replace("%29", ")")
                    .replace("%7E", "~");
        } catch (Exception e) {
            return value;
        }
    }

    @Override
    public String buildQueryUrl(Map<String, String> params) {
        return ""; 
    }
}
