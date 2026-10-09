package dev.stanczak.mininter.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import dev.stanczak.mininter.models.Comment;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
	@Query("select c.id from Comment c where c.author.id = :userId or c.post.author.id = :userId")
	List<Long> findIdsForUserOrTheirPosts(@Param("userId") Long userId);

	@Modifying
	@Query("update Comment c set c.parentComment = null where c.parentComment.id in :commentIds")
	void clearParentReferences(@Param("commentIds") List<Long> commentIds);
}
