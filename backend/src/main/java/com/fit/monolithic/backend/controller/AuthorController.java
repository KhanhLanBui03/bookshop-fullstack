package com.fit.monolithic.backend.controller;

import com.fit.monolithic.backend.dto.request.AuthorRequest;
import com.fit.monolithic.backend.dto.response.AuthorResponse;
import com.fit.monolithic.backend.service.AuthorService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@Tag(name = "Author API", description = "Operations related to authors")
@RestController
@RequestMapping("/api/v1/authors")
@RequiredArgsConstructor
public class AuthorController {
    private final AuthorService authorService;
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<AuthorResponse> getAllAuthors() {
        return authorService.getAllAuthors();
    }
    @GetMapping("/{id}")
    public AuthorResponse getAuthorById(@PathVariable Long id) {
        return authorService.getAuthorById(id);
    }
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AuthorResponse addAuthor(@Valid @RequestBody AuthorRequest authorRequest) {
        return authorService.save(authorRequest);
    }
}
