package com.romanwit.minicrm.controller;

import org.springframework.web.bind.annotation.*;

import com.romanwit.minicrm.service.RoleService;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import com.romanwit.minicrm.model.Role;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "*")
public class RoleController {

    @Autowired
    private RoleService roleService;

    @GetMapping("/roles")
    public ResponseEntity<List<Role>> getAllRoles() {
        return ResponseEntity.ok(roleService.getAllRoles());
    }

}