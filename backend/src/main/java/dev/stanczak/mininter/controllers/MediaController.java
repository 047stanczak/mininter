package dev.stanczak.mininter.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/media")
public class MediaController {

    @PostMapping("/upload")
    public String uploadMedia() {
        return "Upload media endpoint";
    }

    @GetMapping("/{mediaId}")
    public String getMedia() {
        return "Get media endpoint";
    }
}
