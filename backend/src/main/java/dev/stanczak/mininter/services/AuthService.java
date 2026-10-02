package dev.stanczak.mininter.services;

import java.time.LocalDateTime;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import dev.stanczak.mininter.dto.LoginRequest;
import dev.stanczak.mininter.dto.RegisterRequest;
import dev.stanczak.mininter.exceptions.EmailAlreadyExistsException;
import dev.stanczak.mininter.exceptions.InvalidCredentialsException;
import dev.stanczak.mininter.models.Users;
import dev.stanczak.mininter.repositories.UsersRepository;
import dev.stanczak.mininter.security.TokenSecurity;

@Service
public class AuthService {

    final UsersRepository usersRepository;
    final PasswordEncoder passwordEncoder;
    final TokenSecurity tokenSecurity;

    AuthService(UsersRepository usersRepository, PasswordEncoder passwordEncoder, TokenSecurity tokenSecurity) {
        this.usersRepository = usersRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenSecurity = tokenSecurity;
    }
    
    public String register(RegisterRequest registerRequest) {

        if (usersRepository.findByEmail(registerRequest.getEmail()) != null) {
            throw new EmailAlreadyExistsException("Email já cadastrado");
        }
        
        Users user = new Users();
        user.setCreatedAt(LocalDateTime.now());
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setDisplayName(registerRequest.getDisplayName());
        user.setBio(registerRequest.getBio());
        user.setStatus(registerRequest.getStatus());

        usersRepository.save(user);
        return tokenSecurity.generateToken(user);
    }

    public String login(LoginRequest loginRequest) {
        Users user = usersRepository.findByEmail(loginRequest.getEmail());

        if (user == null || !passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Email ou senha inválidos");
        }

        user.setLastLoginAt(LocalDateTime.now());
        return tokenSecurity.generateToken(user);
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