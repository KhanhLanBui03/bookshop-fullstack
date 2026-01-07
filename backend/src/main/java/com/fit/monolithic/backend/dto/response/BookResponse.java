package com.fit.monolithic.backend.dto.response;

import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class BookResponse {
    private Long id;
    private String title;
    private String description;
    private String publisher;

}
