package com.romanwit.minicrm.service;

import com.romanwit.minicrm.model.PropertyType;
import com.romanwit.minicrm.repository.PropertyTypeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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

    public PropertyType createPropertyType(PropertyType propertyType) {
        return propertyTypeRepository.save(propertyType);
    }

    public PropertyType updatePropertyType(Long id, PropertyType updatedPropertyType) {
        return propertyTypeRepository.findById(id).map(existingPropertyType -> {
            existingPropertyType.setName(updatedPropertyType.getName());
            existingPropertyType.setType(updatedPropertyType.getType());
            return propertyTypeRepository.save(existingPropertyType);
        }).orElseThrow(() -> new RuntimeException("PropertyType not found"));
    }

    public void deletePropertyType(Long id) {
        propertyTypeRepository.deleteById(id);
    }
}
