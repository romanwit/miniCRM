package com.romanwit.minicrm.service;

import com.romanwit.minicrm.model.Customer;
import com.romanwit.minicrm.model.CustomerProperty;
import com.romanwit.minicrm.model.PropertyType;
import com.romanwit.minicrm.repository.CustomerPropertyRepository;
import com.romanwit.minicrm.repository.CustomerRepository;
import com.romanwit.minicrm.repository.PropertyTypeRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CustomerPropertyService {
	
	private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(CustomerPropertyService.class); 

	@Autowired
    private final CustomerPropertyRepository customerPropertyRepository;
	
	@Autowired
	private final CustomerRepository customerRepository;
	
	@Autowired
	private final PropertyTypeRepository propertyTypeRepository;

    public CustomerPropertyService(
    		CustomerPropertyRepository customerPropertyRepository, 
    		CustomerRepository customerRepository,
    		PropertyTypeRepository propertyTypeRepository
    		) {
        this.customerPropertyRepository = customerPropertyRepository;
        this.customerRepository = customerRepository;
        this.propertyTypeRepository = propertyTypeRepository;
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

    public List<CustomerProperty> updateProperties(Long customerId, Map<Long, String> propertyUpdates) {
    	
    	List<CustomerProperty> existingProperties = customerPropertyRepository.findByCustomerId(customerId);
        
        logger.info("existingProperties=" + existingProperties.toString());

        Map<Long, CustomerProperty> propertyMap = existingProperties.stream()
                .collect(Collectors.toMap(
                		cp->cp.getPropertyType().getId(), 
                		property -> property));

        List<CustomerProperty> propertiesToUpdate = new ArrayList<>();
        Customer customer = customerRepository.getById(customerId);
        for (Map.Entry<Long, String> update : propertyUpdates.entrySet()) {
            Long propertyId = update.getKey();
            String newValue = update.getValue();
            
            logger.info("propertyId="+propertyId+", newValue=" + newValue);
            
            if (newValue == null) {
                logger.info("Skipping propertyId=" + propertyId + " due to null value");
                continue;
            }

            CustomerProperty property = propertyMap.get(propertyId);
            if (property != null) {
                property.setValue(newValue);
                propertiesToUpdate.add(property);
            } else {
                property = new CustomerProperty();
                //property.setId(customerId);
                property.setCustomer(customer);
                PropertyType propertyType = propertyTypeRepository.getById(propertyId);
                property.setPropertyType(propertyType);
                property.setValue(newValue);
                propertiesToUpdate.add(property);
            }
        }

        logger.info("propertiesToUpdate");
        for (CustomerProperty propertyToUpdate: propertiesToUpdate) {
        	logger.info("customer=" + propertyToUpdate.getCustomer().getId() + "name=" + propertyToUpdate.getPropertyType().getName() + "value=" + propertyToUpdate.getValue());
        	customerPropertyRepository.save(propertyToUpdate);
        }
        //customerPropertyRepository.saveAll(propertiesToUpdate);

        return customerPropertyRepository.findByCustomerId(customerId);
    }

    public void deleteProperty(Long id) {
        customerPropertyRepository.deleteById(id);
    }
}
