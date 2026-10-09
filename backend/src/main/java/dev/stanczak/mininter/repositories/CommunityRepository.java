package dev.stanczak.mininter.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import dev.stanczak.mininter.models.Community;

@Repository
public interface CommunityRepository extends JpaRepository<Community, Long> {
	List<Community> findAllByOwnerId(Long ownerId);
	void deleteByOwnerId(Long ownerId);
}
