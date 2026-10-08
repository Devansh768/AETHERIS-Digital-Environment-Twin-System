package com.digitaltwin.environment.dto;

public class AuthResponse {
    private boolean success;
    private String token;
    private String message;
    private Long userId;
    private String username;
    private String email;
    private String fullName;
    private String role;

    public AuthResponse() {}

    public static AuthResponse success(String token, Long userId, String username, String email, String fullName, String role) {
        AuthResponse resp = new AuthResponse();
        resp.success = true;
        resp.token = token;
        resp.message = "Authentication successful";
        resp.userId = userId;
        resp.username = username;
        resp.email = email;
        resp.fullName = fullName;
        resp.role = role;
        return resp;
    }

    public static AuthResponse failure(String message) {
        AuthResponse resp = new AuthResponse();
        resp.success = false;
        resp.message = message;
        return resp;
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
