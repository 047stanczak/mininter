package dev.stanczak.mininter.controllers;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dev.stanczak.mininter.api.ApiResponse;
import dev.stanczak.mininter.dto.PostRequest;
import dev.stanczak.mininter.models.Users;
import dev.stanczak.mininter.services.PostService;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public ApiResponse<String> createPost(@AuthenticationPrincipal Users users, @ModelAttribute PostRequest postRequest) throws Exception {
        postService.createPost(users, postRequest);
        return ApiResponse.ok("Post criado com sucesso", null);
    }

    @GetMapping
    public String getPosts() {
        return "Get posts endpoint";
    }

    @GetMapping("/{postId}")
    public String getPost() {
        return "Get post endpoint";
    }

    @PatchMapping("/{postId}")
    public String updatePost() {
        return "Update post endpoint";
    }

    @DeleteMapping("/{postId}")
    public String deletePost() {
        return "Delete post endpoint";
    }

    @PostMapping("/{postId}/likes")
    public String likePost() {
        return "Like post endpoint";
    }

    @DeleteMapping("/{postId}/likes")
    public String unlikePost() {
        return "Unlike post endpoint";
    }

    @PostMapping("/{postId}/comments")
    public String createComment() {
        return "Create comment endpoint";
    }

    @GetMapping("/{postId}/comments")
    public String getCommentsByPost() {
        return "Get comments by post endpoint";
    }

    @PostMapping("/{postId}/share")
    public String sharePost() {
        return "Share post endpoint";
    }
}

