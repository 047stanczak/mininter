package dev.stanczak.mininter.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import dev.stanczak.mininter.models.Like;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {
}
