package com.digitaltwin.environment.service;

import com.digitaltwin.environment.config.SecurityHelper;
import com.digitaltwin.environment.dto.AuthRequest;
import com.digitaltwin.environment.dto.AuthResponse;
import com.digitaltwin.environment.dto.RegisterRequest;
import com.digitaltwin.environment.model.User;
import com.digitaltwin.environment.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final SecurityHelper securityHelper;

    public AuthService(UserRepository userRepository, SecurityHelper securityHelper) {
        this.userRepository = userRepository;
        this.securityHelper = securityHelper;
    }

    public AuthResponse authenticate(AuthRequest request) {
        if (request.getUsername() == null || request.getPassword() == null) {
            return AuthResponse.failure("Username and password are required.");
        }

        // Allow login by either username or email
        Optional<User> userOpt = userRepository.findByUsername(request.getUsername());
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByEmail(request.getUsername());
        }

        if (userOpt.isEmpty()) {
            return AuthResponse.failure("Invalid credentials. Account not found.");
        }

        User user = userOpt.get();
        if (!securityHelper.verifyPassword(request.getPassword(), user.getPasswordHash())) {
            return AuthResponse.failure("Invalid credentials. Incorrect password.");
        }

        String token = securityHelper.generateToken(user.getId(), user.getUsername(), user.getRole());
        return AuthResponse.success(
                token,
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getRole()
        );
    }

    public AuthResponse register(RegisterRequest request) {
        if (request.getUsername() == null || request.getUsername().isBlank()) {
            return AuthResponse.failure("Username is required.");
        }
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            return AuthResponse.failure("Email address is required.");
        }
        if (request.getPassword() == null || request.getPassword().length() < 6) {
            return AuthResponse.failure("Password must be at least 6 characters long.");
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            return AuthResponse.failure("Username already exists. Please choose another.");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            return AuthResponse.failure("Email already registered. Please login instead.");
        }

        String fullName = (request.getFullName() != null && !request.getFullName().isBlank()) 
                ? request.getFullName() 
                : request.getUsername();
        String role = (request.getRole() != null && !request.getRole().isBlank()) 
                ? request.getRole().toUpperCase() 
                : "OPERATOR";

        User newUser = new User(
                request.getUsername().trim(),
                request.getEmail().trim().toLowerCase(),
                securityHelper.hashPassword(request.getPassword()),
                fullName,
                role
        );

        if (request.getLatitude() != null && request.getLongitude() != null) {
            newUser.setLastLatitude(request.getLatitude());
            newUser.setLastLongitude(request.getLongitude());
        }

        User saved = userRepository.save(newUser);
        String token = securityHelper.generateToken(saved.getId(), saved.getUsername(), saved.getRole());

        return AuthResponse.success(
                token,
                saved.getId(),
                saved.getUsername(),
                saved.getEmail(),
                saved.getFullName(),
                saved.getRole()
        );
    }

    public User updateUserLocation(Long userId, Double latitude, Double longitude) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setLastLatitude(latitude);
            user.setLastLongitude(longitude);
            return userRepository.save(user);
        }
        return null;
    }

    public Optional<User> getUserById(Long userId) {
        return userRepository.findById(userId);
    }
}
