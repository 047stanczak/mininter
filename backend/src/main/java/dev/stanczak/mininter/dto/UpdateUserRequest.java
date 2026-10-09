package dev.stanczak.mininter.dto;

import jakarta.validation.constraints.Size;

public class UpdateUserRequest {
    
    @Size(min = 1, max = 30)
    private String username;
    @Size(max = 80)
    private String displayName;
    @Size(max = 500)
    private String bio;

    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getDisplayName() {
        return displayName;
    }
    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }
    public String getBio() {
        return bio;
    }
    public void setBio(String bio) {
        this.bio = bio;
    }
}
