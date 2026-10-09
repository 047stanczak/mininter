
package dev.stanczak.mininter.controllers;

import jakarta.validation.Valid;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import dev.stanczak.mininter.api.ApiResponse;
import dev.stanczak.mininter.dto.DeleteUserRequest;
import dev.stanczak.mininter.dto.UpdatePasswordRequest;
import dev.stanczak.mininter.dto.UpdateUserRequest;
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

    @GetMapping("/profile")
    public ApiResponse<UserResponse> getAuthenticatedUserProfile(@AuthenticationPrincipal Users users) {
        UserResponse userProfile = userService.getUserProfileDetails(users);
        return ApiResponse.ok("Perfil recuperado com sucesso", userProfile);
    }

    @GetMapping("/{userId}/posts")
    public String getUserPosts() {
        return "Get user posts endpoint";
    }

    @PatchMapping("/me")
    public ApiResponse<Void> updateUser(@AuthenticationPrincipal Users users, @Valid @RequestBody UpdateUserRequest updateUserRequest) {
        userService.updateDataUser(users, updateUserRequest);
        return ApiResponse.ok("Usuário atualizado com sucesso", null);
    }

    @PatchMapping("/me/password")
    public ApiResponse<Void> updatePassword(@AuthenticationPrincipal Users users, @Valid @RequestBody UpdatePasswordRequest updatePasswordRequest) {
        userService.updatePassword(users, updatePasswordRequest);
        return ApiResponse.ok("Senha atualizada com sucesso", null);
    }

    @DeleteMapping("/me")
    public ApiResponse<Void> deleteUser(@AuthenticationPrincipal Users users, @Valid @RequestBody DeleteUserRequest deleteUserRequest) {
        userService.deleteUser(users, deleteUserRequest);
        return ApiResponse.ok("Usuário excluído com sucesso", null);
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
