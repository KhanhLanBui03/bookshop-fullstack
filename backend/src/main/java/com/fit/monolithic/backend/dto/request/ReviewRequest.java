package com.fit.monolithic.backend.dto.request;

import com.fit.monolithic.backend.enums.CommentStatus;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReviewRequest {

    @NotBlank(message = "Nội dung review không được để trống")
    private String content;

    @Min(value = 1)
    @Max(value = 5)
    private Integer rating;
}
