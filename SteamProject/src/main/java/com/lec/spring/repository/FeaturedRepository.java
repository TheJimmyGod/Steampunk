package com.lec.spring.repository;

import com.lec.spring.domain.Featured;
import com.lec.spring.domain.Game;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface FeaturedRepository extends JpaRepository <Featured, Long> {
    @Query("SELECT f FROM f_games f ORDER BY RAND() LIMIT 5")
    List<Featured> findFeaturedOrderedRandomly();
}
