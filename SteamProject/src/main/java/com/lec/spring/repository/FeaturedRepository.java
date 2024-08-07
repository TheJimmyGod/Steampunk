package com.lec.spring.repository;

import com.lec.spring.domain.Featured;
import com.lec.spring.domain.Game;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FeaturedRepository extends JpaRepository <Featured, Long> {
    Optional<Featured> findByAppId(Long appId);
}
