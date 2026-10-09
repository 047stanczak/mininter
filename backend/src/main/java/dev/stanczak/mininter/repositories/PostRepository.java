package dev.stanczak.mininter.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import dev.stanczak.mininter.models.Post;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
	List<Post> findAllByAuthorId(Long authorId);
	void deleteByAuthorId(Long authorId);
}
