package com.fit.monolithic.backend.entity;

import com.fit.monolithic.backend.enums.BookStatus;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "books",
        indexes = {
                @Index(name = "idx_book_title", columnList = "title"),
                @Index(name = "idx_book_category", columnList = "category_id"),
                @Index(name = "idx_book_author", columnList = "author_id")
        }
)
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private BigDecimal oldPrice;
    private BigDecimal newPrice;
    @Lob
    private String description;
    @Column(precision = 2, scale = 1)
    private BigDecimal rating;
    @Enumerated(EnumType.STRING)
    private BookStatus  status;
    @CreationTimestamp
    private LocalDateTime createdAt;
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private Author author;

}
