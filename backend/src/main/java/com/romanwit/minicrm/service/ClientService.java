package com.romanwit.minicrm.service;

import com.romanwit.minicrm.model.Client;
import com.romanwit.minicrm.repository.ClientRepository;
import com.romanwit.minicrm.repository.AuditLogRepository;
import com.romanwit.minicrm.model.AuditLog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ClientService {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }

    @Transactional
    public Client createClient(Client client) {
        Client savedClient = clientRepository.save(client);
        logAction("Client", savedClient.getId(), "CREATE", null, savedClient.toString());
        return savedClient;
    }

    @Transactional
    public Client updateClient(Client client) {
        Optional<Client> existing = clientRepository.findById(client.getId());
        if (existing.isPresent()) {
            Client oldClient = existing.get();
            Client updatedClient = clientRepository.save(client);
            logAction("Client", updatedClient.getId(), "UPDATE", oldClient.toString(), updatedClient.toString());
            return updatedClient;
        }
        throw new IllegalArgumentException("Client not found");
    }

    @Transactional
    public void deleteClient(Long clientId) {
        Optional<Client> existing = clientRepository.findById(clientId);
        if (existing.isPresent()) {
            Client client = existing.get();
            clientRepository.delete(client);
            logAction("Client", clientId, "DELETE", client.toString(), null);
        } else {
            throw new IllegalArgumentException("Client not found");
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

