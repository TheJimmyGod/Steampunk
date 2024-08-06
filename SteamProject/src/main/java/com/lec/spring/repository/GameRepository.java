package com.lec.spring.repository;

import com.lec.spring.domain.Game;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GameRepository extends JpaRepository<Game, Long> {
    Game findByAppId(Long appId);

    // 게임 이름에 검색어가 포함된 게임들을 검색하는 메소드
    List<Game> findByGameNameContaining(String gameName);

    List<Game> findGamesByAppId(Long appId);
}
