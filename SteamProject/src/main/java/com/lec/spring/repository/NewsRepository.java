package com.lec.spring.repository;

import com.lec.spring.domain.Game;
import com.lec.spring.domain.News;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NewsRepository extends JpaRepository<News, Long> {
    News findByAppId(Long appId);
    Boolean existsByAppId(Long appId);
    Page<News> findAllByIsFree(Boolean isFree, Pageable pageable);
    List<News> findNewsByGameNameContainingIgnoreCase(String gameName);
}
