package com.fit.monolithic.backend.service.Impl;

import com.fit.monolithic.backend.dto.request.ReviewRequest;
import com.fit.monolithic.backend.dto.response.ReviewResponse;
import com.fit.monolithic.backend.entity.Book;
import com.fit.monolithic.backend.entity.Review;
import com.fit.monolithic.backend.entity.User;
import com.fit.monolithic.backend.repository.BookRepository;
import com.fit.monolithic.backend.repository.ReviewRepository;
import com.fit.monolithic.backend.repository.UserRepository;
import com.fit.monolithic.backend.service.ReviewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    public ReviewResponse mapToResponse(Review review) {
        return new ReviewResponse(
                review.getId(),
                review.getBook().getId(),
                review.getUser().getId(),
                review.getUser().getFullName(),
                review.getContent(),
                review.getRating(),
                review.getCreatedAt()
        );
    }

    @Override
    public List<ReviewResponse> getAllByBook(Long bookId) {
        List<Review> reviews = reviewRepository.findByBookId(bookId);
        return reviews.stream()
                .map(this::mapToResponse)
                .toList();

    }

    @Override
    public ReviewResponse save(ReviewRequest reviewRequest) {
        Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findById(userId).orElseThrow(()-> new RuntimeException("User not found"));
        Book book = bookRepository.findById(reviewRequest.getBookId()).orElseThrow(()-> new RuntimeException("Book not found"));
        Review review = new Review();
        review.setUser(user);
        review.setBook(book);
        review.setContent(reviewRequest.getContent());
        review.setRating(reviewRequest.getRating());

        Review saved = reviewRepository.save(review);

        return mapToResponse(saved);
    }
}
