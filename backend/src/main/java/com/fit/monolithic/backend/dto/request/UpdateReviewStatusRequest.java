package com.fit.monolithic.backend.dto.request;

import com.fit.monolithic.backend.enums.CommentStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateReviewStatusRequest {

    @NotNull
    private CommentStatus status;
}