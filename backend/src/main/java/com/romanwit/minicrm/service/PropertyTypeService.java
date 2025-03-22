package com.romanwit.minicrm.service;

import com.romanwit.minicrm.model.PropertyType;
import com.romanwit.minicrm.repository.PropertyTypeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import com.romanwit.minicrm.exception.ExceptionFilter;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PropertyTypeService {

    private final PropertyTypeRepository propertyTypeRepository;

    public PropertyTypeService(PropertyTypeRepository propertyTypeRepository) {
        this.propertyTypeRepository = propertyTypeRepository;
    }

    public List<PropertyType> getAllPropertyTypes() {
        return propertyTypeRepository.findAll();
    }

    public Optional<PropertyType> getPropertyTypeById(Long id) {
        return propertyTypeRepository.findById(id);
    }

	@Transactional
    public PropertyType createPropertyType(PropertyType propertyType) {
	if (propertyType.getName() == null || propertyType.getName().isBlank()) {
        	throw new ExceptionFilter.InvalidRequestException("PropertyType name cannot be empty");
    	}
	if (propertyTypeRepository.existsByName(propertyType.getName())) {
        	throw new ExceptionFilter.ResourceAlreadyExistsException(
            	"PropertyType with name " + propertyType.getName() + " already exists");
    	}
        return propertyTypeRepository.save(propertyType);
    }

	@Transactional
    public PropertyType updatePropertyType(Long id, PropertyType updatedPropertyType) {
	if (updatedPropertyType.getName() == null || updatedPropertyType.getName().isBlank()) {
        	throw new ExceptionFilter.InvalidRequestException("PropertyType name cannot be empty");
    	}
        PropertyType existingPropertyType = propertyTypeRepository.findById(id)
        	.orElseThrow(() -> new ExceptionFilter.ResourceNotFoundException(
            	"PropertyType with id " + id + " not found"));
	if (!existingPropertyType.getName().equals(updatedPropertyType.getName()) &&
        	propertyTypeRepository.existsByName(updatedPropertyType.getName())) {
        	throw new ExceptionFilter.ResourceAlreadyExistsException(
            	"PropertyType with name " + updatedPropertyType.getName() + " already exists");
    	}
    	existingPropertyType.setName(updatedPropertyType.getName());
    	existingPropertyType.setType(updatedPropertyType.getType());
    	return propertyTypeRepository.save(existingPropertyType);
    }

	@Transactional
    public void deletePropertyType(Long id) {
	if (!propertyTypeRepository.existsById(id)) {
        	throw new ExceptionFilter.ResourceNotFoundException(
            	"PropertyType with id " + id + " not found");
    	}
        propertyTypeRepository.deleteById(id);
    }
}
