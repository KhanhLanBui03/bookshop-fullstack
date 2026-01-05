package com.fit.monolithic.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Entity
@Table(name = "users")
public class User {
    private Long  id;
    private String fullName;
    private String email;
    private String password;
    private String role;
}
