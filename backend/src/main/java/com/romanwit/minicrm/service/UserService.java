package com.romanwit.minicrm.service;

import com.romanwit.minicrm.model.User;
import com.romanwit.minicrm.repository.UserRepository;
import com.romanwit.minicrm.repository.AuditLogRepository;
import com.romanwit.minicrm.model.AuditLog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Transactional
    public User createUser(User user) {
        User savedUser = userRepository.save(user);
        logAction("User", savedUser.getId(), "CREATE", null, savedUser.toString());
        return savedUser;
    }

    @Transactional
    public User updateUser(User user) {
        Optional<User> existing = userRepository.findById(user.getId());
        if (existing.isPresent()) {
            User oldUser = existing.get();
            User updatedUser = userRepository.save(user);
            logAction("User", updatedUser.getId(), "UPDATE", oldUser.toString(), updatedUser.toString());
            return updatedUser;
        }
        throw new IllegalArgumentException("User not found");
    }

    @Transactional
    public void deleteUser(Long userId) {
        Optional<User> existing = userRepository.findById(userId);
        if (existing.isPresent()) {
            User user = existing.get();
            userRepository.delete(user);
            logAction("User", userId, "DELETE", user.toString(), null);
        } else {
            throw new IllegalArgumentException("User not found");
        }
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

