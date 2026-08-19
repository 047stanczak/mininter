package dev.stanczak.mininter.controllers;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @PostMapping
    public String createPost() {
        return "Create post endpoint";
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

