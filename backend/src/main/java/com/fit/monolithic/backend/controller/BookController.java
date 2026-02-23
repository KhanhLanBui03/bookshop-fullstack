package com.fit.monolithic.backend.controller;

import com.fit.monolithic.backend.dto.request.BookRequest;
import com.fit.monolithic.backend.dto.response.BookCardResponse;
import com.fit.monolithic.backend.dto.response.BookResponse;
import com.fit.monolithic.backend.dto.response.based.ApiResponse;
import com.fit.monolithic.backend.entity.Book;
import com.fit.monolithic.backend.service.BookService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@Tag(name = "Book APIs",description = "Operations related to books")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/books")
public class BookController {
    private final BookService bookService;
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<BookResponse> save (@Valid @RequestBody BookRequest bookRequest) {
        return new ApiResponse<>(
                201,
                "Save Book",
                bookService.save(bookRequest)
        );
    }
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<List<BookCardResponse>> getAll() {
        return new ApiResponse<>(
                200,
                "Success",
                bookService.findAll()
        );
    }

    @GetMapping("/author/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<List<BookCardResponse>> getBooksByAuthor(@PathVariable Long id) {
        return new ApiResponse<>(
                200,
                "Success",
                bookService.getBooksByAuthor(id)
        );
    }
    @GetMapping("/top-best-seller")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<List<BookCardResponse>> getTopBookBestSeller() {
        return new ApiResponse<>(
                200,
                "Success",
                bookService.getTopBookBestSeller()
        );
    }
    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<BookResponse> getBookById(@PathVariable Long id) {
        return new ApiResponse<>(
                200,
                "Success",
                bookService.findById(id)
        );
    }
    @GetMapping("/{id}/related")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<List<BookCardResponse>> getRelatedBooks(@PathVariable Long id) {
        return new ApiResponse<>(
                200,
                "Success",
                bookService.getRelatedBooks(id)
        );
    }
    @GetMapping("/all-book")
    public ApiResponse<Page<BookCardResponse>> getBooks(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) BigDecimal minRating,
            @PageableDefault(size = 12) Pageable pageable
    ) {
        return new ApiResponse<>(
                200,
                "Success",
                bookService.getBooks(
                        keyword,
                        minPrice,
                        maxPrice,
                        category,
                        minRating,
                        pageable
                )
        );
    }

}
