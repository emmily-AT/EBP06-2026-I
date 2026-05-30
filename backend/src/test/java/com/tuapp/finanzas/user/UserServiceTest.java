package com.tuapp.finanzas.user;

import com.tuapp.finanzas.user.dto.UserDto;
import com.tuapp.finanzas.user.service.UserService;
import com.tuapp.finanzas.user.service.impl.UserServiceImpl;
import com.tuapp.finanzas.user.repository.UserRepository;
import com.tuapp.finanzas.user.service.NotificationService;
import com.tuapp.finanzas.user.entity.User;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class UserServiceTest {

    private UserRepository userRepository;
    private UserService userService;
    private BCryptPasswordEncoder passwordEncoder;
    private NotificationService notificationService;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepository.class);
        passwordEncoder = new BCryptPasswordEncoder();
        notificationService = mock(NotificationService.class);
        userService = new UserServiceImpl(userRepository, null, passwordEncoder, notificationService);
    }

    @Test
    void updatePassword_Success() {
        User user = new User();
        user.setUsername("user1");
        user.setEmail("test@mail.com");
        user.setPassword(passwordEncoder.encode("OldPass123!"));
        
        when(userRepository.findByUsername("user1")).thenReturn(java.util.Optional.of(user));

        userService.updatePassword("user1", "OldPass123!", "NewPass456!");
        
        verify(userRepository).save(user);
        verify(notificationService).notifyPasswordChanged(user.getEmail());
        assertEquals(0, user.getFailedPasswordChangeAttempts());
    }

    @Test
    void updatePassword_WrongCurrentPassword() {
        User user = new User();
        user.setUsername("user1");
        user.setPassword(passwordEncoder.encode("OldPass123!"));
        
        when(userRepository.findByUsername("user1")).thenReturn(java.util.Optional.of(user));

        assertThrows(ResponseStatusException.class, () -> {
            userService.updatePassword("user1", "WrongPass", "NewPass456!");
        });
        
        assertEquals(1, user.getFailedPasswordChangeAttempts());
    }

    @Test
    void updatePassword_Lockout() {
        User user = new User();
        user.setUsername("user1");
        user.setPassword(passwordEncoder.encode("OldPass123!"));
        user.setFailedPasswordChangeAttempts(5);
        user.setPasswordChangeLockoutUntil(LocalDateTime.now().plusMinutes(15));
        
        when(userRepository.findByUsername("user1")).thenReturn(java.util.Optional.of(user));

        assertThrows(ResponseStatusException.class, () -> {
            userService.updatePassword("user1", "OldPass123!", "NewPass456!");
        });
    }
}
