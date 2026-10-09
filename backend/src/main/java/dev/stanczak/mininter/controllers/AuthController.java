package dev.stanczak.mininter.controllers;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dev.stanczak.mininter.api.ApiResponse;
import dev.stanczak.mininter.dto.LoginRequest;
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
    public ApiResponse<String> register(@Valid @RequestBody RegisterRequest registerRequest) {
        String token = authService.register(registerRequest);
        return ApiResponse.created("Usuário registrado com sucesso", token);
    }

    @PostMapping("/login")
    public ApiResponse<String> login(@Valid @RequestBody LoginRequest loginRequest) {
        String token = authService.login(loginRequest);
        return ApiResponse.ok("Login realizado com sucesso", token);
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
