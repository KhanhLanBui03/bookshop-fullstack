package com.fit.monolithic.backend.service.Impl;

import com.fit.monolithic.backend.dto.request.*;
import com.fit.monolithic.backend.dto.response.*;
import com.fit.monolithic.backend.entity.*;
import com.fit.monolithic.backend.enums.*;
import com.fit.monolithic.backend.exception.*;
import com.fit.monolithic.backend.repository.*;
import com.fit.monolithic.backend.service.ReviewService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class ReviewServiceImpl implements ReviewService {

        private final ReviewRepository reviewRepo;
        private final ReviewHelpfulRepository helpfulRepo;
        private final UserRepository userRepo;
        private final BookRepository bookRepo;
        private final OrderItemRepository orderItemRepo;
        private final com.fit.monolithic.backend.service.NotificationService notificationService;

        private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        // ──────────────────────────────────────────────────────────────────────────
        @Override
        public ReviewResponse createReview(Long userId, CreateReviewRequest req) {
                boolean isReply = req.getParentId() != null;

                User user = userRepo.findById(userId)
                                .orElseThrow(() -> new EntityNotFoundException("User not found"));

                boolean isAdmin = user.getRoles().stream()
                                .anyMatch(r -> r.getName().equals(com.fit.monolithic.backend.enums.RoleName.ROLE_ADMIN));

                // check purchase trước (Admin không cần check)
                if (!isAdmin && !isReply) {
                        boolean purchased = orderItemRepo.hasPurchased(
                                        userId,
                                        req.getBookId(),
                                        List.of(OrderStatus.PAID, OrderStatus.CONFIRMED,
                                                        OrderStatus.SHIPPING, OrderStatus.DELIVERED));

                        if (!purchased) {
                                throw new ApiException(403, "Cần mua và nhận sách trước khi đánh giá");
                        }
                }

                // check duplicate review
                if (!isReply && !isAdmin) {
                        if (reviewRepo.existsByUserIdAndBookIdAndParentIsNull(userId, req.getBookId())) {
                                throw new ApiException(400, "Bạn đã đánh giá sách này rồi");
                        }
                }

                if (req.getBookId() == null) {
                        throw new ApiException(400, "Book ID is bắt buộc");
                }

                Book book = bookRepo.findById(req.getBookId())
                                .orElseThrow(() -> new ApiException(404, "Sách không tồn tại"));

                Review parent = null;
                if (req.getParentId() != null) {
                        parent = reviewRepo.findById(req.getParentId()).orElse(null);
                }

                isReply = parent != null;

                if (!isReply && req.getRating() == null) {
                        throw new ApiException(400, "Rating là bắt buộc cho đánh giá mới");
                }

                Review.ReviewBuilder builder = Review.builder()
                                .content(req.getContent())
                                .status(isAdmin ? CommentStatus.APPROVED : CommentStatus.PENDING)
                                .user(user)
                                .book(book)
                                .parent(parent);

                if (isReply) {
                        builder.rating(5); // Mặc định 5 sao cho reply để tránh lỗi DB NOT NULL
                } else {
                        builder.rating(req.getRating());
                }

                Review reviewObj = builder.build();

                // Xử lý ảnh đính kèm
                if (req.getImageUrls() != null && !req.getImageUrls().isEmpty()) {
                        List<ReviewImage> images = new ArrayList<>();
                        for (String url : req.getImageUrls()) {
                                images.add(ReviewImage.builder()
                                                .url(url)
                                                .review(reviewObj)
                                                .build());
                        }
                        reviewObj.setImages(images);
                }

                Review saved = reviewRepo.save(reviewObj);

                if (isReply && parent != null && !parent.getUser().getId().equals(userId)) {
                        notificationService.createNotification(
                                        parent.getUser().getId(),
                                        "Có phản hồi mới",
                                        user.getFullName() + " đã trả lời đánh giá của bạn về sách " + book.getTitle(),
                                        "/books/" + book.getId());
                }

                if (!isReply) {
                        updateBookRating(book);
                        // 🔥 Gửi thông báo cho Admin duyệt review
                        notificationService.createNotificationToAdmins(
                                        "Đánh giá mới",
                                        user.getFullName() + " đã gửi đánh giá mới cho sách " + book.getTitle(),
                                        "/reviews");
                }

                return toResponse(saved, userId);
        }

        // ──────────────────────────────────────────────────────────────────────────
        @Override
        @Transactional(readOnly = true)
        public PageResponse<ReviewResponse> getBookReviews(
                        Long bookId, int page, int size, Long currentUserId) {
                Pageable pageable = PageRequest.of(page, size,
                                Sort.by("createdAt").descending());

                Page<Review> reviewPage = reviewRepo
                                .findByBookIdAndParentIsNullAndStatus(
                                                bookId, CommentStatus.APPROVED, pageable);

                List<ReviewResponse> content = reviewPage.getContent().stream()
                                .map(r -> toResponse(r, currentUserId))
                                .toList();

                return PageResponse.<ReviewResponse>builder()
                                .content(content)
                                .page(page).size(size)
                                .totalElements(reviewPage.getTotalElements())
                                .totalPages(reviewPage.getTotalPages())
                                .last(reviewPage.isLast())
                                .build();
        }

        // ──────────────────────────────────────────────────────────────────────────
        @Override
        public ReviewResponse updateReview(Long userId, Long reviewId, UpdateReviewRequest req) {
                Review review = findReviewOrThrow(reviewId);
                assertOwner(review, userId);

                review.setContent(req.getContent());
                if (review.getParent() == null)
                        review.setRating(req.getRating());
                review.setStatus(CommentStatus.PENDING); // reset → chờ duyệt lại

                Review saved = reviewRepo.save(review);
                if (review.getParent() == null)
                        updateBookRating(review.getBook());

                return toResponse(saved, userId);
        }

        // ──────────────────────────────────────────────────────────────────────────
        @Override
        public void deleteReview(Long userId, Long reviewId) {
                Review review = findReviewOrThrow(reviewId);
                assertOwner(review, userId);
                Book book = review.getBook();
                reviewRepo.delete(review);
                if (review.getParent() == null)
                        updateBookRating(book);
        }

        // ──────────────────────────────────────────────────────────────────────────
        @Override
        @Transactional
        public ReviewResponse updateReviewStatus(Long reviewId, UpdateReviewStatusRequest req) {
                Review review = findReviewOrThrow(reviewId);
                review.setStatus(req.getStatus());
                Review saved = reviewRepo.save(review);
                if (review.getParent() == null)
                        updateBookRating(review.getBook());

                String statusLabel = req.getStatus() == CommentStatus.APPROVED ? "được duyệt" : "bị từ chối";
                notificationService.createNotification(
                                review.getUser().getId(),
                                "Cập nhật trạng thái đánh giá",
                                "Đánh giá của bạn về sách " + review.getBook().getTitle() + " đã " + statusLabel,
                                "/books/" + review.getBook().getId());

                return toResponse(saved, null);
        }

        @Override
        @Transactional(readOnly = true)
        public PageResponse<ReviewResponse> getAllReviewsForAdmin(int page, int size, CommentStatus status) {
                Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

                Page<Review> reviewPage;
                if (status != null) {
                        reviewPage = reviewRepo.findAllByStatusAndParentIsNull(status, pageable);
                } else {
                        reviewPage = reviewRepo.findAllByParentIsNull(pageable);
                }

                List<ReviewResponse> content = reviewPage.getContent().stream()
                                .map(this::toAdminResponse)
                                .toList();

                return PageResponse.<ReviewResponse>builder()
                                .content(content)
                                .page(page).size(size)
                                .totalElements(reviewPage.getTotalElements())
                                .totalPages(reviewPage.getTotalPages())
                                .last(reviewPage.isLast())
                                .build();
        }

        // ──────────────────────────────────────────────────────────────────────────
        @Override
        public ReviewResponse toggleHelpful(Long userId, Long reviewId) {
                Review review = findReviewOrThrow(reviewId);
                User user = userRepo.findById(userId)
                                .orElseThrow(() -> new EntityNotFoundException("User not found"));

                Optional<ReviewHelpful> existing = helpfulRepo.findByUserIdAndReviewId(userId, reviewId);

                if (existing.isPresent()) {
                        helpfulRepo.delete(existing.get());
                } else {
                        helpfulRepo.save(ReviewHelpful.builder()
                                        .user(user).review(review).build());
                }

                // evict lazy collection
                reviewRepo.flush();
                return toResponse(reviewRepo.findById(reviewId).orElseThrow(), userId);
        }

        // ──────────────────────────── helpers ────────────────────────────────────
        private Review findReviewOrThrow(Long id) {
                return reviewRepo.findById(id)
                                .orElseThrow(() -> new EntityNotFoundException("Review not found: " + id));
        }

        private void assertOwner(Review review, Long userId) {
                if (!review.getUser().getId().equals(userId))
                        throw new AccessDeniedException("Bạn không có quyền thao tác review này");
        }

        private void updateBookRating(Book book) {
                Double avg = reviewRepo.calculateAverageRating(book.getId());
                book.setRating(avg != null
                                ? BigDecimal.valueOf(avg).setScale(1, RoundingMode.HALF_UP)
                                : null);
                bookRepo.save(book);
        }

        private ReviewResponse toResponse(Review r, Long currentUserId) {
                int helpfulCount = helpfulRepo.countByReviewId(r.getId());
                boolean isHelpful = currentUserId != null &&
                                helpfulRepo.existsByUserIdAndReviewId(currentUserId, r.getId());

                List<ReviewResponse> replies = r.getReplies() == null ? List.of()
                                : r.getReplies().stream()
                                                .filter(rep -> rep.getStatus() == CommentStatus.APPROVED)
                                                .map(rep -> toResponse(rep, currentUserId))
                                                .toList();

                return ReviewResponse.builder()
                                .id(r.getId())
                                .content(r.getContent())
                                .rating(r.getRating())
                                .status(r.getStatus())
                                .createdAt(r.getCreatedAt().format(FMT))
                                .user(ReviewUserResponse.builder()
                                                .id(r.getUser().getId())
                                                .fullName(r.getUser().getFullName())
                                                .isAdmin(r.getUser().getRoles().stream()
                                                                .anyMatch(role -> role.getName() == com.fit.monolithic.backend.enums.RoleName.ROLE_ADMIN))
                                                .build())
                                .parentId(r.getParent() != null ? r.getParent().getId() : null)
                                .replies(replies)
                                .helpfulCount(helpfulCount)
                                .helpful(isHelpful)
                                .imageUrls(r.getImages() != null 
                                        ? r.getImages().stream().map(ReviewImage::getUrl).toList() 
                                        : List.of())
                                .bookId(r.getBook() != null ? r.getBook().getId() : null)
                                .build();
        }

        private ReviewResponse toAdminResponse(Review r) {
                int helpfulCount = helpfulRepo.countByReviewId(r.getId());

                List<ReviewResponse> replies = r.getReplies() == null ? List.of()
                                : r.getReplies().stream()
                                                .map(this::toAdminResponse)
                                                .toList();

                return ReviewResponse.builder()
                                .id(r.getId())
                                .content(r.getContent())
                                .rating(r.getRating())
                                .status(r.getStatus())
                                .createdAt(r.getCreatedAt().format(FMT))
                                .user(ReviewUserResponse.builder()
                                                .id(r.getUser().getId())
                                                .fullName(r.getUser().getFullName())
                                                .build())
                                .parentId(r.getParent() != null ? r.getParent().getId() : null)
                                .replies(replies)
                                .helpfulCount(helpfulCount)
                                .imageUrls(r.getImages() != null 
                                        ? r.getImages().stream().map(ReviewImage::getUrl).toList() 
                                        : List.of())
                                .bookId(r.getBook() != null ? r.getBook().getId() : null)
                                .build();
        }
}