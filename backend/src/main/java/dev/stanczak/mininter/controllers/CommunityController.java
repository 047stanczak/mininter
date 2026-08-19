package dev.stanczak.mininter.controllers;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/communities")
public class CommunityController {

    @PostMapping
    public String createCommunity() {
        return "Create community endpoint";
    }

    @GetMapping
    public String getCommunities() {
        return "Get communities endpoint";
    }

    @GetMapping("/{communityId}")
    public String getCommunity() {
        return "Get community endpoint";
    }

    @PatchMapping("/{communityId}")
    public String updateCommunity() {
        return "Update community endpoint";
    }

    @DeleteMapping("/{communityId}")
    public String deleteCommunity() {
        return "Delete community endpoint";
    }

    @PostMapping("/{communityId}/members")
    public String joinCommunity() {
        return "Join community endpoint";
    }

    @DeleteMapping("/{communityId}/members")
    public String leaveCommunity() {
        return "Leave community endpoint";
    }

    @GetMapping("/{communityId}/members")
    public String getCommunityMembers() {
        return "Get community members endpoint";
    }

    @PostMapping("/{communityId}/posts")
    public String createCommunityPost() {
        return "Create community post endpoint";
    }

    @GetMapping("/{communityId}/posts")
    public String getCommunityPosts() {
        return "Get community posts endpoint";
    }
}
