package com.fit.monolithic.backend.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.util.List;

@Data
public class CreateReviewRequest {

    @NotBlank(message = "Nội dung không được để trống")
    private String content;

    /** Chỉ bắt buộc với review gốc (parentId == null) */
    @Min(value = 1, message = "Tối thiểu 1 sao")
    @Max(value = 5, message = "Tối đa 5 sao")
    private Integer rating;

    @NotNull(message = "bookId không được để trống")
    private Long bookId;

    /** null → review gốc, non-null → reply */
    private Long parentId;

    private List<String> imageUrls;
}