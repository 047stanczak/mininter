package dev.stanczak.mininter.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import dev.stanczak.mininter.models.Comment;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
}
