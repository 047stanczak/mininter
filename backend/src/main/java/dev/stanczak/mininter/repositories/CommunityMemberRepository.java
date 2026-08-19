package dev.stanczak.mininter.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import dev.stanczak.mininter.models.CommunityMember;

@Repository
public interface CommunityMemberRepository extends JpaRepository<CommunityMember, Long> {
}
