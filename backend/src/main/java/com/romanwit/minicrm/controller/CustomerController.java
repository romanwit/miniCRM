package com.romanwit.minicrm.controller;

import com.romanwit.minicrm.dto.CustomerWithAdditionalProperties;
import com.romanwit.minicrm.model.Customer;
import com.romanwit.minicrm.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import java.util.List;

import com.romanwit.minicrm.exception.ExceptionFilter;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "*")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @GetMapping
    public List<CustomerWithAdditionalProperties> getAllCustomers() {
        return customerService.getAllCustomers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerWithAdditionalProperties> getCustomersById(@PathVariable Long id) {
        // CustomerWithAdditionalProperties customer =
        // customerService.getCustomerById(id);
        // return (customer != null) ? ResponseEntity.ok(customer) :
        // ResponseEntity.notFound().build();
        return ResponseEntity.ok(customerService.getCustomerById(id));
    }

    @PostMapping
    public ResponseEntity<Customer> createCustomer(@RequestBody Customer customer) {
        return ResponseEntity.status(HttpStatus.CREATED).body(customerService.createCustomer(customer));
    }

    @PutMapping("/{id}")
    public Customer updateCustomer(@PathVariable Long id, @RequestBody Customer customer) {
        if (customer.getId() != null && !customer.getId().equals(id)) {
            throw new ExceptionFilter.InvalidRequestException("ID in path and body must match");
        }
        customer.setId(id);
        return customerService.updateCustomer(customer);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.noContent().build();
    }
}
