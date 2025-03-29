package com.romanwit.minicrm.controller;

import com.romanwit.minicrm.model.PropertyType;
import com.romanwit.minicrm.service.PropertyTypeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/property-types")
@CrossOrigin(origins = "*")
public class PropertyTypeController {

    private final PropertyTypeService propertyTypeService;

    public PropertyTypeController(PropertyTypeService propertyTypeService) {
        this.propertyTypeService = propertyTypeService;
    }

    @GetMapping
    public ResponseEntity<List<PropertyType>> getAllPropertyTypes() {
        return ResponseEntity.ok(propertyTypeService.getAllPropertyTypes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PropertyType> getPropertyTypeById(@PathVariable Long id) {
        Optional<PropertyType> propertyType = propertyTypeService.getPropertyTypeById(id);
        return propertyType.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<PropertyType> createPropertyType(@RequestBody PropertyType propertyType) {
        return ResponseEntity.status(HttpStatus.CREATED).body(propertyTypeService.createPropertyType(propertyType));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PropertyType> updatePropertyType(@PathVariable Long id,
            @RequestBody PropertyType propertyType) {
        return ResponseEntity.ok(propertyTypeService.updatePropertyType(id, propertyType));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePropertyType(@PathVariable Long id) {
        propertyTypeService.deletePropertyType(id);
        return ResponseEntity.noContent().build();
    }
}
