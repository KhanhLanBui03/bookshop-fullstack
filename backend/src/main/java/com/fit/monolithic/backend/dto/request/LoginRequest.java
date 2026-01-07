package com.fit.monolithic.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class LoginRequest {
    @NotBlank(message = "Email không được để trông!")
    @Email(message = "Email không hợp lệ")
    private String email;
    @NotBlank(message = "Mật khẩu không được để trống!")
    private String password;
}
