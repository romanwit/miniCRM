package com.romanwit.minicrm.service;

import com.romanwit.minicrm.model.User;
import com.romanwit.minicrm.repository.UserRepository;
import com.romanwit.minicrm.repository.AuditLogRepository;
import com.romanwit.minicrm.model.AuditLog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.romanwit.minicrm.exception.ExceptionFilter;

import java.util.Optional;
import java.util.List;

import com.romanwit.minicrm.dto.UserDto;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.romanwit.minicrm.model.Role;
import com.romanwit.minicrm.repository.RoleRepository;
import com.romanwit.minicrm.dto.UserResponse;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private RoleRepository roleRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public UserResponse createUser(UserDto userDto) {
        if (userDto.getUsername() == null || userDto.getUsername().isBlank()) {
            throw new ExceptionFilter.InvalidRequestException("Username cannot be empty");
        }
        if (userRepository.existsByUsername(userDto.getUsername())) {
            throw new ExceptionFilter.ResourceAlreadyExistsException(
                    "User with username " + userDto.getUsername() + " already exists");
        }

        User user = new User();
        user.setUsername(userDto.getUsername());
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        Role role = roleRepository.findById(userDto.getRole())
                .orElseThrow(() -> new ExceptionFilter.ResourceNotFoundException("Role id " +
                        userDto.getRole() + "does not exist"));
        user.setRole(role);
        User savedUser = userRepository.save(user);
        var id = savedUser.getId();
        var result = new UserResponse(id, userDto.getUsername());
        logAction("User", savedUser.getId(), "CREATE", null, savedUser.toString());
        return result;
    }

    @Transactional
    public User updateUser(User user) {
        User existing = userRepository.findById(user.getId())
                .orElseThrow(() -> new ExceptionFilter.ResourceNotFoundException(
                        "User with id " + user.getId() + " not found"));
        if (!existing.getUsername().equals(user.getUsername()) &&
                userRepository.existsByUsername(user.getUsername())) {
            throw new ExceptionFilter.ResourceAlreadyExistsException(
                    "User with username " + user.getUsername() + " already exists");
        }
        User updatedUser = userRepository.save(user);
        logAction("User", updatedUser.getId(), "UPDATE", existing.toString(), updatedUser.toString());
        return updatedUser;
    }

    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ExceptionFilter.ResourceNotFoundException(
                        "User with id " + userId + " not found"));
        userRepository.delete(user);
        logAction("User", userId, "DELETE", user.toString(), null);
    }

    private void logAction(String entity, Long entityId, String action, String oldValue, String newValue) {
        AuditLog log = new AuditLog();
        log.setEntity(entity);
        log.setEntityId(entityId);
        log.setAction(action);
        log.setOldValue(oldValue);
        log.setNewValue(newValue);
        auditLogRepository.save(log);
    }
}
