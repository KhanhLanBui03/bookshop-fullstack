package com.fit.monolithic.backend.dto.response;

import com.fit.monolithic.backend.enums.AuthorStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class AuthorResponse {
    private Long id;
    private String name;
    private String email;
    private String bio;
    private String image;
    private AuthorStatus status;
}
