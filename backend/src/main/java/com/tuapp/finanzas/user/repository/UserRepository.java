package com.tuapp.finanzas.user.repository;

import com.tuapp.finanzas.user.entity.User;
import com.tuapp.finanzas.user.service.UserLookup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long>, UserLookup {
    // findByUsername is declared in UserLookup; JpaRepository provides implementation
}
