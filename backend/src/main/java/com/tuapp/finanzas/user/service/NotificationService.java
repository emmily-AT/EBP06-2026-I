package com.tuapp.finanzas.user.service;

import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class NotificationService {
    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);

    public void notifyPasswordChanged(String email) {
        // In a real implementation, this would send an email or push notification
        logger.info("NOTIFICATION: Password has been changed for user with email: {}", email);
    }
}
