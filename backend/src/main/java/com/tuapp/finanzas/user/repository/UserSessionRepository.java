package com.tuapp.finanzas.user.repository;

import com.tuapp.finanzas.user.entity.UserSession;
import com.tuapp.finanzas.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserSessionRepository extends JpaRepository<UserSession, Long> {
    List<UserSession> findByUser(User user);
    Optional<UserSession> findByToken(String token);
    void deleteByUser(User user);
}
