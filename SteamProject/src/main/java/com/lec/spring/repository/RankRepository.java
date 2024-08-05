package com.lec.spring.repository;

import com.lec.spring.domain.Rank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.transaction.annotation.Transactional;

public interface RankRepository extends JpaRepository<Rank, Long> {
    Rank findByAppId (Long appId);

    Rank findByRank (Long game_rank);

}
