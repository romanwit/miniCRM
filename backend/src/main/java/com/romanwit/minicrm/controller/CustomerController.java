package com.romanwit.minicrm.controller;

import com.romanwit.minicrm.model.Client;
import com.romanwit.minicrm.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;


import java.util.List;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "*")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @GetMapping
    public List<Client> getAllCustomers() {
        return customerService.getAllCustomers();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Client> getCustomersById(@PathVariable Long id) {
    	Client client = customerService.getCustomerById(id);
        return (client != null) ? ResponseEntity.ok(client) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public Client createCustomer(@RequestBody Client client) {
        return customerService.createCustomer(client);
    }

    @PutMapping("/{id}")
    public Client updateCustomer(@PathVariable Long id, @RequestBody Client client) {
        client.setId(id);
        return customerService.updateCustomer(client);
    }

    @DeleteMapping("/{id}")
    public void deleteCustomer(@PathVariable Long id) {
        customerService.deleteCustomer(id);
    }
}

