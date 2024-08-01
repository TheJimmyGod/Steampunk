package com.lec.spring.repository;

import com.lec.spring.domain.Game;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GameRepository extends JpaRepository<Game, Long> {
    Game findByAppId(Long appId);

}
