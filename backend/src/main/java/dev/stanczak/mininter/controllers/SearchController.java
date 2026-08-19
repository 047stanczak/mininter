package dev.stanczak.mininter.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/search")
public class SearchController {

    @GetMapping("/users")
    public String searchUsers() {
        return "Search users endpoint";
    }

    @GetMapping("/posts")
    public String searchPosts() {
        return "Search posts endpoint";
    }

    @GetMapping("/communities")
    public String searchCommunities() {
        return "Search communities endpoint";
    }
}
