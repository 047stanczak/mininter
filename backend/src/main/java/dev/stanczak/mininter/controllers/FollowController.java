package dev.stanczak.mininter.controllers;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users/{userId}")
public class FollowController {
    
    @GetMapping("/followers")
    public String getFollowers() {
        return "Get followers endpoint";
    }

    @GetMapping("/following")
    public String getFollowing() {
        return "Get following endpoint";
    }

    @PostMapping("/follow")
    public String followUser() {
        return "Follow user endpoint";
    }

    @DeleteMapping("/follow")
    public String unfollowUser() {
        return "Unfollow user endpoint";
    }

}