package com.fit.monolithic.backend.repository;

import com.fit.monolithic.backend.entity.Review;
import com.fit.monolithic.backend.enums.CommentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    /** Lấy review gốc (không phải reply) đã APPROVED */
    Page<Review> findByBookIdAndParentIsNullAndStatus(
            Long bookId, CommentStatus status, Pageable pageable
    );

    /** Kiểm tra user đã review sách này chưa (chỉ review gốc) */
    boolean existsByUserIdAndBookIdAndParentIsNull(Long userId, Long bookId);

    /** Tính rating trung bình cho sách */
    @Query("""
        SELECT AVG(r.rating) FROM Review r
        WHERE r.book.id = :bookId
          AND r.parent IS NULL
          AND r.status = 'APPROVED'
    """)
    Double calculateAverageRating(@Param("bookId") Long bookId);
}