package dev.stanczak.mininter.controllers;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @PatchMapping("/{commentId}")
    public String updateComment() {
        return "Update comment endpoint";
    }

    @DeleteMapping("/{commentId}")
    public String deleteComment() {
        return "Delete comment endpoint";
    }

    @PostMapping("/{commentId}/replies")
    public String createReply() {
        return "Create reply endpoint";
    }

    @GetMapping("/{commentId}/replies")
    public String getReplies() {
        return "Get replies endpoint";
    }
}
