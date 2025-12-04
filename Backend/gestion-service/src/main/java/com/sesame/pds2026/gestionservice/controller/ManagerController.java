package com.sesame.pds2026.gestionservice.controller;

import com.sesame.pds2026.gestionservice.model.Manager;
import com.sesame.pds2026.gestionservice.service.ManagerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/managers")
public class ManagerController {

    @Autowired
    private ManagerService managerService;

    @PostMapping
    public Manager createManager(@RequestBody Manager manager) {
        return managerService.createManager(manager);
    }

    @GetMapping
    public List<Manager> getAllManagers() {
        return managerService.getAllManagers();
    }

    @GetMapping("/{id}")
    public Manager getManagerById(@PathVariable Long id) {
        return managerService.getManagerById(id);
    }

    @GetMapping("/user/{userId}")
    public Manager getManagerByUserId(@PathVariable Long userId) {
        return managerService.getManagerByUserId(userId);
    }

    @PutMapping("/{id}")
    public Manager updateManager(@PathVariable Long id, @RequestBody Manager manager) {
        return managerService.updateManager(id, manager);
    }
}
