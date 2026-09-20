package dev.stanczak.mininter.controllers;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import dev.stanczak.mininter.api.ApiResponse;
import dev.stanczak.mininter.models.Users;
import dev.stanczak.mininter.services.UserService;


@RestController
@RequestMapping("/api/users")
public class UsersController {

    private final UserService userService;

    UsersController(UserService userService) {
        this.userService = userService;
    }

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

    @PostMapping("/avatar")
    public ApiResponse<String> uploadAvatar(@AuthenticationPrincipal Users users, MultipartFile file) throws Exception{
        userService.uploadAvatar(users, file);
        return ApiResponse.ok("Upload realizado com sucesso", null);
    }

}