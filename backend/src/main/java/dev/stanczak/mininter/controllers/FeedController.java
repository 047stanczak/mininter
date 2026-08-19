package dev.stanczak.mininter.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class FeedController {

    @GetMapping("/feed")
    public String getFeed() {
        return "Get feed endpoint";
    }
}
