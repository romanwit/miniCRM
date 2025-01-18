package com.romanwit.minicrm.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.romanwit.minicrm.model.AuditLog;
import com.romanwit.minicrm.model.FixedListValue;
import com.romanwit.minicrm.repository.AuditLogRepository;
import com.romanwit.minicrm.repository.FixedListValueRepository;

@Service
public class FixedListValueService {

    @Autowired
    private FixedListValueRepository fixedListValueRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    public List<FixedListValue> getAllValues() {
        return fixedListValueRepository.findAll();
    }

    @Transactional
    public FixedListValue createValue(FixedListValue value) {
        FixedListValue savedValue = fixedListValueRepository.save(value);
        logAction("FixedListValue", savedValue.getId(), "CREATE", null, savedValue.toString());
        return savedValue;
    }

    @Transactional
    public FixedListValue updateValue(FixedListValue value) {
        Optional<FixedListValue> existing = fixedListValueRepository.findById(value.getId());
        if (existing.isPresent()) {
            FixedListValue oldValue = existing.get();
            FixedListValue updatedValue = fixedListValueRepository.save(value);
            logAction("FixedListValue", updatedValue.getId(), "UPDATE", oldValue.toString(), updatedValue.toString());
            return updatedValue;
        }
        throw new IllegalArgumentException("FixedListValue not found");
    }

    @Transactional
    public void deleteValue(Long valueId) {
        Optional<FixedListValue> existing = fixedListValueRepository.findById(valueId);
        if (existing.isPresent()) {
            FixedListValue value = existing.get();
            fixedListValueRepository.delete(value);
            logAction("FixedListValue", valueId, "DELETE", value.toString(), null);
        } else {
            throw new IllegalArgumentException("FixedListValue not found");
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
