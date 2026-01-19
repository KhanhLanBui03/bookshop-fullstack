package com.fit.monolithic.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@ToString
public class CategoryRequest {
    @NotBlank(message = "Tên danh mục không được để trống")
    private String name;
    @NotBlank(message = "Mô tả không được để trống")
    private String description;
    private String url;
}
