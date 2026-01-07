package com.fit.monolithic.backend.repository;

import com.fit.monolithic.backend.entity.Publisher;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PublisherRepository extends JpaRepository<Publisher, Long> {
}
