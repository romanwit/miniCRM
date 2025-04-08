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

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public User createUser(User user) {
        if (user.getUsername() == null || user.getUsername().isBlank()) {
            throw new ExceptionFilter.InvalidRequestException("Username cannot be empty");
        }
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new ExceptionFilter.ResourceAlreadyExistsException(
                    "User with username " + user.getUsername() + " already exists");
        }
        User savedUser = userRepository.save(user);
        logAction("User", savedUser.getId(), "CREATE", null, savedUser.toString());
        return savedUser;
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
