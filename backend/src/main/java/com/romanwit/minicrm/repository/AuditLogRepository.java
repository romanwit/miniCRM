package com.romanwit.minicrm.repository;

import com.romanwit.minicrm.model.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {}

