package com.tuapp.finanzas.user.service;

import com.tuapp.finanzas.user.dto.CreateUserRequest;
import com.tuapp.finanzas.user.dto.UserDto;
import com.tuapp.finanzas.user.dto.UserSessionDto;

import java.util.List;

public interface UserService {
    UserDto create(CreateUserRequest req);
    List<UserDto> findAll();
    UserDto findById(Long id);
    UserDto getProfile(String username);
    void updatePassword(String username, String currentPassword, String newPassword);
    List<UserSessionDto> getActiveSessions(String username);
    void terminateOtherSessions(String username, String currentToken);
}
