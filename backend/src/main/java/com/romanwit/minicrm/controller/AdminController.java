package com.romanwit.minicrm.controller;

import com.romanwit.minicrm.model.*;
import com.romanwit.minicrm.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PropertyTypeRepository propertyTypeRepository;

    @Autowired
    private FixedListValueRepository fixedListValueRepository;

    // --- Users CRUD ---
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PostMapping("/users")
    public ResponseEntity<User> createUser(@RequestBody User user) {
        userRepository.save(user);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setUsername(userDetails.getUsername());
            user.setPassword(userDetails.getPassword()); // Ensure password hashing in service layer.
            user.setRole(userDetails.getRole());
            userRepository.save(user);
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // --- Property Types CRUD ---
    @GetMapping("/property-types")
    public List<PropertyType> getAllPropertyTypes() {
        return propertyTypeRepository.findAll();
    }

    @PostMapping("/property-types")
    public ResponseEntity<PropertyType> createPropertyType(@RequestBody PropertyType propertyType) {
        propertyTypeRepository.save(propertyType);
        return ResponseEntity.ok(propertyType);
    }

    @PutMapping("/property-types/{id}")
    public ResponseEntity<PropertyType> updatePropertyType(@PathVariable Long id, @RequestBody PropertyType propertyDetails) {
        Optional<PropertyType> propertyTypeOptional = propertyTypeRepository.findById(id);
        if (propertyTypeOptional.isPresent()) {
            PropertyType propertyType = propertyTypeOptional.get();
            propertyType.setName(propertyDetails.getName());
            propertyType.setType(propertyDetails.getType());
            propertyTypeRepository.save(propertyType);
            return ResponseEntity.ok(propertyType);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/property-types/{id}")
    public ResponseEntity<Void> deletePropertyType(@PathVariable Long id) {
        propertyTypeRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // --- Fixed List Values CRUD ---
    @GetMapping("/fixed-list-values")
    public List<FixedListValue> getAllFixedListValues() {
        return fixedListValueRepository.findAll();
    }

    @PostMapping("/fixed-list-values")
    public ResponseEntity<FixedListValue> createFixedListValue(@RequestBody FixedListValue value) {
        fixedListValueRepository.save(value);
        return ResponseEntity.ok(value);
    }

    @PutMapping("/fixed-list-values/{id}")
    public ResponseEntity<FixedListValue> updateFixedListValue(@PathVariable Long id, @RequestBody FixedListValue valueDetails) {
        Optional<FixedListValue> valueOptional = fixedListValueRepository.findById(id);
        if (valueOptional.isPresent()) {
            FixedListValue value = valueOptional.get();
            value.setValue(valueDetails.getValue());
            fixedListValueRepository.save(value);
            return ResponseEntity.ok(value);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/fixed-list-values/{id}")
    public ResponseEntity<Void> deleteFixedListValue(@PathVariable Long id) {
        fixedListValueRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}

