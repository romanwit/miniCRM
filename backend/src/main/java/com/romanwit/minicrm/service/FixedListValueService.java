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
import com.romanwit.minicrm.dto.FixedListValueDto;
import com.romanwit.minicrm.exception.ExceptionFilter;

import java.util.Set;
import java.util.stream.Collectors;
import com.romanwit.minicrm.model.CustomerProperty;
import com.romanwit.minicrm.dto.SynchronizationResultDto;
import java.util.ArrayList;

@Service
public class FixedListValueService {

    @Autowired
    private FixedListValueRepository fixedListValueRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    public List<FixedListValueDto> getAllValues() {
        return fixedListValueRepository.findAllBy();
    }

    public List<FixedListValueDto> getValueById(Long id) {
        return fixedListValueRepository.findByPropertyId(id);
    }

    @Transactional
    public SynchronizationResultDto synchronizeValues(Long propertyId, List<String> inputValues) {

        List<FixedListValueDto> existingValues = fixedListValueRepository.findByPropertyId(propertyId)
                .stream()
                .map(flv -> new FixedListValueDto(flv.getId(), flv.getValue()))
                .toList();
        Set<String> existingValueSet = existingValues.stream()
                .map(FixedListValueDto::getValue)
                .collect(Collectors.toSet());

        Set<String> inputValueSet = Set.copyOf(inputValues);
        List<FixedListValueDto> toDelete = existingValues.stream()
                .filter(dto -> !inputValueSet.contains(dto.getValue()))
                .toList();

        List<String> deletedValues = toDelete.stream()
                .map(FixedListValueDto::getValue)
                .toList();

        if (!toDelete.isEmpty()) {
            List<Long> idsToDelete = toDelete.stream()
                    .map(FixedListValueDto::getId)
                    .toList();
            fixedListValueRepository.deleteAllById(idsToDelete);
        }

        List<String> addedValues = new ArrayList<>();
        for (String value : inputValues) {
            if (!fixedListValueRepository.existsByPropertyIdAndValue(propertyId, value)) {
                FixedListValue newValue = new FixedListValue();
                newValue.setValue(value);
                CustomerProperty property = new CustomerProperty();
                property.setId(propertyId);
                newValue.setProperty(property);
                fixedListValueRepository.save(newValue);
                addedValues.add(value);
            }
        }

        return new SynchronizationResultDto(addedValues, deletedValues);
    }

    @Transactional
    public void deleteValues(Long propertyId) {

        if (fixedListValueRepository.existsByPropertyId(propertyId)) {
            fixedListValueRepository.deleteAllByPropertyId(propertyId);
        } else {
            throw new ExceptionFilter.ResourceNotFoundException("Values not found");
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
