package com.fit.monolithic.backend.dto.response;

import com.fit.monolithic.backend.entity.Role;
import com.fit.monolithic.backend.enums.AuthProvider;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
public class UserAdminResponse {

    private Long id;
    private String fullName;
    private String email;
    private String phoneNumber;
    private AuthProvider authProvider;
    private List<String> roles;
    private Long totalOrder;
    private Double totalSpent;
    private LocalDate dateJoin;

    public UserAdminResponse(
            Long id,
            String fullName,
            String email,
            String phoneNumber,
            AuthProvider authProvider,
            Long totalOrder,
            Double totalSpent,
            LocalDate dateJoin
    ) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.authProvider = authProvider;
        this.totalOrder = totalOrder;
        this.totalSpent = totalSpent;
        this.dateJoin = dateJoin;
    }
}
