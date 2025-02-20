package com.romanwit.minicrm.repository;

import com.romanwit.minicrm.model.CustomerProperty;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerPropertyRepository extends JpaRepository<CustomerProperty, Long> {
	List<CustomerProperty> findByCustomerId(Long customerId);
}

