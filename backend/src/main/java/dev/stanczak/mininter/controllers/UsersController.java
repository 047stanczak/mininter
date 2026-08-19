package dev.stanczak.mininter.controllers;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UsersController {

    @GetMapping("/{userId}")
    public String getUser() {
        return "Get user endpoint";
    }

    @GetMapping("/{userId}/posts")
    public String getUserPosts() {
        return "Get user posts endpoint";
    }

    @PatchMapping("/{userId}")
    public String updateUser() {
        return "Update user endpoint";
    }

    @DeleteMapping("/{userId}")
    public String deleteUser() {
        return "Delete user endpoint";
    }

}