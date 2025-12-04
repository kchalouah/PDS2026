package com.sesame.pds2026.securityservice.controller;

import com.sesame.pds2026.securityservice.model.AuditLog;
import com.sesame.pds2026.securityservice.service.AuditLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/audit")
public class AuditLogController {

    @Autowired
    private AuditLogService auditLogService;

    @PostMapping
    public AuditLog createAuditLog(@RequestBody AuditLog auditLog) {
        return auditLogService.createAuditLog(auditLog);
    }

    @GetMapping
    public List<AuditLog> getAllAuditLogs() {
        return auditLogService.getAllAuditLogs();
    }

    @GetMapping("/user/{userId}")
    public List<AuditLog> getAuditLogsByUser(@PathVariable Long userId) {
        return auditLogService.getAuditLogsByUser(userId);
    }

    @GetMapping("/action/{action}")
    public List<AuditLog> getAuditLogsByAction(@PathVariable String action) {
        return auditLogService.getAuditLogsByAction(action);
    }

    @GetMapping("/date-range")
    public List<AuditLog> getAuditLogsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return auditLogService.getAuditLogsByDateRange(start, end);
    }

    @GetMapping("/entity/{entityType}/{entityId}")
    public List<AuditLog> getAuditLogsByEntity(@PathVariable String entityType, @PathVariable Long entityId) {
        return auditLogService.getAuditLogsByEntity(entityType, entityId);
    }
}
