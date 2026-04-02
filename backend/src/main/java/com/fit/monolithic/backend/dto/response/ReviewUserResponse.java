package com.fit.monolithic.backend.dto.response;

import lombok.*;

@Data
@Builder
public class ReviewUserResponse {
    private Long   id;
    private String fullName;
}