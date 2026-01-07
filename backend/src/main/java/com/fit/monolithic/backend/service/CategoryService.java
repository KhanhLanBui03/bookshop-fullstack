package com.fit.monolithic.backend.service;

import com.fit.monolithic.backend.dto.request.CategoryRequest;
import com.fit.monolithic.backend.dto.response.CategoryResponse;

import java.util.List;
import java.util.Optional;

public interface CategoryService {
    CategoryResponse save(CategoryRequest request);
    List<CategoryResponse> findAll();
    CategoryResponse findById(Long id);
    String deleteById(Long id);
//    CategoryResponse update(Long id,CategoryRequest request);
}
