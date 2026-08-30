package dev.stanczak.mininter.services;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import dev.stanczak.mininter.dto.RegisterRequest;
import dev.stanczak.mininter.models.Users;
import dev.stanczak.mininter.repositories.UsersRepository;

@Service
public class AuthService {

    final UsersRepository usersRepository;
    final PasswordEncoder passwordEncoder;

    AuthService(UsersRepository usersRepository, PasswordEncoder passwordEncoder) {
        this.usersRepository = usersRepository;
        this.passwordEncoder = passwordEncoder;
    }
    
    public void register(RegisterRequest registerRequest) {
        
        Users user = new Users();
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setDisplayName(registerRequest.getDisplayName());
        user.setBio(registerRequest.getBio());
        user.setStatus(registerRequest.getStatus());

        usersRepository.save(user);
    }

    public void login() {
        // Login logic
    }

    public void logout() {
        // Logout logic
    }

    public void refreshToken() {
        // Refresh token logic
    }

    public void validateToken() {
        // Token validation logic
    }

}