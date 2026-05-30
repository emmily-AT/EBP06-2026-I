package com.tuapp.finanzas.user.service.impl;

import com.tuapp.finanzas.user.dto.CreateUserRequest;
import com.tuapp.finanzas.user.dto.UserDto;
import com.tuapp.finanzas.user.dto.UserSessionDto;
import com.tuapp.finanzas.user.entity.User;
import com.tuapp.finanzas.user.entity.UserSession;
import com.tuapp.finanzas.user.repository.UserRepository;
import com.tuapp.finanzas.user.repository.UserSessionRepository;
import com.tuapp.finanzas.user.service.NotificationService;
import com.tuapp.finanzas.user.service.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserSessionRepository sessionRepository;
    private final PasswordEncoder passwordEncoder;
    private final NotificationService notificationService;

    public UserServiceImpl(UserRepository userRepository, UserSessionRepository sessionRepository, PasswordEncoder passwordEncoder, NotificationService notificationService) {
        this.userRepository = userRepository;
        this.sessionRepository = sessionRepository;
        this.passwordEncoder = passwordEncoder;
        this.notificationService = notificationService;
    }

    @Override
    public UserDto create(CreateUserRequest req) {
        User u = new User();
        u.setUsername(req.getUsername());
        u.setEmail(req.getEmail());
        u.setPassword(passwordEncoder.encode(req.getPassword()));
        u.setFullName(req.getFullName());
        User saved = userRepository.save(u);
        return toDto(saved);
    }

    @Override
    public List<UserDto> findAll() {
        return userRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public UserDto findById(Long id) {
        return userRepository.findById(id).map(this::toDto).orElse(null);
    }

    @Override
    public UserDto getProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return toDto(user);
    }

    @Override
    public void updatePassword(String username, String currentPassword, String newPassword) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        // Check for lockout
        if (user.getPasswordChangeLockoutUntil() != null && user.getPasswordChangeLockoutUntil().isAfter(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Too many failed attempts. Account locked for password change. Please try again later.");
        }

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            int attempts = user.getFailedPasswordChangeAttempts() + 1;
            user.setFailedPasswordChangeAttempts(attempts);
            
            if (attempts >= 5) {
                user.setPasswordChangeLockoutUntil(LocalDateTime.now().plusMinutes(15));
                user.setFailedPasswordChangeAttempts(0); // Reset after lockout applied
            }
            
            userRepository.save(user);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Current password incorrect");
        }

        // Success: Reset attempts and update password
        user.setFailedPasswordChangeAttempts(0);
        user.setPasswordChangeLockoutUntil(null);
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        
        notificationService.notifyPasswordChanged(user.getEmail());
    }

    @Override
    public List<UserSessionDto> getActiveSessions(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        
        return sessionRepository.findByUser(user).stream()
                .map(s -> new UserSessionDto(s.getId(), s.getDevice(), s.getIpAddress(), s.getLastActivity()))
                .collect(Collectors.toList());
    }

    @Override
    public void terminateOtherSessions(String username, String currentToken) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        List<UserSession> sessions = sessionRepository.findByUser(user);
        for (UserSession s : sessions) {
            if (!s.getToken().equals(currentToken)) {
                sessionRepository.delete(s);
            }
        }
    }

    private UserDto toDto(User u) {
        return new UserDto(u.getId(), u.getUsername(), u.getEmail(), u.getFullName(), u.getCurrency(), u.getRole());
    }
}
