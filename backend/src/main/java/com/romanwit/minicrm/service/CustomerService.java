package com.romanwit.minicrm.service;

import com.romanwit.minicrm.model.Customer;
import com.romanwit.minicrm.repository.CustomerRepository;
import com.romanwit.minicrm.repository.AuditLogRepository;
import com.romanwit.minicrm.model.AuditLog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }
    
    public Customer getCustomerById(Long id) {
    	return customerRepository.findById(id).orElse(null);
    }

    @Transactional
    public Customer createCustomer(Customer customer) {
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
        throw new IllegalArgumentException("Client not found");
    }

    @Transactional
    public void deleteCustomer(Long customerId) {
        Optional<Customer> existing = customerRepository.findById(customerId);
        if (existing.isPresent()) {
        	Customer customer = existing.get();
            customerRepository.delete(customer);
            logAction("Customer", customerId, "DELETE", customer.toString(), null);
        } else {
            throw new IllegalArgumentException("Customer not found");
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

