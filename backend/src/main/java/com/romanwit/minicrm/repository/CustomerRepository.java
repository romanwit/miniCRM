package com.romanwit.minicrm.repository;

import com.romanwit.minicrm.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    boolean existsByName(String name);
    // @Query("SELECT c FROM Client c LEFT JOIN FETCH c.properties")
    // List<Client> findAllWithProperties();
}
