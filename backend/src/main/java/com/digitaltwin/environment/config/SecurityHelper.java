package com.digitaltwin.environment.config;

import org.springframework.stereotype.Component;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.UUID;

@Component
public class SecurityHelper {

    private static final String SALT = "DigitalEnvironmentTwin2026SecureSalt!";

    public String hashPassword(String rawPassword) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest((rawPassword + SALT).getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not available", e);
        }
    }

    public boolean verifyPassword(String rawPassword, String storedHash) {
        if (rawPassword == null || storedHash == null) return false;
        String computed = hashPassword(rawPassword);
        return computed.equalsIgnoreCase(storedHash);
    }

    public String generateToken(Long userId, String username, String role) {
        long expiresAt = System.currentTimeMillis() + (7L * 24 * 60 * 60 * 1000); // 7 days
        String raw = userId + ":" + username + ":" + role + ":" + expiresAt + ":" + UUID.randomUUID();
        return Base64.getUrlEncoder().withoutPadding().encodeToString(raw.getBytes(StandardCharsets.UTF_8));
    }

    public TokenInfo parseToken(String token) {
        try {
            if (token == null || token.isBlank()) return null;
            if (token.startsWith("Bearer ")) {
                token = token.substring(7).trim();
            }
            byte[] decoded = Base64.getUrlDecoder().decode(token);
            String raw = new String(decoded, StandardCharsets.UTF_8);
            String[] parts = raw.split(":");
            if (parts.length >= 4) {
                Long userId = Long.parseLong(parts[0]);
                String username = parts[1];
                String role = parts[2];
                long expiresAt = Long.parseLong(parts[3]);
                if (System.currentTimeMillis() > expiresAt) {
                    return null; // Expired
                }
                return new TokenInfo(userId, username, role, true);
            }
        } catch (Exception ignored) {
        }
        return null;
    }

    public static class TokenInfo {
        private final Long userId;
        private final String username;
        private final String role;
        private final boolean valid;

        public TokenInfo(Long userId, String username, String role, boolean valid) {
            this.userId = userId;
            this.username = username;
            this.role = role;
            this.valid = valid;
        }

        public Long getUserId() { return userId; }
        public String getUsername() { return username; }
        public String getRole() { return role; }
        public boolean isValid() { return valid; }
    }
}
