package com.fit.monolithic.backend.repository;

import com.fit.monolithic.backend.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AddressRepository extends JpaRepository<Address,Long> {
}
