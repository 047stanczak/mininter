package dev.stanczak.mininter.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import dev.stanczak.mininter.models.Follow;

@Repository
public interface FollowRepository extends JpaRepository<Follow, Long> {
	void deleteByFollowerIdOrFollowingId(Long userId, Long ignoredUserId);
}
