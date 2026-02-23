package com.fit.monolithic.backend.specification;

import com.fit.monolithic.backend.entity.Book;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;

public class BookSpecification {

    public static Specification<Book> filter(
            String keyword,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String category,
            BigDecimal minRating
    ) {

        return (root, query, cb) -> {
            // ✅ Chỉ distinct ở data query, không apply cho count query
            if (!query.getResultType().equals(Long.class)) {
                query.distinct(true);
            }

            var predicate = cb.conjunction();

            if (keyword != null && !keyword.isBlank()) {
                predicate = cb.and(predicate,
                        cb.like(cb.lower(root.get("title")), "%" + keyword.toLowerCase() + "%"));
            }

            if (minPrice != null) {
                predicate = cb.and(predicate,
                        cb.greaterThanOrEqualTo(root.get("salePrice"), minPrice));
            }

            if (maxPrice != null) {
                predicate = cb.and(predicate,
                        cb.lessThanOrEqualTo(root.get("salePrice"), maxPrice));
            }

            // ✅ Dùng subquery thay vì JOIN trực tiếp để tránh duplicate rows
            if (category != null && !category.isBlank()) {
                var categoryJoin = root.join("category", JoinType.LEFT);
                predicate = cb.and(predicate,
                        cb.equal(categoryJoin.get("name"), category));
            }

            if (minRating != null) {
                predicate = cb.and(predicate,
                        cb.greaterThanOrEqualTo(root.get("rating"), minRating));
            }

            return predicate;
        };
    }
}