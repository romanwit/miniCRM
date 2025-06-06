package com.romanwit.minicrm.controller;

import com.romanwit.minicrm.model.CustomerProperty;
import com.romanwit.minicrm.service.CustomerPropertyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/customer-properties")
@CrossOrigin(origins = "*")
public class CustomerPropertyController {

    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(CustomerPropertyController.class);

    private final CustomerPropertyService customerPropertyService;

    public CustomerPropertyController(CustomerPropertyService customerPropertyService) {
        this.customerPropertyService = customerPropertyService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerProperty> getPropertyById(@PathVariable Long id) {
        return ResponseEntity.ok(customerPropertyService.getPropertyById(id));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<CustomerProperty>> getPropertiesByCustomerId(@PathVariable Long customerId) {
        return ResponseEntity.ok(customerPropertyService.getPropertiesByCustomerId(customerId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<List<CustomerProperty>> updateProperties(@PathVariable Long id,
            @RequestBody Map<Long, String> properties) {
        logger.info("propbody received as " + properties.toString() + " size " + properties.size());
        return ResponseEntity.ok(customerPropertyService.updateProperties(id, properties));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProperty(@PathVariable Long id) {
        customerPropertyService.deleteProperty(id);
        return ResponseEntity.noContent().build();
    }
}
