package com.fit.monolithic.backend.repository;

import com.fit.monolithic.backend.entity.Address;
import com.fit.monolithic.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface AddressRepository extends JpaRepository<Address,Long> {
    List<Address> findAllByUser(User user);
}
