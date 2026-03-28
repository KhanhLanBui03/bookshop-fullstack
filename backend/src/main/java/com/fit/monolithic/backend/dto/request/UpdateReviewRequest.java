package com.fit.monolithic.backend.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class UpdateReviewRequest {

    @NotBlank(message = "Nội dung không được để trống")
    private String content;

    @Min(1) @Max(5)
    private Integer rating;
}