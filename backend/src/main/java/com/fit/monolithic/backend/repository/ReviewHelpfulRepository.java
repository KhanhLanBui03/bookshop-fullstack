package com.fit.monolithic.backend.repository;

import com.fit.monolithic.backend.entity.ReviewHelpful;
import org.springframework.data.jpa.repository.*;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

public interface ReviewHelpfulRepository extends JpaRepository<ReviewHelpful, Long> {

    boolean existsByUserIdAndReviewId(Long userId, Long reviewId);

    int countByReviewId(Long reviewId);

    Optional<ReviewHelpful> findByUserIdAndReviewId(Long userId, Long reviewId);

    @Modifying
    @Transactional
    void deleteByUserIdAndReviewId(Long userId, Long reviewId);
}