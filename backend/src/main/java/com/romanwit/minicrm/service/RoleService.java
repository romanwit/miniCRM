package com.romanwit.minicrm.service;

import org.springframework.stereotype.Service;
import com.romanwit.minicrm.repository.RoleRepository;
import com.romanwit.minicrm.model.Role;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;

@Service
public class RoleService {

    @Autowired
    private RoleRepository roleRepository;

    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

}