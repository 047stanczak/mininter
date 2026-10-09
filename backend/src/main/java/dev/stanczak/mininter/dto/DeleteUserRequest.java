package dev.stanczak.mininter.dto;

import jakarta.validation.constraints.NotBlank;

public class DeleteUserRequest {

    @NotBlank (message = "A senha é obrigatória")
    private String password;

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
    
}
