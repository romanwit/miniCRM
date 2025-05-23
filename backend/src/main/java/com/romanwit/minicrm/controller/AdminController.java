package com.romanwit.minicrm.controller;

import com.romanwit.minicrm.model.*;
import com.romanwit.minicrm.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

import com.romanwit.minicrm.service.FixedListValueService;
import com.romanwit.minicrm.service.UserService;
import org.springframework.http.HttpStatus;

import com.romanwit.minicrm.dto.UserDto;
import com.romanwit.minicrm.dto.UserResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.romanwit.minicrm.dto.FixedListValueDto;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import com.romanwit.minicrm.dto.SynchronizationResultDto;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(AdminController.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PropertyTypeRepository propertyTypeRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private FixedListValueService fixedListValueService;

    @Autowired
    private FixedListValueRepository fixedListValueRepository;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> list = userService.getAllUsers();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PostMapping("/users")
    public ResponseEntity<UserResponse> createUser(@RequestBody UserDto user) {
        var result = userService.createUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<UserResponse> updateUser(@PathVariable Long id, @RequestBody UserDto userDetails) {
        logger.info("updateUser started");
        var result = userService.updateUser(id, userDetails);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/fixed-list-values")
    public List<FixedListValueDto> getAllFixedListValues() {
        return fixedListValueService.getAllValues();
    }

    @GetMapping("/fixed-list-values/{id}")
    public List<FixedListValueDto> getFixedListValuesByPropertyId(@PathVariable Long id) {
        return fixedListValueService.getValueById(id);
    }

    /*
     * @PostMapping("/fixed-list-values")
     * public ResponseEntity<FixedListValue> createFixedListValue(@RequestBody
     * FixedListValue value) {
     * fixedListValueRepository.save(value);
     * return ResponseEntity.ok(value);
     * }
     */

    // @PutMapping("/fixed-list-values/{id}")
    /*
     * public ResponseEntity<FixedListValue> updateFixedListValue(@PathVariable Long
     * id,
     * 
     * @RequestBody FixedListValue valueDetails) {
     * Optional<FixedListValue> valueOptional =
     * fixedListValueRepository.findById(id);
     * if (valueOptional.isPresent()) {
     * FixedListValue value = valueOptional.get();
     * value.setValue(valueDetails.getValue());
     * fixedListValueRepository.save(value);
     * return ResponseEntity.ok(value);
     * }
     * return ResponseEntity.notFound().build();
     * }
     */
    @PutMapping("/fixed-list-values/{propertyId}")
    public ResponseEntity<SynchronizationResultDto> synchronizeValues(
            @PathVariable @NotNull Long propertyId,
            @RequestBody @NotEmpty List<@NotEmpty String> values) {
        SynchronizationResultDto result = fixedListValueService.synchronizeValues(propertyId, values);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/fixed-list-values/{id}")
    public ResponseEntity<Void> deleteFixedListValue(@PathVariable Long id) {
        // fixedListValueRepository.deleteById(id);
        fixedListValueService.deleteValues(id);
        return ResponseEntity.ok().build();
    }
}
