package com.fit.monolithic.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fit.monolithic.backend.enums.CommentStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
        name = "reviews",
        indexes = {
                @Index(name = "idx_review_book", columnList = "book_id"),
                @Index(name = "idx_review_user", columnList = "user_id"),
                @Index(name = "idx_review_parent", columnList = "parent_review_id")
        }
)
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Lob
    private String content;

    @Min(1)
    @Max(5)
    private Integer rating;

    @Enumerated(EnumType.STRING)
    private CommentStatus status;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_review_id")
    @JsonIgnore
    private Review parent;

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL)
    private List<Review> replies = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", nullable = false)
    @JsonIgnore
    private Book book;
}

