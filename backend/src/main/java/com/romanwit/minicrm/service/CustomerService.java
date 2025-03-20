package com.romanwit.minicrm.service;

import com.romanwit.minicrm.model.Customer;
import com.romanwit.minicrm.model.CustomerProperty;
import com.romanwit.minicrm.model.PropertyType;
import com.romanwit.minicrm.repository.CustomerRepository;
import com.romanwit.minicrm.repository.PropertyTypeRepository;
import com.romanwit.minicrm.repository.AuditLogRepository;
import com.romanwit.minicrm.repository.CustomerPropertyRepository;
import com.romanwit.minicrm.dto.CustomerWithAdditionalProperties;
import com.romanwit.minicrm.model.AuditLog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

import com.romanwit.minicrm.exception.ExceptionFilter;

@Service
public class CustomerService {

    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(CustomerService.class);

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Autowired
    private PropertyTypeRepository propertyTypeRepository;

    @Autowired
    private CustomerPropertyRepository customerPropertyRepository;

    public List<CustomerWithAdditionalProperties> getAllCustomers() {
        List<Customer> customers = customerRepository.findAll();

        Map<Long, PropertyType> propertyTypeMap = propertyTypeRepository.findAll().stream()
                .collect(Collectors.toMap(PropertyType::getId, Function.identity()));

        Map<Long, Map<Long, Object>> customerPropertiesMap = customerPropertyRepository.findAll().stream()
                .collect(Collectors.groupingBy(
                        cp -> cp.getCustomer().getId(),
                        Collectors.toMap(
                                cp -> propertyTypeMap.get(cp.getPropertyType().getId()).getId(),
                                CustomerProperty::getValue)));
        // logger.info(customerPropertiesMap.toString());

        List<CustomerWithAdditionalProperties> result = new ArrayList<>();

        for (Customer customer : customers) {
            Map<Long, Object> properties = new HashMap<>();

            propertyTypeMap.values().forEach(type -> properties.put(type.getId(), null));

            if (customerPropertiesMap.containsKey(customer.getId())) {
                properties.putAll(customerPropertiesMap.get(customer.getId()));
            }

            result.add(new CustomerWithAdditionalProperties(
                    customer.getId(),
                    customer.getName(),
                    customer.getRegistrationDate(),
                    customer.getEmail(),
                    customer.getPhone(),
                    new HashMap<>(properties)));
        }

        return result;
    }

    public CustomerWithAdditionalProperties getCustomerById(Long id) {

        Customer customer = customerRepository.findById(id).orElse(null);
        if (customer == null) {
            return null;
        }

        Map<Long, PropertyType> propertyTypeMap = propertyTypeRepository.findAll().stream()
                .collect(Collectors.toMap(PropertyType::getId, Function.identity()));

        Map<Long, Object> properties = customerPropertyRepository.findByCustomerId(id).stream()
                .collect(Collectors.toMap(
                        cp -> propertyTypeMap.get(cp.getPropertyType().getId()).getId(),
                        CustomerProperty::getValue));

        propertyTypeMap.values().forEach(type -> properties.putIfAbsent(type.getId(), null));

        return new CustomerWithAdditionalProperties(
                customer.getId(),
                customer.getName(),
                customer.getRegistrationDate(),
                customer.getEmail(),
                customer.getPhone(),
                new HashMap<>(properties));
    }

    @Transactional
    public Customer createCustomer(Customer customer) {
        if (customerRepository.existsByName(customer.getName())) {
            throw new ExceptionFilter.ResourceAlreadyExistsException(customer.getName() +
                    " already exists");
        }
        Customer savedCustomer = customerRepository.save(customer);
        logAction("Customer", savedCustomer.getId(), "CREATE", null, savedCustomer.toString());
        return savedCustomer;
    }

    @Transactional
    public Customer updateCustomer(Customer customer) {
        Optional<Customer> existing = customerRepository.findById(customer.getId());
        if (existing.isPresent()) {
            Customer oldCustomer = existing.get();
            Customer updatedCustomer = customerRepository.save(customer);
            logAction("Client", updatedCustomer.getId(), "UPDATE", oldCustomer.toString(), updatedCustomer.toString());
            return updatedCustomer;
        }
        throw new ExceptionFilter.ResourceNotFoundException("Customer with id " +
                customer.getId() + " not found");
    }

    @Transactional
    public void deleteCustomer(Long customerId) {
        Optional<Customer> existing = customerRepository.findById(customerId);
        if (existing.isPresent()) {
            Customer customer = existing.get();
            customerRepository.delete(customer);
            logAction("Customer", customerId, "DELETE", customer.toString(), null);
        } else {
            throw new ExceptionFilter.ResourceNotFoundException("Customer with id " +
                    customerId + " not found");
        }
    }

    private void logAction(String entity, Long entityId, String action, String oldValue, String newValue) {
        AuditLog log = new AuditLog();
        log.setEntity(entity);
        log.setEntityId(entityId);
        log.setAction(action);
        log.setOldValue(oldValue);
        log.setNewValue(newValue);
        auditLogRepository.save(log);
    }
}
