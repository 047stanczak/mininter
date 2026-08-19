package dev.stanczak.mininter.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @PostMapping
    public String createReport() {
        return "Create report endpoint";
    }

    @GetMapping("/{reportId}")
    public String getReport() {
        return "Get report endpoint";
    }
}
