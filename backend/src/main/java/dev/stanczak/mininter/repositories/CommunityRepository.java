package dev.stanczak.mininter.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import dev.stanczak.mininter.models.Community;

@Repository
public interface CommunityRepository extends JpaRepository<Community, Long> {
}
