package com.fit.monolithic.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class PublisherRequest {
    @NotBlank(message = "Tên không được để trống")
    @Size(min = 2, message = "Tên phải có ít nhất 2 ký tự")
    private  String name;
    @Size(max = 500, message = "Mô tả không được vượt quá 500 ký tự")
    private String description;
    @NotBlank(message = "Quốc gia không được để trống")
    private String country;
}
