package com.fit.monolithic.backend.dto.response;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class CategoryResponse {
    private Long id;
    private String name;
    private String description;
    private String url;
}
