package com.fit.monolithic.backend.controller;

import com.fit.monolithic.backend.dto.request.CategoryRequest;
import com.fit.monolithic.backend.dto.response.CategoryResponse;
import com.fit.monolithic.backend.dto.response.based.ApiResponse;
import com.fit.monolithic.backend.service.CategoryService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@Tag(name = "Category API", description = "Operations related to categories")
@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<List<CategoryResponse>> findAll() {
        return new ApiResponse<>(
                200,
                "Success",
                categoryService.findAll()
        );
    }
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<CategoryResponse> save(@Valid @RequestBody CategoryRequest request){
        return new ApiResponse<>(
                200,
                "Success",
                categoryService.save(request)
        );
    }
    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<CategoryResponse> findById(@PathVariable Long id) {
        return new ApiResponse<>(
                200,
                "Success",
                categoryService.findById(id)
        );
    }
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<String> deleteById(@PathVariable Long id){
        return new ApiResponse<>(
                200,
                "Success",
                categoryService.deleteById(id)
        );
    }
    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<CategoryResponse> updateCategory(@PathVariable Long id,@RequestBody CategoryRequest request){
        return new ApiResponse<>(
                200,
                "Success",
                categoryService.update(id, request)
        );
    }
}
