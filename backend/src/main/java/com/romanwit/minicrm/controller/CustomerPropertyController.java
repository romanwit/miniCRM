package com.romanwit.minicrm.controller;

import com.romanwit.minicrm.model.CustomerProperty;
import com.romanwit.minicrm.service.CustomerPropertyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping
    public ResponseEntity<List<CustomerProperty>> getAllProperties() {
        return ResponseEntity.ok(customerPropertyService.getAllProperties());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerProperty> getPropertyById(@PathVariable Long id) {
        Optional<CustomerProperty> property = customerPropertyService.getPropertyById(id);
        return property.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<CustomerProperty>> getPropertiesByCustomerId(@PathVariable Long customerId) {
        return ResponseEntity.ok(customerPropertyService.getPropertiesByCustomerId(customerId));
    }

    @PostMapping
    public ResponseEntity<CustomerProperty> createProperty(@RequestBody CustomerProperty property) {
        return ResponseEntity.ok(customerPropertyService.createProperty(property));
    }

    @PutMapping("/{id}")
    public ResponseEntity<List<CustomerProperty>> updateProperties(@PathVariable Long id, @RequestBody Map<Long, String> properties) {
        logger.info("propbody received as " + properties.toString() + " size " + properties.size());
    	return ResponseEntity.ok(customerPropertyService.updateProperties(id, properties));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProperty(@PathVariable Long id) {
        customerPropertyService.deleteProperty(id);
        return ResponseEntity.noContent().build();
    }
}
