package com.lec.spring.repository;

import com.lec.spring.domain.Game;
import com.lec.spring.domain.News;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NewsRepository extends JpaRepository<News, Long> {
    News findByAppId(Long appId);
    Boolean existsByAppId(Long appId);
}
