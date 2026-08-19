package dev.stanczak.mininter.controllers;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

   @PostMapping("/register")
    public String register() {
        return "Register endpoint";
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
