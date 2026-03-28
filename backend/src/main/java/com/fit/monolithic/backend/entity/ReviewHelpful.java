package com.fit.monolithic.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(
        name = "review_helpfuls",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_helpful_user_review",
        columnNames = {"user_id", "review_id"}
    )
            )
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class ReviewHelpful {
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_id", nullable = false)
    private Review review;
}
