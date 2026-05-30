package com.tuapp.finanzas.user.service;

import com.tuapp.finanzas.user.entity.User;
import java.util.Optional;

/**
 * Read-only, minimal contract to look up users by username.
 * This keeps consumers decoupled from the full UserRepository (which
 * extends JpaRepository with many methods they don't need) — applying
 * the Interface Segregation Principle.
 */
public interface UserLookup {
    Optional<User> findByUsername(String username);
}
