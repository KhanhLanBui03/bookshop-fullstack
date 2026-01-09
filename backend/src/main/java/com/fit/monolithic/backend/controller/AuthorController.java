package com.fit.monolithic.backend.controller;

import com.fit.monolithic.backend.dto.request.AuthorRequest;
import com.fit.monolithic.backend.dto.response.AuthorResponse;
import com.fit.monolithic.backend.dto.response.based.ApiResponse;
import com.fit.monolithic.backend.service.AuthorService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Tag(name = "Author API", description = "Operations related to authors")
@RestController
@RequestMapping("/api/v1/authors")
@RequiredArgsConstructor
public class AuthorController {
    private final AuthorService authorService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<List<AuthorResponse>> getAllAuthors() {
        return new ApiResponse<>(
                201,
                "Success",
                authorService.getAllAuthors()
        );
    }

    @GetMapping("/{id}")
    public ApiResponse<AuthorResponse> getAuthorById(@PathVariable Long id) {
        return new ApiResponse<AuthorResponse>(
                200,
                "Success",
                authorService.getAuthorById(id)
        );
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<AuthorResponse> addAuthor(@Valid @RequestBody AuthorRequest authorRequest) {
        return new ApiResponse<>(
                201,
                "Success",
                authorService.save(authorRequest)
        );
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<AuthorResponse> updateAuthor(
            @PathVariable @Positive(message = "ID phải là số dương") Long id, @Valid @RequestBody AuthorRequest authorRequest) {
        return new ApiResponse<>(
                200,
                "Success",
                authorService.update(id, authorRequest)
        );
    }
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ApiResponse<String> deleteAuthorById(@PathVariable Long id) {
        return new ApiResponse<>(
                200,
                "Success",
                authorService.deleteAuthorById(id)
        );
    }

}
