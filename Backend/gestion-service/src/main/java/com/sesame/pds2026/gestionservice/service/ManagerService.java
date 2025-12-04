package com.sesame.pds2026.gestionservice.service;

import com.sesame.pds2026.gestionservice.model.Manager;
import com.sesame.pds2026.gestionservice.repository.ManagerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ManagerService {

    @Autowired
    private ManagerRepository managerRepository;

    public Manager createManager(Manager manager) {
        return managerRepository.save(manager);
    }

    public List<Manager> getAllManagers() {
        return managerRepository.findAll();
    }

    public Manager getManagerById(Long id) {
        return managerRepository.findById(id).orElse(null);
    }

    public Manager getManagerByUserId(Long userId) {
        return managerRepository.findByUserId(userId).orElse(null);
    }

    public Manager updateManager(Long id, Manager manager) {
        Manager existing = managerRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setDepartment(manager.getDepartment());
            existing.setServiceArea(manager.getServiceArea());
            return managerRepository.save(existing);
        }
        return null;
    }
}
