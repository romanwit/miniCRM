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
public class PropertyTypeControllerApi {

    private final PropertyTypeService propertyTypeService;

    public PropertyTypeControllerApi(PropertyTypeService propertyTypeService) {
        this.propertyTypeService = propertyTypeService;
    }

    @GetMapping
    public ResponseEntity<List<PropertyType>> getAllPropertyTypes() {
        return ResponseEntity.ok(propertyTypeService.getAllPropertyTypes());
    }

}
