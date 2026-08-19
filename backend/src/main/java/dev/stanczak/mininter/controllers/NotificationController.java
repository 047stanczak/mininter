package dev.stanczak.mininter.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @GetMapping
    public String getNotifications() {
        return "Get notifications endpoint";
    }

    @PatchMapping("/{notificationId}/read")
    public String markNotificationAsRead() {
        return "Mark notification as read endpoint";
    }

    @PatchMapping("/read-all")
    public String markAllNotificationsAsRead() {
        return "Mark all notifications as read endpoint";
    }
}
