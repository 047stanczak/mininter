package dev.stanczak.mininter.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "posts")
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private Users author;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "image_key")
    private String imageKey;


    @Column(nullable = false)
    private String visibility = "public";

    @Column(nullable = false)
    private String status = "active";


    @Column(name = "created_at")
    private String createdAt;


    @Column(name = "updated_at")
    private String updatedAt;


    @Column(name = "published_at")
    private String publishedAt;


    public Long getId() {
        return id;
    }


    public void setId(Long id) {
        this.id = id;
    }


    public Users getAuthor() {
        return author;
    }


    public void setAuthor(Users author) {
        this.author = author;
    }


    public String getContent() {
        return content;
    }


    public void setContent(String content) {
        this.content = content;
    }


    public String getImageKey() {
        return imageKey;
    }


    public void setImageKey(String imageKey) {
        this.imageKey = imageKey;
    }


    public String getVisibility() {
        return visibility;
    }


    public void setVisibility(String visibility) {
        this.visibility = visibility;
    }


    public String getStatus() {
        return status;
    }


    public void setStatus(String status) {
        this.status = status;
    }


    public String getCreatedAt() {
        return createdAt;
    }


    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }


    public String getUpdatedAt() {
        return updatedAt;
    }


    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }


    public String getPublishedAt() {
        return publishedAt;
    }


    public void setPublishedAt(String publishedAt) {
        this.publishedAt = publishedAt;
    }



}