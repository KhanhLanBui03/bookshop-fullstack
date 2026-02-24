package com.fit.monolithic.backend.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "cart_items",uniqueConstraints = @UniqueConstraint(columnNames = {"cart_id", "book_id"}))
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Integer quantity;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="cart_id",nullable = false)
    private Cart cart;
    @ManyToOne
    @JoinColumn(name="book_id")
    private Book book;
}
