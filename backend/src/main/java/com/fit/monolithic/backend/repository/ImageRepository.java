package com.fit.monolithic.backend.repository;

import com.fit.monolithic.backend.entity.Image;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImageRepository extends JpaRepository<Image, Long> {
}
