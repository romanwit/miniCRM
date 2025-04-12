package com.romanwit.minicrm.controller;

import com.romanwit.minicrm.model.*;
import com.romanwit.minicrm.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

import com.romanwit.minicrm.service.UserService;
import org.springframework.http.HttpStatus;

import com.romanwit.minicrm.dto.UserDto;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PropertyTypeRepository propertyTypeRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private FixedListValueRepository fixedListValueRepository;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> list = userService.getAllUsers();
        return ResponseEntity.ok(list);
    }

    @PostMapping("/users")
    public ResponseEntity<User> createUser(@RequestBody UserDto user) {
        var result = userService.createUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        var result = userService.updateUser(userDetails);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

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
    public ResponseEntity<PropertyType> updatePropertyType(@PathVariable Long id,
            @RequestBody PropertyType propertyDetails) {
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
    public ResponseEntity<FixedListValue> updateFixedListValue(@PathVariable Long id,
            @RequestBody FixedListValue valueDetails) {
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
