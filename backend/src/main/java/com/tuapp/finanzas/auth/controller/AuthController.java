package com.tuapp.finanzas.auth.controller;

import com.tuapp.finanzas.auth.dto.AuthResponse;
import com.tuapp.finanzas.auth.dto.LoginRequest;
import com.tuapp.finanzas.user.dto.CreateUserRequest;
import com.tuapp.finanzas.user.dto.UserDto;
import com.tuapp.finanzas.user.service.UserLookup;
import com.tuapp.finanzas.user.service.UserService;
import com.tuapp.finanzas.auth.service.JwtService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.context.SecurityContextHolder;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserService userService;
    private final UserLookup userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    public AuthController(UserService userService, UserLookup userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @GetMapping("/me")
    public ResponseEntity<?> me() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED).body(java.util.Map.of("error", "Unauthorized"));
        }
        var opt = userRepository.findByUsername(auth.getName());
        if (opt.isPresent()) {
            var u = opt.get();
            return ResponseEntity.ok(new UserDto(u.getId(), u.getUsername(), u.getFullName()));
        }
        return ResponseEntity.status(org.springframework.http.HttpStatus.NOT_FOUND).body(java.util.Map.of("error", "User not found"));
    }

    @GetMapping("/ping")
    public ResponseEntity<String> ping() {
        return ResponseEntity.ok("auth ok");
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody CreateUserRequest req) {
        logger.info("Register request body: {}", req);
        if (userRepository.findByUsername(req.getUsername()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(java.util.Map.of("error", "Email already exists"));
        }
        UserDto created = userService.create(req);
        return ResponseEntity.ok(created);
    }

    // Debugging helper: echoes parsed body without validation
    @PostMapping("/echo")
    public ResponseEntity<CreateUserRequest> echo(@RequestBody CreateUserRequest req) {
        return ResponseEntity.ok(req);
    }

    // Debugging helper: return raw request body as text
    @PostMapping("/raw")
    public ResponseEntity<String> raw(@RequestBody String body) {
        try {
            logger.info("Raw body: {}", body);
            return ResponseEntity.ok(body);
        } catch (Exception ex) {
            logger.error("Error in raw endpoint", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        var maybeUser = userRepository.findByUsername(req.getUsername());
        if (maybeUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(java.util.Map.of("error", "Invalid credentials"));
        }
        var user = maybeUser.get();
        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(java.util.Map.of("error", "Invalid credentials"));
        }
        String token = jwtService.generateToken(user.getUsername());
        java.util.Map<String, Object> resp = new java.util.HashMap<>();
        resp.put("token", token);
        resp.put("userId", user.getId());
        resp.put("username", user.getUsername());
        resp.put("fullName", user.getFullName());
        return ResponseEntity.ok(resp);
    }
}
