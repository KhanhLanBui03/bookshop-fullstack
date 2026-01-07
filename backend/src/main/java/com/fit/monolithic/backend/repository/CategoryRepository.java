package com.fit.monolithic.backend.repository;

import com.fit.monolithic.backend.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
