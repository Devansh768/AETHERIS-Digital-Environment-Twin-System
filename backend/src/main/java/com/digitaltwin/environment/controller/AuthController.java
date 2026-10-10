package com.digitaltwin.environment.controller;

import com.digitaltwin.environment.config.SecurityHelper;
import com.digitaltwin.environment.dto.AuthRequest;
import com.digitaltwin.environment.dto.AuthResponse;
import com.digitaltwin.environment.dto.RegisterRequest;
import com.digitaltwin.environment.model.User;
import com.digitaltwin.environment.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;
    private final SecurityHelper securityHelper;

    public AuthController(AuthService authService, SecurityHelper securityHelper) {
        this.authService = authService;
        this.securityHelper = securityHelper;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        AuthResponse resp = authService.authenticate(request);
        if (resp.isSuccess()) {
            return ResponseEntity.ok(resp);
        } else {
            return ResponseEntity.badRequest().body(resp);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        AuthResponse resp = authService.register(request);
        if (resp.isSuccess()) {
            return ResponseEntity.ok(resp);
        } else {
            return ResponseEntity.badRequest().body(resp);
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || authHeader.isBlank()) {
            return ResponseEntity.status(401).body(Map.of("error", "Missing Authorization header"));
        }
        SecurityHelper.TokenInfo tokenInfo = securityHelper.parseToken(authHeader);
        if (tokenInfo == null || !tokenInfo.isValid()) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid or expired session token"));
        }

        Optional<User> userOpt = authService.getUserById(tokenInfo.getUserId());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "User not found"));
        }

        User u = userOpt.get();
        return ResponseEntity.ok(Map.of(
                "id", u.getId(),
                "username", u.getUsername(),
                "email", u.getEmail(),
                "fullName", u.getFullName(),
                "role", u.getRole(),
                "lastLatitude", u.getLastLatitude() != null ? u.getLastLatitude() : 0.0,
                "lastLongitude", u.getLastLongitude() != null ? u.getLastLongitude() : 0.0
        ));
    }

    @PostMapping("/update-location")
    public ResponseEntity<?> updateLocation(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestBody Map<String, Double> payload) {
        Double lat = payload.get("latitude");
        Double lng = payload.get("longitude");

        if (lat == null || lng == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "latitude and longitude required"));
        }

        Long userId = 1L; // Fallback demo operator if unauthenticated
        if (authHeader != null && !authHeader.isBlank()) {
            SecurityHelper.TokenInfo info = securityHelper.parseToken(authHeader);
            if (info != null && info.isValid()) {
                userId = info.getUserId();
            }
        }

        User updated = authService.updateUserLocation(userId, lat, lng);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "latitude", lat,
                "longitude", lng,
                "userId", userId
        ));
    }
}
