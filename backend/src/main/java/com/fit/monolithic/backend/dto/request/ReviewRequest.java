package com.fit.monolithic.backend.dto.request;

import com.fit.monolithic.backend.enums.CommentStatus;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ReviewRequest {
    @NotNull(message = "Book ID không được để trống")
    private Long bookId;

    @NotBlank(message = "Nội dung review không được để trống")
    private String content;

    @Min(value = 1, message = "Rating tối thiểu là 1")
    @Max(value = 5, message = "Rating tối đa là 5")
    private Integer rating;

}
