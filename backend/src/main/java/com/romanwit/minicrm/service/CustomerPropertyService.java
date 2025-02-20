package com.romanwit.minicrm.service;

import com.romanwit.minicrm.model.CustomerProperty;
import com.romanwit.minicrm.repository.CustomerPropertyRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CustomerPropertyService {

    private final CustomerPropertyRepository customerPropertyRepository;

    public CustomerPropertyService(CustomerPropertyRepository customerPropertyRepository) {
        this.customerPropertyRepository = customerPropertyRepository;
    }

    public List<CustomerProperty> getAllProperties() {
        return customerPropertyRepository.findAll();
    }

    public Optional<CustomerProperty> getPropertyById(Long id) {
        return customerPropertyRepository.findById(id);
    }

    public List<CustomerProperty> getPropertiesByCustomerId(Long customerId) {
        return customerPropertyRepository.findByCustomerId(customerId);
    }

    public CustomerProperty createProperty(CustomerProperty property) {
        return customerPropertyRepository.save(property);
    }

    public CustomerProperty updateProperty(Long id, CustomerProperty updatedProperty) {
        return customerPropertyRepository.findById(id).map(existingProperty -> {
            existingProperty.setCustomer(updatedProperty.getCustomer());
            existingProperty.setPropertyType(updatedProperty.getPropertyType());
            existingProperty.setValue(updatedProperty.getValue());
            return customerPropertyRepository.save(existingProperty);
        }).orElseThrow(() -> new RuntimeException("CustomerProperty not found"));
    }

    public void deleteProperty(Long id) {
        customerPropertyRepository.deleteById(id);
    }
}
