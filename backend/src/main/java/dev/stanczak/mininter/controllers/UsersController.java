package dev.stanczak.mininter.controllers;

import java.util.Optional;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import dev.stanczak.mininter.api.ApiResponse;
import dev.stanczak.mininter.dto.UserResponse;
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
    public ApiResponse<UserResponse> getUser(@PathVariable Long userId) {
        return userService.getUsersById(userId)
            .map(user -> ApiResponse.ok("Usuário encontrado", user))
            .orElseGet(() -> ApiResponse.notFound("Usuário não encontrado"));
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

    @GetMapping ("/avatar")
    public ApiResponse<String> getAvatar(@AuthenticationPrincipal Users users) throws Exception{
        String avatarUrl = userService.getAvatar(users);
        return ApiResponse.ok("Avatar recuperado com sucesso", avatarUrl);
    }

}