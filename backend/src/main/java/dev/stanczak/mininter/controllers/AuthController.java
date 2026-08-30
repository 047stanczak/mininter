package dev.stanczak.mininter.controllers;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dev.stanczak.mininter.api.ApiResponse;
import dev.stanczak.mininter.dto.RegisterRequest;
import dev.stanczak.mininter.services.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    AuthController(AuthService authService) {
        this.authService = authService;
    }

   @PostMapping("/register")
    public ApiResponse<Void> register(@RequestBody RegisterRequest registerRequest) {
        authService.register(registerRequest);
        return ApiResponse.ok("User registered successfully");
    }

    @PostMapping("/login")
    public String login() {
        return "Login endpoint";
    }

    @PostMapping("/logout")
    public String logout() {
        return "Logout endpoint";
    }

    @PostMapping("/refresh")
    public String refresh() {
        return "Refresh endpoint";
    }
    
}
