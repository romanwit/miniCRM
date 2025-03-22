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

import com.romanwit.minicrm.exception.ExceptionFilter;

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
	if (value.getValue() == null || value.getValue().isBlank()) {
        	throw new ExceptionFilter.InvalidRequestException("FixedListValue value cannot be empty");
    	}
        FixedListValue savedValue = fixedListValueRepository.save(value);
        logAction("FixedListValue", savedValue.getId(), "CREATE", null, savedValue.toString());
        return savedValue;
    }

    @Transactional
    public FixedListValue updateValue(FixedListValue value) {
        FixedListValue existing = fixedListValueRepository.findById(value.getId())
        .orElseThrow(() -> new ExceptionFilter.ResourceNotFoundException(
            "FixedListValue with id " + value.getId() + " not found"));
    FixedListValue updatedValue = fixedListValueRepository.save(value);
    logAction("FixedListValue", updatedValue.getId(), "UPDATE", existing.toString(), updatedValue.toString());
    return updatedValue;
    }

    @Transactional
    public void deleteValue(Long valueId) {
        FixedListValue value = fixedListValueRepository.findById(valueId)
        .orElseThrow(() -> new ExceptionFilter.ResourceNotFoundException(
            "FixedListValue with id " + valueId + " not found"));
    fixedListValueRepository.delete(value);
    logAction("FixedListValue", valueId, "DELETE", value.toString(), null);
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
