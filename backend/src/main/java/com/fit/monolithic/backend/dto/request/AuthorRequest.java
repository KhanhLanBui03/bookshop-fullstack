package com.fit.monolithic.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class AuthorRequest {
    @NotBlank(message = "Tên tác giả không được để trống")
    private String name;
    @NotBlank(message = "Email không được để trống")
    @Email
    private String email;
    @NotBlank
    private String bio;
    private String image;
}
