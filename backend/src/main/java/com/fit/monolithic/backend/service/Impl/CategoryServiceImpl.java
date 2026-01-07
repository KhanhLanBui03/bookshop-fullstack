package com.fit.monolithic.backend.service.Impl;

import com.fit.monolithic.backend.dto.request.CategoryRequest;
import com.fit.monolithic.backend.dto.response.CategoryResponse;
import com.fit.monolithic.backend.entity.Category;
import com.fit.monolithic.backend.repository.CategoryRepository;
import com.fit.monolithic.backend.service.CategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;

    @Override
    public CategoryResponse save(CategoryRequest request) {
        Category category = new Category();
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        categoryRepository.save(category);
        log.info("Category Saved Successfully");
        return new CategoryResponse(category.getId(), category.getName(), category.getDescription());
    }

    @Override
    public List<CategoryResponse> findAll() {
        log.info("Finding All Categories Successfully");
        return categoryRepository.findAll()
                .stream()
                .map(category -> new CategoryResponse(category.getId(),category.getName(),category.getDescription()))
                .toList();
    }

    @Override
    public CategoryResponse findById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Category not found with id: " + id)
                );
        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getDescription()
        );
    }

    @Override
    public String deleteById(Long id) {
        Category response = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
        categoryRepository.delete(response);
        log.info("Category Deleted Successfully");
        return "Category Deleted Successfully";
    }
}
