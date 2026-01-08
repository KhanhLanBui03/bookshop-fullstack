package com.fit.monolithic.backend.entity;

import com.fit.monolithic.backend.enums.TargetType;
import com.fit.monolithic.backend.enums.ValueType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "discounts")
public class Discount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column( nullable = false, length = 100)
    String name;
    @Column(nullable = false, unique = true, length = 50)
    String code;
    @Enumerated(EnumType.STRING)
    @Column( nullable = false)
    private TargetType discountTargetType;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ValueType discountValueType;
    @Column(nullable = false)
    private Double discountValue;
    private Double discountMaxAmount;
    @Column(nullable = false)
    private LocalDate discountStartDate;
    @Column(nullable = false)
    private LocalDate discountEndDate;
    private Long discountQuantityLimit;
    @Column(nullable = false)
    private boolean discountActive;
    @OneToMany(mappedBy = "discount", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Order> orders = new ArrayList<>();
}
