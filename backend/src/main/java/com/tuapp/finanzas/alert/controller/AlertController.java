package com.tuapp.finanzas.alert.controller;

import com.tuapp.finanzas.alert.entity.Alert;
import com.tuapp.finanzas.alert.repository.AlertRepository;
import com.tuapp.finanzas.user.entity.User;
import com.tuapp.finanzas.user.service.UserLookup;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
public class AlertController {

    private final AlertRepository alertRepository;
    private final UserLookup userLookup;

    public AlertController(AlertRepository alertRepository, UserLookup userLookup) {
        this.alertRepository = alertRepository;
        this.userLookup = userLookup;
    }

    @GetMapping
    public List<Alert> getAlerts() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userLookup.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return alertRepository.findByUserId(user.getId());
    }
}
