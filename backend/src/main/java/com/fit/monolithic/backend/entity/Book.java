package com.fit.monolithic.backend.entity;

import com.fit.monolithic.backend.enums.BookStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
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
    @Column(nullable = false)
    private String title;
    private BigDecimal originalPrice;
    @Column(nullable = false)
    private BigDecimal salePrice;
    @Lob
    private String description;
    @Column(precision = 2, scale = 1)
    private BigDecimal rating;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookStatus  status;
    @Column(nullable = false)
    private Integer stock;
    @Column(nullable = false)
    private Integer soldCount = 0;
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
    @OneToMany(mappedBy = "book", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Image> images = new ArrayList<>();
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "publisher_id", nullable = false)
    private Publisher publisher;
}
