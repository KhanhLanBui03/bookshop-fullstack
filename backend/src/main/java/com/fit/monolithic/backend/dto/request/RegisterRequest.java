package com.fit.monolithic.backend.dto.request;

import com.fit.monolithic.backend.enums.AuthProvider;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class RegisterRequest {
    @NotEmpty
    private String name;
    @NotBlank
    @Email
    private String email;
    @NotBlank
    private String password;

}
