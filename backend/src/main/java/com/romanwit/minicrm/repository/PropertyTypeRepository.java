package com.romanwit.minicrm.repository;

import com.romanwit.minicrm.model.PropertyType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PropertyTypeRepository extends JpaRepository<PropertyType, Long> {
	boolean existsByName(String name);
}

